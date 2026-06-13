import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 8;
const MOBILE_BREAKPOINT = 768;

export const ContaminacionCuencaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScrollable);
      const frame = Math.min(Math.floor(progress * TOTAL_FRAMES) + 1, TOTAL_FRAMES);
      setCurrentFrame(frame);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Calcular al montar
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getImageSrc = (frame: number) =>
    isMobile
      ? `/images/cuencasmobil${frame}.png`
      : `/images/cuencas${frame}.png`;

  return (
    
    <div
      id="cuencas"
      ref={sectionRef}
      style={{ height: `${TOTAL_FRAMES * 100}vh` }}
    >
      {/*sticky*/}
      <div className="sticky top-0 w-full h-screen bg-[#151B1B] overflow-hidden">

        {/*Frames apilados*/}
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
          <img
            key={`${isMobile ? "mob" : "desk"}-${frame}`}
            src={getImageSrc(frame)}
            alt={`Lago Titicaca — cuenca ${frame} de ${TOTAL_FRAMES}`}
            loading="eager"
            draggable={false}
            className={[
              "absolute inset-0 w-full h-full object-contain select-none",
              "transition-opacity duration-500",
              frame === currentFrame ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        ))}

        {/*Título principal*/}
        <div className={`absolute top-[6%] md:top-[8%] left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none w-full px-4 transition-opacity duration-500 ${currentFrame === 1 ? "opacity-100" : "opacity-0"}`}>
          <h2
            className="text-white uppercase tracking-[0.18em] md:tracking-[0.22em] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
            style={{ fontFamily: "'Citizen OT', sans-serif" }}
          >
            El rastro de los vertimientos
          </h2>
        </div>

        {/*Indicador*/}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
            <div
              key={frame}
              aria-hidden
              className={[
                "rounded-full transition-all duration-300",
                frame === currentFrame
                  ? "w-2.5 h-2.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                  : frame < currentFrame
                  ? "w-2 h-2 bg-white/50"
                  : "w-2 h-2 bg-white/20",
              ].join(" ")}
            />
          ))}
        </div>

        {/*Hint de scroll*/}
        <div
          aria-hidden
          className={[
            "absolute bottom-20 left-1/2 -translate-x-1/2 z-10",
            "flex flex-col items-center gap-2 pointer-events-none",
            "transition-opacity duration-700",
            currentFrame === 1 ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <span className="text-white/40 text-[10px] md:text-xs tracking-[0.4em] uppercase font-light">
            Scroll
          </span>
          {/* Flecha animada */}
          <svg
            className="w-4 h-4 text-white/40 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};