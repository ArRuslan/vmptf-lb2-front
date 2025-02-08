import "./main.css";
import React, {useEffect, useState} from "react";
import ArticleItem from "./components/article_item.tsx";
import {Article, Comment} from "./entities.ts";
import TopBar from "./components/top_bar.tsx";
import {useAppStore} from "./state.ts";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import EditArticleModal from "./components/edit_article_modal.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentItem from "./components/comment_item.tsx";

interface ArticlePageProps {
    article_id: number,
}

interface CommentPaginationResult {
    count: number,
    result: Comment[],
}

export default function ArticlePage({article_id}: ArticlePageProps) {
    const [article, setArticle] = useState(null as (Article | null));
    const user_id = useAppStore(state => state.user_id);
    const token = useAppStore(state => state.token);
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();
    const [commentsCount, setCommentsCount] = useState(0);
    const [commentsPage, setCommentsPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [comments, setComments] = useState([] as Comment[]);

    const fetchArticle = () => {
        if (article !== null) return;

        fetch(`http://127.0.0.1:3000/articles/${article_id}`).then(response => {
            if(response.status === 404) {
                navigate("/articles");
                return;
            }
            return response.json();
        }).then(json_ => {
            setArticle(json_ as Article);
        })
    }

    useEffect(() => {
        fetchArticle();
    }, [article]);

    const closeEditModal = (edited: boolean) => {
        setEditOpen(false);
        if(edited)
            setArticle(null);
    }

    const fetchComments = () => {
        if (!hasMoreComments) return;

        fetch(`http://127.0.0.1:3000/comments/${article_id}?page_size=10&page=${commentsPage}`).then(
            response => response.json()
        ).then(json_ => {
            const result = json_ as CommentPaginationResult;
            setHasMoreComments((comments.length + result.result.length) < result.count)
            setComments([...comments, ...result.result]);
            setCommentsPage(commentsPage + 1);
            setCommentsCount(result.count);
        })
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const postComment = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const text = form.text.value;

        fetch(`http://127.0.0.1:3000/comments/${article_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({"text": text})
        }).then(
            response => response.json()
        ).then(result => {
            if(result.errors) {
                // TODO: show errors
                return;
            }

            if(!result.id) {
                return;
            }

            location.reload();
        });
    }

    const deleteArticle = () => {
        fetch(`http://127.0.0.1:3000/articles/${article_id}`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`},
        }).then(response => {
            if(response.status === 204) {
                navigate("/articles");
            }
        });
    }

    return (
        <>
            <TopBar/>
            <div className="article-buttons">
                {user_id !== null && article != null && user_id === article.publisher.id && (
                    <div className="article-buttons-inner">
                        <button className="app-button" onClick={() => setEditOpen(true)}>Edit article</button>
                        <button className="app-button btn-red" onClick={deleteArticle}>Delete article</button>
                    </div>
                )}
            </div>
            <div className="container article-list">
                {article !== null && <ArticleItem article={article} fetchCommentsCount={false}></ArticleItem>}
            </div>

            {
                user_id && (
                    <form onSubmit={postComment} className="comment-form">
                        <textarea className="app-input inp-white" placeholder="Comment" name="text" rows={8}></textarea>
                        <span></span>
                        <button className="app-button" type="submit">Comment</button>
                    </form>
                )
            }

            <div className="comments-container">
                <h2>{commentsCount} Comments</h2>
                    <InfiniteScroll
                        dataLength={comments.length}
                        next={fetchComments}
                        hasMore={hasMoreComments}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{textAlign: 'center'}}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        {comments.map(comment => (
                            <CommentItem comment={comment}></CommentItem>
                        ))}
                    </InfiniteScroll>
            </div>

            <Modal
                isOpen={editOpen}
                onRequestClose={() => setEditOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
            >
                {article != null && <EditArticleModal article={article} close={closeEditModal}/>}
            </Modal>
        </>
    )
}