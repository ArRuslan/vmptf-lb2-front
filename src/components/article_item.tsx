import {Article} from "../entities.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface ArticleItemProps {
    article: Article,
    fetchCommentsCount: boolean,
}

const pad2 = (num: number) => num.toString().padStart(2, "0");

export default function ArticleItem({article, fetchCommentsCount}: ArticleItemProps) {
    const navigate = useNavigate();
    const articleDate = new Date(article.created_at * 1000);
    const articleFormattedDate = `${pad2(articleDate.getDate())}.${pad2(articleDate.getMonth() + 1)}.${articleDate.getFullYear()} at ${pad2(articleDate.getHours())}:${pad2(articleDate.getMinutes())}`
    const [commentsCount, setCommentsCount] = useState(0);

    const fetchComments = () => {
        if(!fetchCommentsCount) return;

        fetch(`http://127.0.0.1:3000/comments/${article.id}?page_size=1&page=1`).then(
            response => response.json()
        ).then(json => {
            setCommentsCount(json.count);
        })
    }

    useEffect(fetchComments, []);

    return (
        <div className="article-item">
            <a href="#" onClick={() => navigate(`/articles/${article.id}`)} className="article-title">{article.title}</a>
            <span className="article-date">
                <span>{articleFormattedDate} by </span>
                <a href="#" onClick={() => navigate(`/articles?publisher_id=${article.publisher.id}`)}
                   className="article-author">{article.publisher.name}</a>
                <span> in </span>
                <a href="#" onClick={() => navigate(`/articles?category_id=${article.category.id}`)} className="article-author">{article.category.name}</a>
                {fetchCommentsCount && !!commentsCount && <span>, {commentsCount} comments</span>}
            </span>
            <div className="article-description">
                {article.text}
            </div>
        </div>
    )
}