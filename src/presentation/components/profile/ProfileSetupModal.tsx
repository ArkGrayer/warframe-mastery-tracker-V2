import React, { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useItemStore } from "@/application/stores/itemStore";
import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { IMAGE_BASE_URL } from "@/infrastructure/api/warframeApiService";
import { LucideSearch, LucideUser, LucideCheck } from "lucide-react";
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
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-nunito">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-zinc-100 uppercase tracking-tighter">
              Configure seu Perfil
            </h2>
            <p className="text-zinc-400 font-medium">
              Escolha como os outros Tennos te verão no sistema.
            </p>
          </div>

          <div className="space-y-6">
            {/* Nickname Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Seu Nickname</label>
              <div className="relative group">
                <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 font-bold placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Ex: TennoPrime"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            {/* Glyph Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Escolha um Glifo</label>
                <div className="relative">
                  <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    className="bg-zinc-950 border border-zinc-800 rounded-full py-1.5 pl-9 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all w-48"
                    placeholder="Buscar glifo..."
                    value={glyphSearch}
                    onChange={(e) => setGlyphSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-2 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 scrollbar-thin scrollbar-thumb-zinc-800">
                {filteredGlyphs.map((glyph) => (
                  <button
                    key={glyph.uniqueName}
                    onClick={() => setSelectedGlyph(glyph.imageName || "")}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                      selectedGlyph === glyph.imageName 
                      ? "border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105" 
                      : "border-transparent hover:border-zinc-700"
                    }`}
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${glyph.imageName}`}
                      alt={glyph.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    {selectedGlyph === glyph.imageName && (
                      <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                        <LucideCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !nickname.trim()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black rounded-xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Confirmar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
