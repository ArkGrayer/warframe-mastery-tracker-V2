import { create } from "zustand";
import type { Item } from "@/domain/entities/Item";

interface ItemState {
  allItems: Item[];
  allGlyphs: Item[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: Item[], glyphs: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  allItems: [],
  allGlyphs: [],
  isLoading: false,
  error: null,
  setItems: (items, glyphs) => set({ allItems: items, allGlyphs: glyphs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
