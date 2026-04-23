import React, { useEffect, useRef } from "react";
import { useMasteryCalculator } from "../../hooks/useMasteryCalculator";
import gsap from "gsap";

const MasteryDashboard: React.FC = () => {
  const { totalXP, rank, title, progressPct, nextRankXP, rankImageFile } = useMasteryCalculator();
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progressPct}%`,
        duration: 1.5,
        ease: "power3.out",
      });
    }
  }, [progressPct]);

  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-6 font-nunito">
      {/* Rank Badge */}
      <div className="relative group">
        <div className="w-16 h-16 flex items-center justify-center relative z-10">
          <img
            src={`/img/ranks/${rankImageFile}`}
            alt={title}
            className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform"
            onError={(e) => (e.currentTarget.src = "/img/ranks/Rank0.webp")}
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-zinc-950 z-20">
          {rank}
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Progress Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-zinc-100 font-black text-lg uppercase tracking-tighter leading-none">
              {title}
            </h3>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Nível de Maestria
            </span>
          </div>
          <div className="text-right">
            <span className="text-zinc-100 font-black text-sm">
              {totalXP.toLocaleString("pt-BR")} XP
            </span>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Total Acumulado
            </p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50 p-[1px]">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
            <span className="text-zinc-500">Progresso do Rank</span>
            <span className="text-zinc-400">
              Faltam <span className="text-white">{nextRankXP.toLocaleString("pt-BR")} XP</span> para o Rank {rank + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryDashboard;
