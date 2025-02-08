import React from 'react'
import {BrowserRouter, Navigate, Route, Routes, useParams} from "react-router-dom";
import {SnackbarProvider} from "notistack";
import Modal from 'react-modal';
import ArticlesPage from "./articles.tsx";
import CategoriesPage from "./categories.tsx";
import ArticlePage from "./article.tsx";

Modal.setAppElement('#root');

function SnackbarWrapper({children}: {children: React.ReactNode}) {
    return (
        <SnackbarProvider maxSnack={10} anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
            {children}
        </SnackbarProvider>
    )
}

function WrapperArticlePage() {
    const {article_id} = useParams();
    return <ArticlePage article_id={Number(article_id)}/>
}

function App() {
    const def = <Navigate to="/articles" replace/>;

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={def}/>
                <Route path="/articles" element={<SnackbarWrapper><ArticlesPage/></SnackbarWrapper>}/>
                <Route path="/articles/:article_id" element={<SnackbarWrapper><WrapperArticlePage/></SnackbarWrapper>}/>
                <Route path="/categories" element={<SnackbarWrapper><CategoriesPage/></SnackbarWrapper>}/>

                <Route path="*" element={def}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
