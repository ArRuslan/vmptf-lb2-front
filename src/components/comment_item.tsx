import {Comment} from "../entities.ts";
import {useNavigate} from "react-router-dom";

interface CommentItemProps {
    comment: Comment,
}

const pad2 = (num: number) => num.toString().padStart(2, "0");

export default function CommentItem({comment}: CommentItemProps) {
    const navigate = useNavigate();
    const articleDate = new Date(comment.created_at * 1000);
    const articleFormattedDate = `${pad2(articleDate.getDate())}.${pad2(articleDate.getMonth() + 1)}.${articleDate.getFullYear()} at ${pad2(articleDate.getHours())}:${pad2(articleDate.getMinutes())}`

    return (
        <div className="article-item">
            <span className="article-date">
                <span>{articleFormattedDate} by </span>
                <a href="#" onClick={() => navigate(`/articles?publisher_id=${comment.user.id}`)} className="article-author">{comment.user.name}</a>
            </span>
            <div className="article-description">
                {comment.text}
            </div>
        </div>
    )
}