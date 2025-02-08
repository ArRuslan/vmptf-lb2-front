import React, {useState} from "react";
import {useAppStore} from "../state.ts";

interface RegisterModalProps {
    close: () => void,
    switchToLogin: () => void,
}

export default function RegisterModal({close, switchToLogin}: RegisterModalProps) {
    const [error, setError] = useState(null as (string | null));
    const setToken = useAppStore((state) => state.setToken);

    const register = (event: React.SyntheticEvent<HTMLFormElement>) => {
        setError(null);

        event.preventDefault();
        const form = event.currentTarget;
        const name = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const password_repeat = form.password_repeat.value;

        if(password !== password_repeat) {
            setError("Passwords do not match!");
            return;
        }

        fetch("http://127.0.0.1:3000/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"name": name, "email": email, "password": password})
        }).then(
            response => response.json()
        ).then(result => {
            if(result.errors) {
                setError((result.errors as string[]).join("\n"));
                return;
            }

            if(result.token) {
                setToken(result.token as string);
                close();
            }

            setError("Unknown server response!");
        })
    }

    return (
        <div className="app-modal">
            <h2>Register</h2>
            {error && <label className="error-text">{error}</label>}
            <form onSubmit={register}>
                <input className="app-input inp-white" placeholder="Name" type="text" name="username"/>
                <input className="app-input inp-white" placeholder="Email" type="email" name="email"/>
                <input className="app-input inp-white" placeholder="Password" type="password" name="password"/>
                <input className="app-input inp-white" placeholder="Repeat Password" type="password" name="password_repeat"/>
                <span></span>
                <button className="app-button" type="submit">Register</button>
            </form>
            <span></span>
            <span></span>
            <button className="app-button btn-gray" onClick={() => switchToLogin()}>Login instead</button>
            <button className="app-button btn-red" onClick={() => close()}>Close</button>
        </div>
    )
}