import React, { useEffect, useRef } from "react";
import { useMasteryCalculator } from "../../hooks/useMasteryCalculator";
import gsap from "gsap";

const MasteryDashboard: React.FC = () => {
  const { totalXP, rank, title, nextTitle, progressPct, nextRankXP, rankImageFile } = useMasteryCalculator();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRankImageUrl = (filename: string) => {
    try {
      return new URL(`../../../assets/img/ranks/${filename}`, import.meta.url).href;
    } catch (e) {
      return `https://via.placeholder.com/64/100e1a/c8a96e?text=${rank}`;
    }
  };

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progressPct}%`,
        duration: 0.8, // Snappier response
        ease: "power2.out",
      });
    }
  }, [progressPct]);

  useEffect(() => {
    if (containerRef.current && rank > 0) {
      gsap.fromTo(
        containerRef.current,
        { boxShadow: "0 0 0px rgba(76,201,255,0)" },
        { 
          boxShadow: "0 0 30px rgba(76,201,255,0.3)", 
          duration: 0.3, 
          yoyo: true, 
          repeat: 1 
        }
      );
    }
  }, [rank]);

  return (
    <div 
      ref={containerRef}
      className="w-full bg-[#100e1a] border border-[#1e1a2e] rounded-xl p-4 flex items-center gap-6 font-nunito group/dash hover:border-[#c8a96e]/20 transition-all duration-500 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -left-20 -top-20 w-40 h-40 bg-[#4cc9ff]/5 blur-[80px] pointer-events-none" />

      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/dash:scale-125">
          <img
            key={rankImageFile} // Force instant element swap on rank change
            src={getRankImageUrl(rankImageFile)}
            alt={title}
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(200,169,110,0.4)]"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/64/100e1a/c8a96e?text=${rank}`;
            }}
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#c8a96e] text-[#08060e] text-[9px] font-black px-1.5 py-0.5 rounded border-2 border-[#100e1a] z-20 shadow-lg">
          {rank}
        </div>
        
        <div className="absolute inset-0 bg-[#4cc9ff]/20 blur-2xl rounded-full opacity-0 group-hover/dash:opacity-100 transition-opacity duration-700" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div className="truncate">
            <h3 className="text-[#f0e6d3] font-black text-xl uppercase tracking-tighter leading-none transition-colors group-hover/dash:text-[#c8a96e]">
              {title}
            </h3>
            <span className="text-[#c8a96e]/60 text-[10px] font-bold uppercase tracking-widest leading-none mt-1.5 inline-block">
              Selo de Maestria
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[#8a7a9b] text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">XP Total</span>
              <span className="text-[#f0e6d3] font-black text-2xl leading-none tracking-tighter">
                {totalXP.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="h-3 w-full bg-[#08060e] rounded-full overflow-hidden border border-[#1e1a2e] p-[2px] shadow-inner relative">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#4cc9ff] via-[#a78fff] to-[#4cc9ff] bg-[length:200%_100%] animate-gradient-x rounded-full relative shadow-[0_0_15px_rgba(76,201,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-black uppercase tracking-wider leading-none">
            <span className="text-[#c8a96e]/40 transition-colors group-hover/dash:text-[#c8a96e]">Sincronização com o Void</span>
            <span className="text-[#f0e6d3]/40">
              Próximo: <span className="text-[#c8a96e]">{nextTitle} em {nextRankXP.toLocaleString("pt-BR")} XP</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryDashboard;
