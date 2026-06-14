import { useState, useEffect } from "react";
import {
  LEVELS,
  MOBILE_BP,
  type CuencaId,
  CUENCAS,
  DOTS_DESKTOP,
} from "../03-MapaTiticaca/mapData";

type XY = { x: number; y: number };
const DOTS = DOTS_DESKTOP as Record<CuencaId, XY>;

export const MapSection = ({ start }: { start?: number }) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BP : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      data-map-section
      data-start={start ?? 0.48}
      data-images={8}
      data-snap={160}
      data-transition={60}
      className="absolute inset-0 z-20 opacity-0 pointer-events-none"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src="/mapa_titicaca.png"
          alt="Mapa Lago Titicaca"
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          style={{ display: isMobile ? "none" : "block" }}
        />
        <img
          src="/mapa_titicaca_mobile.png"
          alt="Mapa Lago Titicaca móvil"
          className="max-w-full max-h-full object-cover select-none pointer-events-none"
          style={{ display: isMobile ? "block" : "none" }}
        />

        {!isMobile && CUENCAS.map((c, i) => {
          const cfg = LEVELS[c.level];
          const dot = DOTS[c.id];
          return (
            <div
              key={c.id}
              data-map-cuenca={i}
              className="flex flex-col items-center pointer-events-none"
              style={{
                position: "absolute",
                left: dot.x + "%",
                top: dot.y + "%",
                transform: "translate(-50%,-50%)",
                opacity: 0,
                transition: "opacity 0.45s ease",
                gap: 4,
              }}
            >
              <div
                className="absolute rounded-[50%] opacity-70"
                style={{
                  width: 30,
                  height: 30,
                  border: `1.5px solid ${cfg.color}`,
                  animation: "ringPulse 1.6s ease-out infinite",
                }}
              />
              <div
                className="rounded-[50%] shrink-0"
                style={{
                  width: 14,
                  height: 14,
                  background: cfg.color,
                  boxShadow: `0 0 0 4px ${cfg.color}33, 0 0 14px ${cfg.color}`,
                }}
              />
              <span
                className="text-white font-semibold whitespace-nowrap select-none tracking-wider"
                style={{
                  fontFamily: "'Citizen OT', 'CitizenOT', serif",
                  fontSize: "clamp(9px,1.1vw,12px)",
                  textShadow: "0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)",
                }}
              >
                {c.shortName}
              </span>
            </div>
          );
        })}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center,transparent 40%,rgba(13,21,23,0.6) 100%)",
          }}
        />

        {!isMobile && (
          <div
            className="absolute z-30 rounded-xl"
            style={{
              bottom: "clamp(16px,3vw,32px)",
              right: "clamp(12px,2vw,32px)",
              background: "rgba(18,24,27,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "clamp(10px,1.5vw,18px) clamp(12px,1.8vw,22px)",
              backdropFilter: "blur(14px)",
              minWidth: "clamp(160px,18vw,220px)",
            }}
          >
            <p className="text-[#90A4AE] font-bold tracking-widest uppercase m-0"
              style={{ fontSize: "clamp(9px,1vw,10px)" }}
            >
              Leyenda
            </p>
            {Object.entries(LEVELS).map(([key, cfg]) => (
              <div key={key} className="flex items-start gap-[10px] mb-[8px]">
                <div
                  className="rounded-[50%] shrink-0 mt-[2px]"
                  style={{
                    width: 12,
                    height: 12,
                    background: cfg.color,
                    boxShadow: `0 0 6px ${cfg.color}`,
                  }}
                />
                <div>
                  <p className="text-white font-bold m-0"
                    style={{ fontSize: "clamp(10px,1.1vw,12px)" }}
                  >
                    {cfg.label}
                  </p>
                  <p className="text-[#78909C] m-0"
                    style={{ fontSize: "clamp(9px,0.9vw,11px)" }}
                  >
                    {cfg.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isMobile && CUENCAS.map((c, i) => {
          const cfg = LEVELS[c.level];
          return (
            <div
              key={c.id}
              data-map-card={i}
              className="absolute z-30 pointer-events-none"
              style={{
                bottom: "clamp(16px,3vw,28px)",
                left: "clamp(12px,2vw,28px)",
                width: "clamp(200px,22vw,260px)",
                opacity: 0,
                transition: "opacity 0.4s",
              }}
            >
              <div
                className="rounded-xl"
                style={{
                  background: "rgba(13,21,23,0.96)",
                  border: `1.5px solid ${cfg.color}`,
                  padding: "clamp(10px,1.5vw,14px) clamp(12px,1.8vw,18px)",
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${cfg.color}22`,
                }}
              >
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <div
                    className="rounded-[50%]"
                    style={{ width: 8, height: 8, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
                  />
                  <span
                    className="font-extrabold tracking-widest uppercase"
                    style={{ color: cfg.color, fontSize: "clamp(9px,0.9vw,10px)" }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[#cfd8dc] font-semibold m-0 mb-[3px]"
                  style={{ fontSize: "clamp(10px,1vw,12px)" }}
                >
                  {c.name}
                </p>
                <p className="text-white font-black m-0 mb-[3px] leading-none"
                  style={{ fontSize: "clamp(16px,2vw,22px)" }}
                >
                  {c.contaminant}: <span style={{ color: cfg.color }}>{c.value}</span>
                </p>
                <p className="text-[#90A4AE] m-0 mb-[10px]"
                  style={{ fontSize: "clamp(10px,1vw,11px)" }}
                >
                  Excede límite: <strong className="text-white">{c.excede}</strong>
                </p>
                <div className="flex items-center gap-[3px]">
                  {CUENCAS.map((_, j) => (
                    <div
                      key={j}
                      className="rounded-[2px]"
                      style={{
                        height: 3,
                        width: j === i ? 18 : 4,
                        background: j <= i ? cfg.color + (j === i ? "" : "66") : "rgba(255,255,255,0.12)",
                        transition: "all 0.35s",
                      }}
                    />
                  ))}
                  <span className="text-[#546E7A] ml-[5px]" style={{ fontSize: 10 }}>
                    {i + 1}/{CUENCAS.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="absolute z-30 text-center pointer-events-none"
          style={{
            top: isMobile ? 16 : 20,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          <h2
            className="text-white font-extrabold tracking-widest uppercase m-0"
            style={{
              fontFamily: "'Citizen OT', 'CitizenOT', serif",
              fontSize: isMobile ? "clamp(11px,3.5vw,14px)" : "clamp(13px,2vw,20px)",
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}
          >
            CONCENTRACIÓN DE <br /> METALES POR CUENCA
          </h2>
          <p
            className="text-[#546E7A] m-0 mt-[3px] tracking-wider"
            style={{
              fontSize: isMobile ? "clamp(8px,2.2vw,10px)" : "clamp(9px,1vw,11px)",
              fontFamily: "'Citizen OT', 'CitizenOT', serif",
            }}
          >
            Monitoreo de contaminantes · 8 cuencas hidrográficas
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
