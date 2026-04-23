import { useMemo } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useItemStore as useItemsDataStore } from "@/application/stores/itemStore";
import type { Item } from "@/domain/entities/Item";

export const useMasteryCalculator = () => {
  const { profile } = useUserStore();
  const { allItems } = useItemsDataStore();

  const titles = [
    "Iniciado",
    "Novato",
    "Discípulo",
    "Buscador",
    "Caçador",
    "Águia",
    "Tigre",
    "Dragão",
    "Sábio",
    "Mestre",
  ];

  const imageNames = [
    "Initiate",
    "Novice",
    "Disciple",
    "Seeker",
    "Hunter",
    "Eagle",
    "Tiger",
    "Dragon",
    "Sage",
    "Master",
  ];

  const getTitleForRank = (r: number) => {
    if (r === 0) return "Não Ranqueado";
    if (r >= 31) return `Lendário ${r - 30}`;
    
    const titleIndex = Math.floor((r - 1) / 3);
    const baseTitle = titles[titleIndex];
    const mod = r % 3;
    const suffix = mod === 1 ? "" : mod === 2 ? " Prateado" : " Dourado";
    return baseTitle + suffix;
  };

  const getImageForRank = (r: number) => {
    if (r === 0) return "Rank0.webp"; // Fallback if rank 0 exists or use Rank34/Initiate
    if (r >= 31) return `Rank${r}.webp`;

    const titleIndex = Math.floor((r - 1) / 3);
    const baseName = imageNames[titleIndex];
    const mod = r % 3;

    if (mod === 1) {
      // Logic for Bronze/Basic rank
      const specialPrefixes = ["Disciple", "Seeker", "Dragon"];
      return (specialPrefixes.includes(baseName) ? `MR${baseName}` : baseName) + ".webp";
    } else if (mod === 2) {
      return `Silver${baseName}.webp`;
    } else {
      return `Gold${baseName}.webp`;
    }
  };

  const masteryData = useMemo(() => {
    if (!profile || !allItems.length) {
      return {
        totalXP: 0,
        rank: 0,
        title: "Não Ranqueado",
        progressPct: 0,
        nextRankXP: 2500,
        nextTitle: "Iniciado",
        rankImageFile: "Initiate.webp",
      };
    }

    // 1. Calculate Total XP
    let totalXP = 0;
    profile.mastered.forEach((uniqueName: string) => {
      const item = allItems.find((i: Item) => i.uniqueName === uniqueName);
      if (item) {
        if (item.totalExperience) {
          totalXP += item.totalExperience;
        } else {
          const highXPList = [
            "Warframes",
            "Archwing",
            "Necramech",
            "K-Drive",
            "Pets",
            "Sentinels",
            "MOA",
            "Hound",
          ];
          totalXP += highXPList.includes(item.category) ? 6000 : 3000;
        }
      }
    });

    // 2. Calculate Rank (max 33)
    let rank = Math.floor(Math.sqrt(totalXP / 2500));
    rank = Math.min(rank, 33);

    // 3. XP for current and next rank
    const currentRankXP = 2500 * Math.pow(rank, 2);
    const nextRankXPTotal = 2500 * Math.pow(rank + 1, 2);
    const xpRemaining = nextRankXPTotal - totalXP;

    // 4. Progress Percentage
    const progressPct =
      rank >= 33
        ? 100
        : ((totalXP - currentRankXP) / (nextRankXPTotal - currentRankXP)) * 100;

    // 5. Titles and Images
    const title = getTitleForRank(rank);
    const nextTitle = getTitleForRank(rank + 1);
    const rankImageFile = getImageForRank(rank);

    return {
      totalXP,
      rank,
      title,
      nextTitle,
      progressPct,
      nextRankXP: xpRemaining,
      rankImageFile,
    };
  }, [profile, allItems]);

  return masteryData;
};
