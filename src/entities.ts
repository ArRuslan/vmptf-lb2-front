export interface User {
    id: number,
    name: string,
}

export interface Category {
    id: number,
    name: string,
}

export interface Article {
    id: number,
    title: string,
    text: string,
    created_at: number,
    publisher: User,
    category: Category,
    comments_count?: number, // TODO: add on backend
}

export interface Comment {
    id: number,
    text: string,
    created_at: number,
    user: User,
}