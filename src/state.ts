import { create } from 'zustand'
import {persist} from "zustand/middleware";

interface AppState {
    token: string | null,
    role: number,
    setToken: (token: string | null) => void,
    setRole: (role: number) => void,
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            token: null,
            role: 1,
            setToken: (token) => set({ token: token }),
            setRole: (role) => set({ role: role }),
        }),
        {
            name: "articles-storage",
        }
    )
);