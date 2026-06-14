import { useState, useEffect } from "react";

const MOBILE_BP = 768;
const TOTAL_FRAMES = 8;

export const VertimientosSection = ({ start }: { start?: number }) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BP : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const getImageSrc = (frame: number) =>
    isMobile ? `/images/cuencasmobil${frame}.png` : `/images/cuencas${frame}.png`;

  return (
    <div
      data-vertimientos-section
      data-start={start ?? 0.67}
      data-images={8}
      data-snap={140}
      data-transition={50}
      className="absolute inset-0 z-20 opacity-0 pointer-events-none"
      style={{ background: "#151B1B" }}
    >
      {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
        <img
          key={`${isMobile ? "mob" : "desk"}-${frame}`}
          src={getImageSrc(frame)}
          alt={`Vertimientos — frame ${frame} de ${TOTAL_FRAMES}`}
          data-vertimientos-frame={frame}
          className="absolute inset-0 w-full h-full object-contain select-none transition-opacity duration-500"
          style={{ opacity: 0 }}
          draggable={false}
        />
      ))}

      <div
        data-vertimientos-title
        className="absolute top-[6%] md:top-[8%] left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none w-full px-4"
        style={{ opacity: 0 }}
      >
        <h2
          className="text-white uppercase tracking-[0.18em] md:tracking-[0.22em] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
          style={{ fontFamily: "'Citizen OT', sans-serif" }}
        >
          El rastro de los vertimientos
        </h2>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
          <div
            key={frame}
            data-vertimientos-dot={frame}
            className="rounded-full transition-all duration-300"
            style={{
              width: 8,
              height: 8,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
