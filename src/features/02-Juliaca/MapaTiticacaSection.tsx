import { useState, useEffect, useRef } from "react";

const CUENCAS = [
  { id: "azangaro",   name: "Cuenca Azángaro",   contaminant: "Mercurio", value: "2.15 mg/L",   excede: "2153 veces", level: "critical", x: "36%", y: "58%" },
  { id: "lagunillas", name: "Cuenca Lagunillas",  contaminant: "Hierro",   value: "2.67 mg/L",   excede: "0.6 veces",  level: "sin",      x: "57%", y: "37%" },
  { id: "pucara",     name: "Cuenca Pucará",      contaminant: "Hierro",   value: "128.07 mg/L", excede: "25.6 veces", level: "high",     x: "29%", y: "50%" },
  { id: "ilave",      name: "Cuenca Ilave",       contaminant: "Arsénico", value: "0.03 mg/L",   excede: "3.4 veces",  level: "moderate", x: "50%", y: "56%" },
  { id: "illpa",      name: "Cuenca Illpa",       contaminant: "Aluminio", value: "13.13 mg/L",  excede: "2.6 veces",  level: "moderate", x: "66%", y: "49%" },
  { id: "suches",     name: "Cuencas Suches",     contaminant: "Aluminio", value: "40.28 mg/L",  excede: "5.0 veces",  level: "high",     x: "27%", y: "70%" },
  { id: "ramis",      name: "Intercuenca Ramis",  contaminant: "Hierro",   value: "178.05 mg/L", excede: "35.6 veces", level: "critical", x: "49%", y: "72%" },
  { id: "huancane",   name: "Cuenca Huancané",    contaminant: "Cobre",    value: "3.00 mg/L",   excede: "15 veces",   level: "high",     x: "61%", y: "74%" },
];

const LEVELS = {
  critical: { color: "#E91E8C", label: "CRÍTICO",        sub: "Relaves mineros, drenaje ácido" },
  high:     { color: "#F06292", label: "ALTO",            sub: "Daño bacteriológico" },
  moderate: { color: "#CE93D8", label: "MODERADO",        sub: "Excedencias menores de uso urbano" },
  sin:      { color: "#90A4AE", label: "SIN EXCEDENCIAS", sub: "No se registran excedencias" },
};

const ZOOM_TARGETS = {
  azangaro:   { x: 18,  y: 10  },
  lagunillas: { x: -14, y: 22  },
  pucara:     { x: 26,  y: 10  },
  ilave:      { x: 0,   y: 5   },
  illpa:      { x: -18, y: 10  },
  suches:     { x: 28,  y: -12 },
  ramis:      { x: 2,   y: -14 },
  huancane:   { x: -14, y: -14 },
};

// ── Cambia este nombre al archivo que pongas en /public ──
const MAP_IMAGE = "/mapa_titicaca.png"; // acepta .png, .jpg, .webp, .svg

