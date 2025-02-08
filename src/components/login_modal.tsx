import React, {useState} from "react";
import {useAppStore} from "../state.ts";

interface LoginModalProps {
    close: () => void,
    switchToRegister: () => void,
}

export default function LoginModal({close, switchToRegister}: LoginModalProps) {
    const [error, setError] = useState(null as (string | null));
    const setToken = useAppStore((state) => state.setToken);
    const setUserId = useAppStore((state) => state.setUserId);
    const setRole = useAppStore((state) => state.setRole);

    const login = (event: React.SyntheticEvent<HTMLFormElement>) => {
        setError(null);

        event.preventDefault();
        const form = event.currentTarget;
        const email = form.email.value;
        const password = form.password.value;

        fetch("http://127.0.0.1:3000/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"email": email, "password": password})
        }).then(
            response => response.json()
        ).then(result => {
            if(result.errors) {
                setError((result.errors as string[]).join("\n"));
                return;
            }

            if(result.token) {
                setToken(result.token as string);
                setUserId(result.user.id as number);
                setRole(result.user.role as number);
                close();
            }

            setError("Unknown server response!");
        })
    }

    return (
        <div className="app-modal">
            <h2>Login</h2>
            {error && <label className="error-text">{error}</label>}
            <form onSubmit={login}>
                <input className="app-input inp-white" placeholder="Email" type="email" name="email"/>
                <input className="app-input inp-white" placeholder="Password" type="password" name="password"/>
                <span></span>
                <button className="app-button" type="submit">Login</button>
            </form>
            <span></span>
            <span></span>
            <button className="app-button btn-gray" onClick={() => switchToRegister()}>Register instead</button>
            <button className="app-button btn-red" onClick={() => close()}>Close</button>
        </div>
    )
}