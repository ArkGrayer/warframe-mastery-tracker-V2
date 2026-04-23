import { create } from "zustand";

interface FilterState {
  currentCategory: string;
  currentSubFilter: string;
  searchTerm: string;
  hideMastered: boolean;
  setCategory: (category: string) => void;
  setSubFilter: (subFilter: string) => void;
  setSearchTerm: (term: string) => void;
  setHideMastered: (hide: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  currentCategory: "Warframes",
  currentSubFilter: "all",
  searchTerm: "",
  hideMastered: false,
  setCategory: (category) =>
    set({
      currentCategory: category,
      currentSubFilter: "all",
      searchTerm: "",
    }),
  setSubFilter: (subFilter) => set({ currentSubFilter: subFilter }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setHideMastered: (hide) => set({ hideMastered: hide }),
}));
