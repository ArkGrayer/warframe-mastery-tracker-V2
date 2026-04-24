import React, { useRef, useState } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { LucideHistory, LucideInfo, LucideLoader2 } from "lucide-react";

const Footer: React.FC = () => {
  const { profile, setProfile } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleLegacyImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const legacyData = JSON.parse(e.target?.result as string);

        let glyphName = legacyData.glyph || "";
        if (glyphName.startsWith("http")) {
          glyphName = glyphName.split("/").pop() || "";
        }

        const updatedProfile = {
          ...profile,
          nickname: legacyData.nickname || profile.nickname,
          glyph: glyphName || profile.glyph,
          acquired: Array.from(
            new Set([...profile.acquired, ...(legacyData.acquired || [])]),
          ),
          mastered: Array.from(
            new Set([...profile.mastered, ...(legacyData.mastered || [])]),
          ),
        };

        const firestoreService = new FirestoreService();
        await firestoreService.saveUserProfile(updatedProfile);
        setProfile(updatedProfile);

        alert("Sincronização de Dados Legados Concluída!");
      } catch (err) {
        console.error("Erro ao importar JSON legado:", err);
        alert("Falha ao ler o arquivo JSON.");
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <footer className="w-full bg-[#08060e] border-t border-[#1e1a2e] py-16 px-6 font-nunito mt-20 relative overflow-hidden">
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-60 bg-[#4cc9ff]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-center gap-2 text-[#8a7a9b]/40">
            <LucideInfo size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Aviso Legal
            </span>
          </div>
          <p className="text-[11px] text-[#8a7a9b] leading-relaxed opacity-60">
            Digital Extremes Ltd, Warframe and the logo Warframe are registered
            trademarks. All rights are reserved worldwide. This site has no
            official link with Digital Extremes Ltd or Warframe. All artwork,
            screenshots, characters or other recognizable features of the
            intellectual property relating to these trademarks are likewise the
            intellectual property of Digital Extremes Ltd.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-xs font-bold text-[#8a7a9b] uppercase tracking-widest flex items-center gap-2">
            <span>Desenvolvido no Void por</span>
            <div className="relative group cursor-pointer inline-block ml-1">
              <a
                href="http://igorfeitosa.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f0e6d3] font-black transition-colors group-hover:text-[#4cc9ff]"
              >
                Igor Feitosa
              </a>
              <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#4cc9ff] shadow-[0_0_12px_#4cc9ff] transition-all duration-500 ease-out group-hover:w-full" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e1a2e] w-full flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLegacyImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#100e1a] border border-[#1e1a2e] text-[#8a7a9b]/40 hover:text-[#c8a96e] hover:border-[#c8a96e]/30 transition-all text-[9px] font-black uppercase tracking-widest group disabled:cursor-not-allowed"
            >
              {loading ? (
                <LucideLoader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LucideHistory className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
              )}
              <span>
                {loading
                  ? "Sincronizando..."
                  : "Sincronizar Arquivos do Santuário Legado"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
