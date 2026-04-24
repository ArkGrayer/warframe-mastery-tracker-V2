import React, { useState, useEffect, useRef } from "react";
import { LucideArrowUp } from "lucide-react";
import gsap from "gsap";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) return;

      scrollTimeout.current = window.setTimeout(() => {
        setIsVisible(window.pageYOffset > 400);
        scrollTimeout.current = null;
      }, 100); // Throttling
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      if (isVisible) {
        gsap.to(buttonRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          pointerEvents: "auto",
          overwrite: true,
        });
      } else {
        gsap.to(buttonRef.current, {
          opacity: 0,
          y: 30,
          scale: 0.5,
          duration: 0.4,
          ease: "power2.in",
          pointerEvents: "none",
          overwrite: true,
        });
      }
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      style={{ opacity: 0, transform: "translateY(30px) scale(0.5)", pointerEvents: "none" }}
      className="fixed bottom-8 right-8 z-[100] p-4 bg-[#100e1a]/80 backdrop-blur-md border-2 border-[#c8a96e]/30 text-[#c8a96e] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:bg-[#c8a96e] hover:text-[#08060e] hover:border-[#c8a96e] hover:-translate-y-2 transition-all duration-300 active:scale-90 group flex items-center justify-center"
      aria-label="Voltar ao topo"
    >
      <LucideArrowUp size={24} className="group-hover:animate-bounce" />
      <div className="absolute inset-0 rounded-2xl bg-[#c8a96e]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default ScrollToTop;
