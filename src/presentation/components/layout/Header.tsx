import React, { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useFilterStore } from "@/application/stores/filterStore";
import { IMAGE_BASE_URL } from "@/infrastructure/api/warframeApiService";
import { LucideSearch, LucidePencil } from "lucide-react";
import MasteryDashboard from "../mastery/MasteryDashboard";
import GlyphSelectorModal from "../profile/GlyphSelectorModal";
import TabBar from "./TabBar";
import { useDebounce } from "@/presentation/hooks/useDebounce";
import gsap from "gsap";

const Header: React.FC = () => {
  const { profile } = useUserStore();
  const { searchTerm, setSearchTerm, hideMastered, setHideMastered } = useFilterStore();
  const [showGlyphModal, setShowGlyphModal] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Local state for responsive input typing
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update store only after debounce
  useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  // Sync local search if store search changes externally
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
      );
    }
  }, []);

  return (
    <>
      <header 
        ref={headerRef}
        className="w-full bg-[#08060e] border-b border-[#1e1a2e] font-nunito shadow-2xl relative z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* TOP ROW: Profile + Dashboard */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 flex-shrink-0 group">
              <div 
                onClick={() => setShowGlyphModal(true)}
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#c8a96e] shadow-lg shadow-[#c8a96e]/10 cursor-pointer relative transition-transform duration-300 group-hover:scale-105 active:scale-95"
              >
                <img 
                  src={profile?.glyph ? `${IMAGE_BASE_URL}${profile.glyph}` : "https://via.placeholder.com/80/100e1a/c8a96e?text=T"} 
                  alt="Profile Glyph" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/80/100e1a/c8a96e?text=T")}
                />
                <div className="absolute inset-0 bg-[#08060e]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LucidePencil className="w-6 h-6 text-[#c8a96e] animate-bounce" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-black text-[#f0e6d3] uppercase tracking-tighter leading-none transition-colors group-hover:text-[#c8a96e]">
                  {profile?.nickname || "Tenno"}
                </h2>
                <span className="text-xs font-black text-[#c8a96e]/60 uppercase tracking-widest mt-2">
                  Herdeiro de Orokin
                </span>
              </div>
            </div>

            <div className="flex-1 w-full max-w-3xl transition-all duration-300 hover:brightness-110">
              <MasteryDashboard />
            </div>
          </div>

          {/* BOTTOM ROW: Search + Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-1 group w-full">
              <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8a7a9b]/40 group-focus-within:text-[#4cc9ff] transition-all group-hover:scale-110" />
              <input 
                type="text" 
                placeholder="Pesquisar Warframe, Arma, Veículo..."
                className="bg-[#100e1a] border border-[#1e1a2e] rounded-2xl py-4 pl-14 pr-6 text-base text-[#f0e6d3] placeholder:text-[#8a7a9b]/30 focus:outline-none focus:border-[#4cc9ff] focus:ring-4 focus:ring-[#4cc9ff]/10 transition-all w-full hover:bg-[#151222] shadow-inner font-bold"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            
            <label className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-[#100e1a] border border-[#1e1a2e] cursor-pointer transition-all hover:bg-[#151222] hover:border-[#c8a96e]/40 group active:scale-95 flex-shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="checkbox"
                  className="peer hidden"
                  checked={hideMastered}
                  onChange={() => setHideMastered(!hideMastered)}
                />
                <div className="w-6 h-6 border-2 border-[#1e1a2e] rounded-md bg-[#08060e] peer-checked:bg-[#c8a96e] peer-checked:border-[#c8a96e] transition-all group-hover:border-[#c8a96e]/60 flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#08060e] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-sm font-black text-[#8a7a9b] uppercase tracking-widest group-hover:text-[#f0e6d3] transition-colors whitespace-nowrap">
                Ocultar Masterizados
              </span>
            </label>
          </div>
        </div>

        <TabBar />
      </header>

      {showGlyphModal && (
        <GlyphSelectorModal onClose={() => setShowGlyphModal(false)} />
      )}
    </>
  );
};

export default Header;
