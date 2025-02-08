import {Article} from "../entities.ts";
import {useNavigate} from "react-router-dom";

interface ArticleItemProps {
    article: Article,
}

export default function ArticleItem({article}: ArticleItemProps) {
    const navigate = useNavigate();

    return (
        <div className="article-item">
            <a href="#" onClick={() => navigate(`/articles/${article.id}`)} className="article-title">{article.title}</a>
            <p className="article-date">
                01.01.1970 at 00:00 by
                <a href="#" onClick={() => navigate(`/articles?publisher_id=${article.publisher.id}`)} className="article-author">{article.publisher.name}</a>
            </p>
            <div className="article-description">
                {article.text}
            </div>
        </div>
    )
}