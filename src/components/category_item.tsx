import {Category} from "../entities.ts";
import {useNavigate} from "react-router-dom";

interface CategoryItemProps {
    category: Category,
}

export default function CategoryItem({category}: CategoryItemProps) {
    const navigate = useNavigate();

    return (
        <div className="article-item">
            <a href="#" onClick={() => navigate(`/articles?category_id=${category.id}`)} className="article-title">{category.name}</a>
            <p className="article-date">
                Id: {category.id}
            </p>
        </div>
    )
}