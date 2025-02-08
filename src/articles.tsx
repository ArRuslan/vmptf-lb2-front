import "./main.css";
import {useEffect, useMemo, useState} from "react";
import ArticleItem from "./components/article_item.tsx";
import {Article} from "./entities.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import TopBar from "./components/top_bar.tsx";
import {useAppStore} from "./state.ts";
import Modal from "react-modal";
import CreateArticleModal from "./components/create_article_modal.tsx";
import {useLocation} from "react-router-dom";

interface ArticlePaginationResult {
    count: number,
    result: Article[],
}

export default function ArticlesPage() {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [articles, setArticles] = useState([] as Article[]);
    const user_id = useAppStore(state => state.user_id);
    const [createOpen, setCreateOpen] = useState(false);
    const {search} = useLocation();
    const query = useMemo(
        () => new URLSearchParams(search),
        [search]
    );

    const fetchData = () => {
        if (!hasMore) return;

        let params = `page_size=10&page=${page}`;
        if(query.has("category_id"))
            params += `&category_id=${query.get("category_id")}`;
        if(query.has("publisher_id"))
            params += `&publisher_id=${query.get("publisher_id")}`;
        if(query.has("title"))
            params += `&title=${query.get("title")}`;

        fetch(`http://127.0.0.1:3000/articles/search?${params}`).then(
            response => response.json()
        ).then(json_ => {
            const result = json_ as ArticlePaginationResult;
            setHasMore((articles.length + result.result.length) < result.count)
            setArticles([...articles, ...result.result]);
            setPage(page + 1);
        })
    }

    useEffect(() => {
        fetchData();
    }, [page]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setArticles([]);
    }, [query]);

    return (
        <>
            <TopBar/>
            <div className="article-buttons">
                {user_id !== null && <button className="app-button" onClick={() => setCreateOpen(true)}>New article</button>}
            </div>
            <div className="container article-list">
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {articles.map(article => (
                        <ArticleItem article={article} fetchCommentsCount={true}></ArticleItem>
                    ))}
                </InfiniteScroll>
            </div>

            <Modal
                isOpen={createOpen}
                onRequestClose={() => setCreateOpen(false)}
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
                <CreateArticleModal close={() => setCreateOpen(false)}/>
            </Modal>
        </>
    )
}