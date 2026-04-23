import React, { useEffect, useRef } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useFilterStore } from "@/application/stores/filterStore";
import { IMAGE_BASE_URL } from "@/infrastructure/api/warframeApiService";
import { LucideSearch, LucideEyeOff } from "lucide-react";
import MasteryDashboard from "../mastery/MasteryDashboard";
import gsap from "gsap";

const Header: React.FC = () => {
  const { profile } = useUserStore();
  const { searchTerm, setSearchTerm, hideMastered, setHideMastered } = useFilterStore();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
      );
    }
  }, []);

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 font-nunito"
    >
      <div className="max-w-7xl mx-auto px-4 h-24 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-8">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10">
              <img 
                src={profile?.glyph ? `${IMAGE_BASE_URL}${profile.glyph}` : "https://via.placeholder.com/60"} 
                alt="Profile Glyph" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-100 uppercase tracking-tighter leading-none">
                {profile?.nickname || "Carregando..."}
              </h2>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Tenno Operative
              </span>
            </div>
          </div>

          {/* Mastery Dashboard */}
          <div className="flex-1 max-w-md hidden md:block">
            <MasteryDashboard />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar itens..."
                className="bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all w-48 lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setHideMastered(!hideMastered)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                hideMastered 
                ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/5" 
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              <LucideEyeOff className="w-4 h-4" />
              <span className="hidden sm:inline">Ocultar Masterizados</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
