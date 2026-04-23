import React, { useEffect, useRef } from "react";
import type { Item } from "@/domain/entities/Item";
import { useUserStore } from "@/application/stores/userStore";
import { persistMasteryUseCase } from "@/application/useCases/persistMasteryUseCase";
import { IMAGE_BASE_URL } from "@/infrastructure/api/warframeApiService";
import { LucideCheckCircle2, LucideBox, LucideStar } from "lucide-react";
import gsap from "gsap";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { profile, toggleAcquired, toggleMastered } = useUserStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const isAcquired = profile?.acquired.includes(item.uniqueName) || false;
  const isMastered = profile?.mastered.includes(item.uniqueName) || false;

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const handleAcquiredToggle = async () => {
    toggleAcquired(item.uniqueName);
    await persistMasteryUseCase();
  };

  const handleMasteredToggle = async () => {
    toggleMastered(item.uniqueName);
    await persistMasteryUseCase();
  };

  const xpValue = item.totalExperience || (
    ["Warframes", "Archwing", "Necramech", "K-Drive", "Pets", "Sentinels", "MOA", "Hound"].includes(item.category) 
    ? 6000 : 3000
  );

  return (
    <div
      ref={cardRef}
      className={`relative bg-zinc-800 border-2 rounded-2xl p-4 transition-all duration-300 group overflow-hidden ${
        isMastered 
          ? "border-green-500/50 bg-green-500/[0.02] opacity-70" 
          : isAcquired 
            ? "border-blue-500/50 bg-blue-500/[0.02]" 
            : "border-zinc-700 hover:border-zinc-600"
      }`}
    >
      {/* Background Icon Watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <LucideBox size={120} />
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {/* Item Image */}
        <div className="aspect-square w-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-700/50 relative group-hover:scale-[1.02] transition-transform">
          <img
            src={`${IMAGE_BASE_URL}${item.imageName}`}
            alt={item.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/200?text=Warframe")}
          />
          {isMastered && (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
              <LucideStar size={14} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="space-y-1">
          <h4 className="text-zinc-100 font-black text-sm uppercase tracking-tight line-clamp-1">
            {item.name}
          </h4>
          <div className={`transition-opacity duration-300 ${isAcquired ? "opacity-100" : "opacity-0"}`}>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              +{xpValue.toLocaleString("pt-BR")} XP
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleAcquiredToggle}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[10px] font-black uppercase tracking-tighter transition-all ${
              isAcquired
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600"
            }`}
          >
            <LucideBox size={14} />
            {isAcquired ? "Adquirido" : "Adquirir"}
          </button>
          <button
            onClick={handleMasteredToggle}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[10px] font-black uppercase tracking-tighter transition-all ${
              isMastered
                ? "bg-green-600 border-green-500 text-white"
                : "bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600"
            }`}
          >
            <LucideCheckCircle2 size={14} />
            {isMastered ? "Mestre" : "Masterizar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
