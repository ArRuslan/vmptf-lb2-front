import React, {useState} from "react";
import {useAppStore} from "../state.ts";

interface CreateCategoryModalProps {
    close: () => void,
}

export default function CreateCategoryModal({close}: CreateCategoryModalProps) {
    const [error, setError] = useState(null as (string | null));
    const token = useAppStore(store => store.token);

    const create = (event: React.SyntheticEvent<HTMLFormElement>) => {
        setError(null);

        event.preventDefault();
        const form = event.currentTarget;
        const name = form.cat_name.value;

        fetch("http://127.0.0.1:3000/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({"name": name})
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

            location.href = "/categories";
        })
    }

    return (
        <div className="app-modal">
            <h2>Create category</h2>
            {error && <label className="error-text">{error}</label>}
            <form onSubmit={create}>
                <input className="app-input inp-white" placeholder="Name" type="text" name="cat_name"/>
                <span></span>
                <button className="app-button" type="submit">Create</button>
            </form>
            <span></span>
            <button className="app-button btn-red" onClick={() => close()}>Close</button>
        </div>
    )
}