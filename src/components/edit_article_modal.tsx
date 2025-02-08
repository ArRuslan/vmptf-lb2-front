import React, {useState} from "react";
import {useAppStore} from "../state.ts";
import {Article} from "../entities.ts";

interface EditArticleModalProps {
    article: Article,
    close: (edited: boolean) => void,
}

export default function EditArticleModal({article, close}: EditArticleModalProps) {
    const [error, setError] = useState(null as (string | null));
    const token = useAppStore(store => store.token);

    const create = (event: React.SyntheticEvent<HTMLFormElement>) => {
        setError(null);

        event.preventDefault();
        const form = event.currentTarget;
        const title = form.title_.value;
        const text = form.text.value;

        fetch(`http://127.0.0.1:3000/articles/${article.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({"title": title, "text": text})
        }).then(
            response => response.json()
        ).then(result => {
            if(result.errors) {
                setError((result.errors as string[]).join("\n"));
                return;
            }

            if(!result.id) {
                setError("Unknown server response!");
                return;
            }

            close(true);
        })
    }

    return (
        <div className="app-modal">
            <h2>Edit article</h2>
            {error && <label className="error-text">{error}</label>}
            <form onSubmit={create}>
                <input className="app-input inp-white" placeholder="Title" type="text" name="title_" value={article.title}/>
                <textarea className="app-input inp-white" placeholder="Text" name="text" rows={10} cols={60}>{article.text}</textarea>
                <span></span>
                <button className="app-button" type="submit">Edit</button>
            </form>
            <span></span>
            <button className="app-button btn-red" onClick={() => close(false)}>Close</button>
        </div>
    )
}