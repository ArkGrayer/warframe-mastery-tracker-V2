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
    <div className="w-full bg-[#08060e] border-t border-[#1e1a2e] font-nunito transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Tabs */}
        <div className="flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide py-3 flex-nowrap">
          {TABS.map((tab) => {
            const isActive = currentCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 group relative border-2 ${
                  isActive
                    ? "bg-[#c8a96e] border-[#c8a96e] text-[#08060e] shadow-lg shadow-[#c8a96e]/20"
                    : "border-transparent text-[#8a7a9b] hover:text-[#f0e6d3] hover:bg-[#100e1a] hover:border-[#1e1a2e]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs (Conditional) */}
        {subCategories.length > 0 && (
          <div className="flex items-center gap-3 px-6 py-4 bg-[#100e1a] border-t border-[#1e1a2e] overflow-x-auto scrollbar-hide flex-nowrap animate-in slide-in-from-top-2 duration-500">
            <button
              onClick={() => setSubFilter("all")}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-90 border ${
                currentSubFilter === "all"
                  ? "bg-[#f0e6d3] border-[#f0e6d3] text-[#08060e] shadow-md shadow-[#f0e6d3]/10"
                  : "bg-transparent border-[#1e1a2e] text-[#8a7a9b] hover:text-[#f0e6d3] hover:border-[#f0e6d3]/30"
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
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-90 border ${
                    isSubActive
                      ? "bg-[#f0e6d3] border-[#f0e6d3] text-[#08060e] shadow-md shadow-[#f0e6d3]/10"
                      : "bg-transparent border-[#1e1a2e] text-[#8a7a9b] hover:text-[#f0e6d3] hover:border-[#f0e6d3]/30"
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