export const MapaTiticacaSection = () => {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [zoom, setZoom] = useState({ scale: 1, tx: 0, ty: 0 });

  useEffect(() => {
    const SCREENS = 9;
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -top / scrollable));
      const step = progress * SCREENS;
      const idx = Math.floor(step) - 1;

      if (idx < 0) {
        setActiveIdx(-1);
        setZoom({ scale: 1, tx: 0, ty: 0 });
        return;
      }
      const cuenca = CUENCAS[Math.min(idx, CUENCAS.length - 1)];
      const target = ZOOM_TARGETS[cuenca.id];
      setActiveIdx(Math.min(idx, CUENCAS.length - 1));
      setZoom({ scale: 2.2, tx: target.x, ty: target.y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const active = activeIdx >= 0 ? CUENCAS[activeIdx] : null;
  const activeCfg = active ? LEVELS[active.level] : null;

  return (
    <div
      id="mapatiti"
      ref={sectionRef}
      style={{ position: "relative", height: "900vh" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#151B1B" }}>

        {/* Imagen del mapa */}
        <img
          src={MAP_IMAGE}
          alt="Mapa Titicaca"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: `scale(${zoom.scale}) translate(${zoom.tx}%, ${zoom.ty}%)`,
            transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transformOrigin: "center center",
            userSelect: "none",
          }}
        />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(13,21,23,0.6) 100%)",
        }} />

        {/* Leyenda — abajo derecha */}
        <div style={{
          position: "absolute", bottom: 32, right: 32, zIndex: 30,
          background: "rgba(18,24,27,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "18px 22px",
          backdropFilter: "blur(14px)",
          minWidth: 220,
        }}>
          <p style={{ color: "#90A4AE", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, margin: "0 0 14px", textTransform: "uppercase" }}>
            Leyenda
          </p>
          {Object.entries(LEVELS).map(([key, cfg]) => (
            <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                background: cfg.color, boxShadow: `0 0 7px ${cfg.color}`,
              }} />
              <div>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, margin: 0, letterSpacing: "0.02em" }}>{cfg.label}</p>
                <p style={{ color: "#78909C", fontSize: 11, margin: "2px 0 0" }}>{cfg.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Marcadores */}
        {CUENCAS.map((c, i) => {
          const cfg = LEVELS[c.level];
          const isActive = activeIdx === i;
          return (
            <div key={c.id} style={{ position: "absolute", left: c.x, top: c.y, transform: "translate(-50%,-50%)", zIndex: 20 }}>
              {/* Popup */}
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 12px)",
                left: "50%",
                width: 210,
                background: "rgba(13,21,23,0.95)",
                border: `1.5px solid ${cfg.color}`,
                borderRadius: 10, padding: "10px 14px",
                backdropFilter: "blur(12px)",
                boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 12px ${cfg.color}33`,
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(6px)",
                pointerEvents: "none",
                transition: "opacity 0.35s, transform 0.35s",
              }}>
                <span style={{
                  display: "inline-block", background: cfg.color, color: "#fff",
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
                  padding: "2px 8px", borderRadius: 20, marginBottom: 6, textTransform: "uppercase",
                }}>
                  {c.name}
                </span>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 2px", lineHeight: 1.1 }}>
                  {c.contaminant}: {c.value}
                </p>
                <p style={{ color: "#90A4AE", fontSize: 11, margin: 0 }}>
                  Excede límite permitido:{" "}
                  <span style={{ color: cfg.color, fontWeight: 700 }}>{c.excede}</span>
                </p>
                <div style={{
                  position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
                  borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                  borderTop: `7px solid ${cfg.color}`,
                }} />
              </div>

              {/* Dot */}
              <div style={{
                width: isActive ? 16 : 10, height: isActive ? 16 : 10,
                borderRadius: "50%", background: cfg.color,
                boxShadow: isActive ? `0 0 0 5px ${cfg.color}33, 0 0 16px ${cfg.color}` : `0 0 6px ${cfg.color}`,
                transition: "all 0.35s",
              }} />
            </div>
          );
        })}

        {/* Card detalle activo */}
        <div style={{
          position: "absolute", bottom: 28, left: 28, zIndex: 30, width: 260,
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s, transform 0.4s",
          pointerEvents: "none",
        }}>
          {active && (
            <div style={{
              background: "rgba(13,21,23,0.95)",
              border: `1.5px solid ${activeCfg.color}`,
              borderRadius: 12, padding: "14px 18px",
              backdropFilter: "blur(14px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${activeCfg.color}33`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeCfg.color, boxShadow: `0 0 8px ${activeCfg.color}` }} />
                <span style={{ color: activeCfg.color, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {activeCfg.label}
                </span>
              </div>
              <p style={{ color: "#cfd8dc", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>{active.name}</p>
              <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px", lineHeight: 1 }}>
                {active.contaminant}:{" "}
                <span style={{ color: activeCfg.color }}>{active.value}</span>
              </p>
              <p style={{ color: "#90A4AE", fontSize: 11, margin: "0 0 10px" }}>
                Excede límite permitido: <strong style={{ color: "#fff" }}>{active.excede}</strong>
              </p>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {CUENCAS.map((_, i) => (
                  <div key={i} style={{
                    height: 3, borderRadius: 2,
                    width: i === activeIdx ? 18 : 4,
                    background: i === activeIdx ? activeCfg.color : "rgba(255,255,255,0.15)",
                    transition: "all 0.3s",
                  }} />
                ))}
                <span style={{ color: "#546E7A", fontSize: 10, marginLeft: 6 }}>
                  {activeIdx + 1}/{CUENCAS.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Título */}
        <div style={{
          position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
          textAlign: "center", zIndex: 30, pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(14px, 2vw, 20px)", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            Cuenca del Lago Titicaca
          </h2>
          <p style={{ color: "#90A4AE", fontSize: 11, margin: "3px 0 0", letterSpacing: "0.08em" }}>
            Monitoreo de contaminantes · 8 cuencas hidrográficas
          </p>
        </div>

        {/* Scroll hint */}
        {!active && (
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            textAlign: "center", zIndex: 30, animation: "nudge 2s ease-in-out infinite",
          }}>
            <p style={{ color: "#546E7A", fontSize: 11, letterSpacing: "0.12em", margin: "0 0 6px" }}>
              SCROLL PARA EXPLORAR
            </p>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v14M3 10l6 6 6-6" stroke="#546E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

      </div>

      <style>{`
        @keyframes nudge {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
};