import "./main.css";
import {useState} from "react";
import {Category} from "./entities.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import TopBar from "./components/top_bar.tsx";
import {useAppStore} from "./state.ts";
import Modal from "react-modal";
import CategoryItem from "./components/category_item.tsx";
import CreateCategoryModal from "./components/create_category_modal.tsx";

interface CategoriesPaginationResult {
    count: number,
    result: Category[],
}

export default function CategoriesPage() {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState([] as Category[]);
    const user_id = useAppStore(state => state.user_id);
    const role = useAppStore(state => state.role);
    const [createOpen, setCreateOpen] = useState(false);

    const fetchData = () => {
        if (!hasMore) return;
        fetch(`http://127.0.0.1:3000/categories?page_size=10&page=${page}`).then(
            response => response.json()
        ).then(json_ => {
            const result = json_ as CategoriesPaginationResult;
            setHasMore((categories.length + result.result.length) < result.count)
            setCategories([...categories, ...result.result]);
            setPage(page + 1);
        })
    }

    fetchData();

    return (
        <>
            <TopBar/>
            <div className="article-buttons">
                {user_id !== null && role >= 255 && <button className="app-button" onClick={() => setCreateOpen(true)}>New category</button>}
            </div>
            <div className="container article-list">
            <InfiniteScroll
                    dataLength={categories.length}
                    next={fetchData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {categories.map(category => (
                        <CategoryItem category={category}></CategoryItem>
                    ))}
                </InfiniteScroll>

            </div>

            <Modal
                isOpen={createOpen}
                onRequestClose={() => setCreateOpen(false)}
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
                <CreateCategoryModal close={() => setCreateOpen(false)}/>
            </Modal>
        </>
    )
}