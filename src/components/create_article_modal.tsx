import React, {useState} from "react";
import {useAppStore} from "../state.ts";

interface CreateArticleModalProps {
    close: () => void,
}

export default function CreateArticleModal({close}: CreateArticleModalProps) {
    const [error, setError] = useState(null as (string | null));
    const token = useAppStore(store => store.token);

    const create = (event: React.SyntheticEvent<HTMLFormElement>) => {
        setError(null);

        event.preventDefault();
        const form = event.currentTarget;
        const title = form.title_.value;
        const category_id = form.category_id.value;
        const text = form.text.value;

        fetch("http://127.0.0.1:3000/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({"title": title, "category_id": category_id, "text": text})
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

            location.href = "/articles";
        })
    }

    return (
        <div className="app-modal">
            <h2>Create article</h2>
            {error && <label className="error-text">{error}</label>}
            <form onSubmit={create}>
                <input className="app-input inp-white" placeholder="Title" type="text" name="title_"/>
                <input className="app-input inp-white" placeholder="Category id (TODO: autocomplete categories)" type="number" name="category_id"/>
                <textarea className="app-input inp-white" placeholder="Text" name="text" rows={10} cols={60}/>
                <span></span>
                <button className="app-button" type="submit">Create</button>
            </form>
            <span></span>
            <button className="app-button btn-red" onClick={() => close()}>Close</button>
        </div>
    )
}