import { create } from 'zustand'
import {persist} from "zustand/middleware";

interface AppState {
    token: string | null,
    user_id: number | null,
    role: number,
    setToken: (token: string) => void,
    setUserId: (user_id: number) => void,
    setRole: (role: number) => void,
    logOut: () => void,
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            token: null,
            user_id: null,
            role: 1,
            setToken: (token) => set({ token: token }),
            setUserId: (user_id) => set({ user_id: user_id }),
            setRole: (role) => set({ role: role }),
            logOut: () => set({ token: null, user_id: null }),
        }),
        {
            name: "articles-storage",
        }
    )
);