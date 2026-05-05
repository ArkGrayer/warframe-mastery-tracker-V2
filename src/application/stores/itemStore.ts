import { create } from "zustand";
import type { Item } from "@/domain/entities/Item";

interface ItemDetails {
  imageName?: string;
  totalExperience?: number;
}

interface ItemState {
  allItems: Item[];
  allGlyphs: Item[];
  isLoading: boolean;
  error: string | null;
  itemDetails: Record<string, ItemDetails>;
  pendingRequests: Set<string>;
  setItems: (items: Item[], glyphs: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setItemDetails: (name: string, details: ItemDetails) => void;
  addPendingRequest: (name: string) => void;
  removePendingRequest: (name: string) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  allItems: [],
  allGlyphs: [],
  isLoading: false,
  error: null,
  itemDetails: {},
  pendingRequests: new Set(),
  setItems: (items, glyphs) => set({ allItems: items, allGlyphs: glyphs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setItemDetails: (name, details) => set((state) => ({ 
    itemDetails: { ...state.itemDetails, [name]: details } 
  })),
  addPendingRequest: (name) => set((state) => {
    const newSet = new Set(state.pendingRequests);
    newSet.add(name);
    return { pendingRequests: newSet };
  }),
  removePendingRequest: (name) => set((state) => {
    const newSet = new Set(state.pendingRequests);
    newSet.delete(name);
    return { pendingRequests: newSet };
  }),
}));
