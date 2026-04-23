import React, { useState, useEffect, useRef, useMemo } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useItemStore } from "@/application/stores/itemStore";
import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { IMAGE_BASE_URL } from "@/infrastructure/api/warframeApiService";
import { 
  LucideSearch, 
  LucideCheck, 
  LucideX, 
  LucideSparkles, 
  LucideLoader2 
} from "lucide-react";
import { useDebounce } from "@/presentation/hooks/useDebounce";
import gsap from "gsap";

interface GlyphSelectorModalProps {
  onClose: () => void;
}

const GlyphSelectorModal: React.FC<GlyphSelectorModalProps> = ({ onClose }) => {
  const { profile, setProfile } = useUserStore();
  const { allGlyphs } = useItemStore();
  
  const [glyphSearch, setGlyphSearch] = useState("");
  const debouncedSearch = useDebounce(glyphSearch, 300);
  const [selectedGlyph, setSelectedGlyph] = useState(profile?.glyph || "");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(60);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    ).fromTo(
      modalRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power4.out" },
      "-=0.2"
    );
  }, []);

  const filteredGlyphs = useMemo(() => {
    return allGlyphs.filter((g) =>
      g.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [allGlyphs, debouncedSearch]);

  const glyphsToShow = useMemo(() => {
    return filteredGlyphs.slice(0, visibleCount);
  }, [filteredGlyphs, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredGlyphs.length) {
          setVisibleCount((prev) => prev + 48);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [filteredGlyphs.length, visibleCount]);

  useEffect(() => {
    setVisibleCount(60);
  }, [debouncedSearch]);

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    const firestoreService = new FirestoreService();
    const updatedProfile = {
      ...profile,
      glyph: selectedGlyph,
    };

    try {
      await firestoreService.saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      
      gsap.to(modalRef.current, { 
        scale: 1.05, 
        opacity: 0, 
        duration: 0.3, 
        onComplete: onClose 
      });
    } catch (error) {
      console.error("Error updating glyph:", error);
      setLoading(false);
    }
  };

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#08060e]/90 backdrop-blur-xl font-nunito"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c8a96e]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4cc9ff]/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-[#100e1a] border border-[#c8a96e]/20 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[85vh] relative"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c8a96e] to-transparent opacity-50" />

        <div className="p-8 pb-4 space-y-6 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LucideSparkles className="w-5 h-5 text-[#c8a96e]" />
                <span className="text-[10px] font-black text-[#c8a96e] uppercase tracking-[0.3em]">Códice de Glifos</span>
              </div>
              <h2 className="text-4xl font-black text-[#f0e6d3] uppercase tracking-tighter leading-none">
                Trocar Glifo
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl hover:bg-[#1e1a2e] text-[#8a7a9b] transition-all hover:text-[#f0e6d3] hover:rotate-90 active:scale-90"
            >
              <LucideX size={28} />
            </button>
          </div>

          <div className="relative group">
            <LucideSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a7a9b]/30 group-focus-within:text-[#4cc9ff] transition-colors" />
            <input
              type="text"
              className="w-full bg-[#08060e] border-2 border-[#1e1a2e] rounded-2xl py-4 pl-14 pr-6 text-[#f0e6d3] font-bold placeholder:text-[#8a7a9b]/20 focus:outline-none focus:border-[#4cc9ff]/50 focus:ring-4 focus:ring-[#4cc9ff]/10 transition-all shadow-inner"
              placeholder="Pesquisar no Santuário de Glifos..."
              value={glyphSearch}
              onChange={(e) => setGlyphSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-thin scrollbar-thumb-[#c8a96e]/20 scrollbar-track-transparent">
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-4 pb-8">
            {glyphsToShow.map((glyph) => (
              <button
                key={glyph.uniqueName}
                onClick={() => setSelectedGlyph(glyph.imageName || "")}
                title={glyph.name}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 active:scale-90 ${
                  selectedGlyph === glyph.imageName 
                  ? "border-[#c8a96e] shadow-[0_0_20px_rgba(200,169,110,0.3)] scale-105 z-10" 
                  : "border-[#1e1a2e] hover:border-[#4cc9ff]/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={`${IMAGE_BASE_URL}${glyph.imageName}`}
                  alt={glyph.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {selectedGlyph === glyph.imageName && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#c8a96e]/40 to-transparent flex items-center justify-center">
                    <div className="bg-[#c8a96e] p-1.5 rounded-full shadow-lg">
                      <LucideCheck className="w-4 h-4 text-[#08060e] stroke-[4]" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {visibleCount < filteredGlyphs.length && (
            <div ref={loadMoreRef} className="flex justify-center py-12">
              <LucideLoader2 className="w-8 h-8 text-[#c8a96e]/40 animate-spin" />
            </div>
          )}
        </div>

        <div className="p-8 pt-4 flex items-center justify-between bg-gradient-to-t from-[#08060e] to-transparent flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[#8a7a9b] font-black uppercase tracking-widest text-xs hover:text-[#f0e6d3] transition-colors"
          >
            Desistir
          </button>
          
          <div className="flex items-center gap-4">
            {selectedGlyph !== profile?.glyph && (
              <span className="text-[10px] font-bold text-[#4cc9ff] uppercase animate-pulse">Sincronização Pronta</span>
            )}
            <button
              onClick={handleSave}
              disabled={loading || selectedGlyph === profile?.glyph}
              className="group relative px-10 py-4 bg-[#c8a96e] disabled:bg-[#1e1a2e] disabled:text-[#8a7a9b]/30 text-[#08060e] font-black rounded-2xl shadow-[0_10px_30px_rgba(200,169,110,0.2)] hover:shadow-[0_15px_40px_rgba(200,169,110,0.3)] hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              {loading ? (
                <LucideLoader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="uppercase tracking-tighter text-sm">Sincronizar Glifo</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlyphSelectorModal;
