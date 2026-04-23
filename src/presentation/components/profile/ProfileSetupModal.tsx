import React, { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useItemStore } from "@/application/stores/itemStore";
import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { IMAGE_BASE_URL } from "@/infrastructure/api/warframeApiService";
import { LucideSearch, LucideUser, LucideCheck, LucideLoader2 } from "lucide-react";
import gsap from "gsap";

const ProfileSetupModal: React.FC = () => {
  const { profile, setProfile } = useUserStore();
  const { allGlyphs } = useItemStore();
  const [nickname, setNickname] = useState("");
  const [glyphSearch, setGlyphSearch] = useState("");
  const [selectedGlyph, setSelectedGlyph] = useState("");
  const [loading, setLoading] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
  }, []);

  const filteredGlyphs = allGlyphs.filter((g) =>
    g.name.toLowerCase().includes(glyphSearch.toLowerCase())
  ).slice(0, 24);

  const handleSave = async () => {
    if (!nickname.trim() || !profile) return;

    setLoading(true);
    const firestoreService = new FirestoreService();
    const updatedProfile = {
      ...profile,
      nickname,
      glyph: selectedGlyph || allGlyphs[0]?.imageName || "",
    };

    try {
      await firestoreService.saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08060e]/90 backdrop-blur-sm font-nunito">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-[#100e1a] border border-[#1e1a2e] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-[#f0e6d3] uppercase tracking-tighter">
              Iniciação Tenno
            </h2>
            <p className="text-[#8a7a9b] font-medium">
              Defina sua identidade nos registros Orokin.
            </p>
          </div>

          <div className="space-y-6">
            {/* Nickname Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#c8a96e] uppercase ml-1">Nickname</label>
              <div className="relative group">
                <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a7a9b]/20 group-focus-within:text-[#4cc9ff] transition-colors" />
                <input
                  type="text"
                  className="w-full bg-[#08060e] border border-[#1e1a2e] rounded-2xl py-4 pl-12 pr-4 text-[#f0e6d3] font-bold placeholder:text-[#8a7a9b]/10 focus:outline-none focus:ring-2 focus:ring-[#4cc9ff]/20 focus:border-[#4cc9ff] transition-all"
                  placeholder="Ex: Excalibur_Prime"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            {/* Glyph Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#c8a96e] uppercase ml-1">Glifo de Honra</label>
                <div className="relative">
                  <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7a9b]/20" />
                  <input
                    type="text"
                    className="bg-[#08060e] border border-[#1e1a2e] rounded-full py-1.5 pl-9 pr-4 text-xs text-[#f0e6d3] focus:outline-none focus:border-[#4cc9ff] transition-all w-48"
                    placeholder="Filtrar glifos..."
                    value={glyphSearch}
                    onChange={(e) => setGlyphSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-2 bg-[#08060e]/50 rounded-2xl border border-[#1e1a2e] scrollbar-thin scrollbar-thumb-[#c8a96e]/20">
                {filteredGlyphs.map((glyph) => (
                  <button
                    key={glyph.uniqueName}
                    onClick={() => setSelectedGlyph(glyph.imageName || "")}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                      selectedGlyph === glyph.imageName 
                      ? "border-[#c8a96e] shadow-lg shadow-[#c8a96e]/20 scale-105" 
                      : "border-transparent hover:border-[#c8a96e]/30"
                    }`}
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${glyph.imageName}`}
                      alt={glyph.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    {selectedGlyph === glyph.imageName && (
                      <div className="absolute inset-0 bg-[#c8a96e]/20 flex items-center justify-center">
                        <LucideCheck className="w-6 h-6 text-[#08060e]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#08060e]/50 border-t border-[#1e1a2e] flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !nickname.trim()}
            className="px-8 py-3 bg-[#c8a96e] hover:bg-[#b0945a] disabled:bg-[#100e1a] disabled:text-[#8a7a9b]/20 text-[#08060e] font-black rounded-xl shadow-xl shadow-[#c8a96e]/10 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? (
              <LucideLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Confirmar Iniciação"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
