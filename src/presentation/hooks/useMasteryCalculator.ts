import { useMemo } from "react";
import { useUserStore } from "@/application/stores/userStore";
import { useItemStore } from "@/application/stores/itemStore";
import type { Item } from "@/domain/entities/Item";

export const useMasteryCalculator = () => {
  const { profile } = useUserStore();
  const { allItems } = useItemStore();

  const masteryData = useMemo(() => {
    if (!profile || !allItems.length) {
      return {
        totalXP: 0,
        rank: 0,
        title: "Não Ranqueado",
        progressPct: 0,
        nextRankXP: 2500,
        rankImageFile: "Rank0.webp",
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
    const xpNeededForNext = nextRankXPTotal - totalXP;

    // 4. Progress Percentage
    const progressPct =
      rank >= 33
        ? 100
        : ((totalXP - currentRankXP) / (nextRankXPTotal - currentRankXP)) * 100;

    // 5. Title Logic
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

    let title = "";
    let rankImageFile = `Rank${rank}.webp`;

    if (rank === 0) {
      title = "Não Ranqueado";
    } else if (rank >= 31) {
      title = `Lendário ${rank - 30}`;
      rankImageFile = `Rank${rank}.webp`;
    } else {
      const titleIndex = Math.floor((rank - 1) / 3);
      const baseTitle = titles[titleIndex];
      const suffix = rank % 3 === 1 ? " Prateado" : rank % 3 === 0 ? " Dourado" : "";
      title = baseTitle + suffix;

      // Image logic (Initiate, Novice, etc.)
      const imageTitles = [
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
      const baseImageTitle = imageTitles[titleIndex];
      const imageSuffix = rank % 3 === 1 ? "Silver" : rank % 3 === 0 ? "Gold" : "";
      rankImageFile = `${imageSuffix}${baseImageTitle}.webp`;
    }

    return {
      totalXP,
      rank,
      title,
      progressPct,
      nextRankXP: xpNeededForNext,
      rankImageFile,
    };
  }, [profile, allItems]);

  return masteryData;
};
