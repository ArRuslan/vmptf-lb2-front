import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Modal from 'react-modal';
import LoginModal from "./login_modal.tsx";
import {useAppStore} from "../state.ts";
import RegisterModal from "./register_modal.tsx";

export default function TopBar() {
    const navigate = useNavigate();
    const [currentModal, setCurrentModal] = useState(null as ("login" | "register" | null));
    const token = useAppStore((state) => state.token);
    const setToken = useAppStore((state) => state.setToken);

    return (
        <>
            <div className="top-bar">
                <div className="top-bar-inner">
                    <a href="#" onClick={() => navigate("/articles")}>Articles</a>
                    <div className="top-bar-search-login">
                        <input className="app-input" placeholder="Search..."/>
                        {token
                            ? <button className="app-button" onClick={() => setToken(null)}>Logout</button>
                            : <button className="app-button" onClick={() => setCurrentModal("login")}>Login</button>}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={currentModal !== null}
                onRequestClose={() => setCurrentModal(null)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
            >
                {currentModal === "login"
                    ? <LoginModal close={() => setCurrentModal(null)} switchToRegister={() => setCurrentModal("register")}/>
                    : (currentModal === "register"
                        ? <RegisterModal close={() => setCurrentModal(null)} switchToLogin={() => setCurrentModal("login")}/>
                        : <></>)}
            </Modal>
        </>
    )
}