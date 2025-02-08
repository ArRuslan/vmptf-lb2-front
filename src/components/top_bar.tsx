import {useNavigate} from "react-router-dom";

export default function TopBar() {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            <div className="top-bar-inner">
                <a href="#" onClick={() => navigate("/articles")}>Articles</a>
                <div className="top-bar-search-login">
                    <input placeholder="Search..."/>
                    <button>Logout</button>
                </div>
            </div>
        </div>
    )
}