import React, {useState} from "react";
import {useAppStore} from "../state.ts";
import TextInput from 'react-autocomplete-input';
import {Category} from "../entities.ts";

interface CreateArticleModalProps {
    close: () => void,
}

function SomeComponent(props: {value: string}) {
    const value = props.value;
    const newProps = {
        ...props,
    }
    newProps.value = (value as unknown as Category).name;
    return <input type="text" {...newProps}/>
}

export default function CreateArticleModal({close}: CreateArticleModalProps) {
    const [error, setError] = useState(null as (string | null));
    const token = useAppStore(store => store.token);
    const [categories, setCategories] = useState({} as {[key: string]: Category});
    const [selectedCategory, setSelectedCategory] = useState(null as (Category | null));

    const create = (event: React.SyntheticEvent<HTMLFormElement>) => {
        setError(null);

        event.preventDefault();
        const form = event.currentTarget;
        const title = form.title_.value;
        const text = form.text.value;

        if(!selectedCategory) {
            setError("Category is not selected!");
            return;
        }

        fetch("http://127.0.0.1:3000/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({"title": title, "category_id": selectedCategory.id, "text": text})
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

    const requestCategories = (part: string) => {
        fetch(`http://127.0.0.1:3000/categories/search?name=${part}`).then(
            response => response.json()
        ).then(json => {
            setCategories((json.result as Category[]).reduce(
                (res, category) => {
                    res[category.name] = category;
                    return res;
                },
                ({} as {[key: string]: Category})
            ));
        })
    }

    const selectCategory = (value: string) => {
        setSelectedCategory(categories[value]);
    }

    return (
        <div className="app-modal">
            <h2>Create article</h2>
            {error && <label className="error-text">{error}</label>}
            <form onSubmit={create}>
                <input className="app-input inp-white" placeholder="Title" type="text" name="title_"/>
                <input className="app-input inp-white" placeholder="Category id" type="number" name="category_id" value={selectedCategory !== null ? selectedCategory.id : ""} disabled={true}/>
                <TextInput Component={SomeComponent} trigger="" spacer="" options={Object.keys(categories)} onRequestOptions={requestCategories} onSelect={selectCategory}/>
                <textarea className="app-input inp-white" placeholder="Text" name="text" rows={10} cols={60}/>
                <span></span>
                <button className="app-button" type="submit">Create</button>
            </form>
            <span></span>
            <button className="app-button btn-red" onClick={() => close()}>Close</button>
        </div>
    )
}