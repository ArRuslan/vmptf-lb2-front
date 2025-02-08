import React from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {SnackbarProvider} from "notistack";
import Modal from 'react-modal';
import ArticlesPage from "./articles.tsx";

Modal.setAppElement('#root');

function SnackbarWrapper({children}: {children: React.ReactNode}) {
    return (
        <SnackbarProvider maxSnack={10} anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
            {children}
        </SnackbarProvider>
    )
}

function App() {
    const def = <Navigate to="/articles" replace/>;

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={def}/>
                <Route path="/articles" element={<SnackbarWrapper><ArticlesPage/></SnackbarWrapper>}/>

                <Route path="*" element={def}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
