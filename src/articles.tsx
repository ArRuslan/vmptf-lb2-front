import "./main.css";
import {useState} from "react";
import ArticleItem from "./components/article_item.tsx";
import {Article} from "./entities.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import TopBar from "./components/top_bar.tsx";

interface ArticlePaginationResult {
    count: number,
    result: Article[],
}

export default function ArticlesPage() {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [articles, setArticles] = useState([] as Article[]);

    const fetchData = () => {
        if(!hasMore) return;
        fetch(`http://127.0.0.1:3000/articles?page_size=10&page=${page}`).then(
            response => response.json()
        ).then(json_ => {
            const result = json_ as ArticlePaginationResult;
            setHasMore((articles.length + result.result.length) < result.count)
            setArticles([...articles, ...result.result]);
            setPage(page + 1);
        })
    }

    fetchData();

    return (
        <>
            <TopBar/>
            <div className="container article-list">
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {articles.map(article => (
                        <ArticleItem article={article}></ArticleItem>
                    ))}
                </InfiniteScroll>

            </div>
        </>
    )
}