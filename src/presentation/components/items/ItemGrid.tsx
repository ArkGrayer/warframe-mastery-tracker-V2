import React, { useMemo } from "react";
import { useItemStore } from "@/application/stores/itemStore";
import { useFilterStore } from "@/application/stores/filterStore";
import { useUserStore } from "@/application/stores/userStore";
import { CATEGORY_MAP } from "@/domain/valueObjects/CategoryMap";
import ItemCard from "./ItemCard";
import { LucideSearchX, LucideDatabase } from "lucide-react";
import { VirtuosoGrid } from "react-virtuoso";

const ItemGrid: React.FC = () => {
  const { allItems, isLoading } = useItemStore();
  const { currentCategory, currentSubFilter, searchTerm, hideMastered } = useFilterStore();
  const { profile } = useUserStore();

  const filteredItems = useMemo(() => {
    let result = allItems;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(term));
    } else {
      result = result.filter((item) => CATEGORY_MAP[item.category] === currentCategory);

      if (currentSubFilter !== "all") {
        if (currentCategory === "Pets" || currentCategory === "Amps") {
          result = result.filter((item) => item.subType === currentSubFilter);
        } else {
          result = result.filter((item) => item.category === currentSubFilter);
        }
      }
    }

    if (hideMastered && profile) {
      result = result.filter((item) => !profile.mastered.includes(item.uniqueName));
    }

    return result;
  }, [allItems, currentCategory, currentSubFilter, searchTerm, hideMastered, profile]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-[#100e1a] border-2 border-[#1e1a2e] rounded-2xl p-4 aspect-[3/4] animate-pulse flex flex-col gap-4">
            <div className="aspect-square w-full bg-[#08060e] rounded-xl" />
            <div className="h-4 w-3/4 bg-[#08060e] rounded" />
            <div className="mt-auto h-8 w-full bg-[#08060e] rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-6 rounded-full bg-[#100e1a] border border-[#1e1a2e] mb-6">
          {searchTerm ? (
            <LucideSearchX className="w-12 h-12 text-[#8a7a9b]" />
          ) : (
            <LucideDatabase className="w-12 h-12 text-[#8a7a9b]" />
          )}
        </div>
        <h3 className="text-xl font-black text-[#f0e6d3] uppercase tracking-tighter">
          Nenhum item encontrado
        </h3>
        <p className="text-[#8a7a9b] font-medium max-w-xs mx-auto mt-2">
          {searchTerm 
            ? `Não encontramos resultados para "${searchTerm}". Tente termos mais genéricos.`
            : "Parece que não há itens nesta categoria com os filtros atuais."}
        </p>
      </div>
    );
  }

  return (
    <VirtuosoGrid
      useWindowScroll
      data={filteredItems}
      totalCount={filteredItems.length}
      overscan={200}
      listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6 pt-4"
      itemContent={(_, item) => (
        <ItemCard key={item.uniqueName} item={item} />
      )}
    />
  );
};

export default ItemGrid;
