import React from "react";
import { useFilterStore } from "@/application/stores/filterStore";
import { SUB_CATEGORIES } from "@/domain/valueObjects/CategoryMap";

const TABS = [
  { id: "Warframes", label: "Warframes" },
  { id: "Primary", label: "Primárias" },
  { id: "Secondary", label: "Secundárias" },
  { id: "Melee", label: "Melee" },
  { id: "Archwing", label: "Archwing & Veículos" },
  { id: "Sentinels", label: "Robôs" },
  { id: "Pets", label: "Animais" },
  { id: "Amps", label: "Amps" },
];

const TabBar: React.FC = () => {
  const { currentCategory, setCategory, currentSubFilter, setSubFilter } = useFilterStore();

  const subCategories = SUB_CATEGORIES[currentCategory] || [];

  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-800 sticky top-24 z-30 font-nunito">
      <div className="max-w-7xl mx-auto">
        {/* Main Tabs */}
        <div className="flex items-center gap-1 px-4 overflow-x-auto scrollbar-hide py-2">
          {TABS.map((tab) => {
            const isActive = currentCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-5 py-3 rounded-xl font-black text-sm uppercase tracking-tighter transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs (Conditional) */}
        {subCategories.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-3 bg-zinc-950/50 border-t border-zinc-800/50 animate-in slide-in-from-top-1 duration-300">
            <button
              onClick={() => setSubFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                currentSubFilter === "all"
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Todos
            </button>
            {subCategories.map((sub) => {
              const isSubActive = currentSubFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubFilter(sub.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                    isSubActive
                      ? "bg-zinc-100 text-zinc-950"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabBar;
