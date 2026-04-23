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
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
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

  const xpValue =
    item.totalExperience ||
    ([
      "Warframes",
      "Necramech",
      "K-Drive",
      "Pets",
      "Sentinels",
      "MOA",
      "Hound",
    ].includes(item.category)
      ? 6000
      : 3000);

  return (
    <div
      ref={cardRef}
      className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden ${
        isMastered
          ? "border-[#4cc9ff]/50 bg-[#4cc9ff]/[0.02] opacity-70"
          : isAcquired
            ? "border-[#c8a96e]/50 bg-[#c8a96e]/[0.02]"
            : "border-[#1e1a2e] bg-[#100e1a] hover:border-[#2e2845]"
      }`}
    >
      {/* 1. Item Image */}
      <div className="aspect-square w-full bg-[#08060e] rounded-xl overflow-hidden border border-[#1e1a2e] relative flex-shrink-0 group-hover:scale-[1.02] transition-transform">
        <img
          src={`${IMAGE_BASE_URL}${item.imageName}`}
          alt={item.name}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/200/100e1a/c8a96e?text=${item.name[0]}`;
          }}
        />
        {isMastered && (
          <div className="absolute top-2 right-2 bg-[#4cc9ff] text-[#08060e] p-1 rounded-full shadow-lg">
            <LucideStar size={14} fill="currentColor" />
          </div>
        )}
      </div>

      {/* 2. Name */}
      <h4 className="text-[#f0e6d3] font-black text-sm uppercase tracking-tight line-clamp-2 min-h-[2.5rem]">
        {item.name}
      </h4>

      {/* 3. Badge de XP - Only visible when MASTERED */}
      <div
        className={`h-5 transition-opacity duration-300 ${isMastered ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-[10px] font-black text-[#4cc9ff] uppercase tracking-widest bg-[#4cc9ff]/10 px-2 py-0.5 rounded-full border border-[#4cc9ff]/20">
          +{xpValue.toLocaleString("pt-BR")} XP
        </span>
      </div>

      {/* 4. Botões */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={handleAcquiredToggle}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[10px] font-black uppercase tracking-tighter transition-all active:scale-95 ${
            isAcquired
              ? "bg-[#c8a96e] border-[#c8a96e] text-[#08060e]"
              : "bg-[#08060e] border-[#1e1a2e] text-[#8a7a9b] hover:border-[#c8a96e]/40 hover:text-[#c8a96e]"
          }`}
        >
          <LucideBox size={14} />
          <span className="hidden xs:inline">
            {isAcquired ? "Adquirido" : "Adquirir"}
          </span>
        </button>
        <button
          onClick={handleMasteredToggle}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[10px] font-black uppercase tracking-tighter transition-all active:scale-95 ${
            isMastered
              ? "bg-[#4cc9ff] border-[#4cc9ff] text-[#08060e]"
              : "bg-[#08060e] border-[#1e1a2e] text-[#8a7a9b] hover:border-[#4cc9ff]/40 hover:text-[#4cc9ff]"
          }`}
        >
          <LucideCheckCircle2 size={14} />
          <span className="hidden xs:inline">
            {isMastered ? "Mestre" : "Masterizar"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
