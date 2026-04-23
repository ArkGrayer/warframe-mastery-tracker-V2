import React, { useMemo } from "react";
import { useItemStore } from "@/application/stores/itemStore";
import { useFilterStore } from "@/application/stores/filterStore";
import { useUserStore } from "@/application/stores/userStore";
import { CATEGORY_MAP } from "@/domain/valueObjects/CategoryMap";
import ItemCard from "./ItemCard";
import { LucideSearchX, LucideDatabase } from "lucide-react";

const ItemGrid: React.FC = () => {
  const { allItems, isLoading } = useItemStore();
  const { currentCategory, currentSubFilter, searchTerm, hideMastered } = useFilterStore();
  const { profile } = useUserStore();

  const filteredItems = useMemo(() => {
    let result = allItems;

    // 1. Filter by Search Term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(term));
    } else {
      // 2. Filter by Category (only if search is empty)
      result = result.filter((item) => CATEGORY_MAP[item.category] === currentCategory);

      // 3. Filter by SubFilter
      if (currentSubFilter !== "all") {
        if (currentCategory === "Pets" || currentCategory === "Amps") {
          result = result.filter((item) => item.subType === currentSubFilter);
        } else {
          result = result.filter((item) => item.category === currentSubFilter);
        }
      }
    }

    // 4. Hide Mastered
    if (hideMastered && profile) {
      result = result.filter((item) => !profile.mastered.includes(item.uniqueName));
    }

    return result;
  }, [allItems, currentCategory, currentSubFilter, searchTerm, hideMastered, profile]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-zinc-800/50 border-2 border-zinc-700/50 rounded-2xl p-4 aspect-[3/4] animate-pulse flex flex-col gap-4">
            <div className="aspect-square w-full bg-zinc-700/30 rounded-xl" />
            <div className="h-4 w-3/4 bg-zinc-700/30 rounded" />
            <div className="mt-auto h-8 w-full bg-zinc-700/30 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
          {searchTerm ? (
            <LucideSearchX className="w-12 h-12 text-zinc-600" />
          ) : (
            <LucideDatabase className="w-12 h-12 text-zinc-600" />
          )}
        </div>
        <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tighter">
          Nenhum item encontrado
        </h3>
        <p className="text-zinc-500 font-medium max-w-xs mx-auto mt-2">
          {searchTerm 
            ? `Não encontramos resultados para "${searchTerm}". Tente termos mais genéricos.`
            : "Parece que não há itens nesta categoria com os filtros atuais."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6 animate-in fade-in duration-500">
      {filteredItems.map((item) => (
        <ItemCard key={item.uniqueName} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
