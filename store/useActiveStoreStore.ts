// stores/useActiveStoreStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveStoreState {
    activeStoreId: string | null;
    setActiveStoreId: (id: string) => void;
    clearActiveStoreId: () => void;
}

export const useActiveStoreStore = create<ActiveStoreState>()(
    persist(
        (set) => ({
            activeStoreId: null,
            setActiveStoreId: (id) => set({ activeStoreId: id }),
            clearActiveStoreId: () => set({ activeStoreId: null }),
        }),
        {
            name: "active-store-storage", // localStorage key
        }
    )
);
