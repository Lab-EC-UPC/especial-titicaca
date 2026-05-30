import { useState, useRef, useEffect, useCallback } from "react";

// ─── Data
const PROJECTS = [
  {
    id: 1,
    label: "Proyecto 1",
    type: "tecnica",
    x: 78,
    y: 72,
    description:
      "Construcción de puente vehicular en la av. Los Héroes. Se ejecutó sin estudio de suelos actualizado y con materiales fuera de especificación.",
    error: "Deficiencia estructural detectada en pilares principales.",
    budget: "S/. 4,200,000",
  },
  {
    id: 2,
    label: "Proyecto 2",
    type: "administrativa",
    x: 62,
    y: 12,
    description:
      "Equipamiento de centro de salud primario. Los bienes fueron adquiridos a precio inflado y parte del lote nunca fue entregado.",
    error: "Negligencia administrativa en proceso de adquisición.",
    budget: "S/. 980,000",
  },
  {
    id: 3,
    label: "Proyecto 3",
    type: "tecnica",
    x: 38,
    y: 22,
    description:
      "Mejoramiento de pista y veredas en zona residencial. Obra paralizada sin justificación técnica registrada.",
    error: "Abandono de obra tras el 60% de avance.",
    budget: "S/. 1,560,000",
  },
  {
    id: 4,
    label: "Proyecto 4",
    type: "transparencia",
    x: 8,
    y: 38,
    description:
      "Sistema de riego tecnificado para pequeños agricultores. No se realizaron rendiciones de cuenta ni informes de impacto.",
    error: "Falta de transparencia en uso de fondos.",
    budget: "S/. 730,000",
  },
  {
    id: 5,
    label: "Proyecto 5",
    type: "administrativa",
    x: 10,
    y: 58,
    description:
      "Construcción de losas deportivas en 5 distritos. Solo se ejecutaron 2 y los contratos presentan firmas irregulares.",
    error: "Contratos con posibles falsificaciones documentarias.",
    budget: "S/. 2,100,000",
  },
  {
    id: 6,
    label: "Proyecto 6",
    type: "tecnica",
    x: 42,
    y: 55,
    description:
      "Instalación de paneles solares en comunidades rurales. Equipos instalados sin capacitación a beneficiarios ni plan de mantenimiento.",
    error: "Deficiencia técnica en instalación y posventa.",
    budget: "S/. 3,400,000",
  },
  {
    id: 7,
    label: "Proyecto 7",
    type: "transparencia",
    x: 20,
    y: 78,
    description:
      "Programa de capacitación laboral juvenil. Asistentes registrados no coinciden con los beneficiarios reales identificados en campo.",
    error: "Irregularidades en el registro de beneficiarios.",
    budget: "S/. 540,000",
  },
  {
    id: 8,
    label: "Proyecto 8",
    type: "administrativa",
    x: 52,
    y: 80,
    description:
      "Rehabilitación de infraestructura educativa en zonas de frontera. Pagos realizados a contratistas sin expediente técnico aprobado.",
    error: "Pagos indebidos sin sustento técnico previo.",
    budget: "S/. 1,870,000",
  },
];

const CONNECTIONS = [
  [1, 2],[1, 6],[1, 8],[2, 3],[3, 4],[3, 6],[4, 5],[5, 6],[5, 7],[6, 8],[7, 8],
];

const TYPE_CONFIG = {
  tecnica: {
    label: "Deficiencias técnicas",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.45)",
    gem: ["#2d6a4f", "#52b788", "#95d5b2", "#1b4332"],
  },
  administrativa: {
    label: "Negligencia administrativa",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.45)",
    gem: ["#1e3a5f", "#2563eb", "#93c5fd", "#172554"],
  },
  transparencia: {
    label: "Falta de transparencia",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.45)",
    gem: ["#6b21a8", "#a855f7", "#e879f9", "#3b0764"],
  },
};

// Gem SVG
function GemNode({ type, active }) {
  const cfg = TYPE_CONFIG[type];
  const [c0, c1, c2, c3] = cfg.gem;
  return (
    <svg
      width={52}
      height={52}
      viewBox="0 0 52 52"
      style={{
        filter: active
          ? `drop-shadow(0 0 16px ${cfg.glow}) drop-shadow(0 0 8px ${cfg.color})`
          : `drop-shadow(0 0 5px ${cfg.glow})`,
        transition: "filter 0.35s",
        display: "block",
      }}
    >
      <polygon points="26,4 46,18 40,44 12,44 6,18" fill={c0} />
      <polygon points="26,4 46,18 26,14" fill={c2} opacity="0.7" />
      <polygon points="26,4 6,18 26,14" fill={c1} opacity="0.5" />
      <polygon points="26,14 46,18 40,44 26,38" fill={c1} opacity="0.6" />
      <polygon points="26,14 6,18 12,44 26,38" fill={c3} opacity="0.5" />
      <polygon points="26,38 40,44 12,44" fill={c0} opacity="0.8" />
      <ellipse cx="22" cy="13" rx="4" ry="2" fill="white" opacity="0.18" transform="rotate(-10 22 13)" />
    </svg>
  );
}

// Main Section
export const DenunciasSection = () => {
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 500 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const getPos = useCallback(
    (p) => ({
      x: (p.x / 100) * dims.w,
      y: (p.y / 100) * dims.h,
    }),
    [dims]
  );

  const handleNodeClick = (p) => {
    if (selected?.id === p.id) {
      handleClose();
      return;
    }
    setClosing(false);
    setSelected(p);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 300);
  };

  // IDs of nodes directly connected to the selected node
  const connectedIds = selected
    ? CONNECTIONS.filter(([a, b]) => a === selected.id || b === selected.id)
        .flatMap(([a, b]) => [a, b])
        .filter((id) => id !== selected.id)
    : [];

  return (
    <div
      id="denuncias"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg,#0d1117 0%,#0f1923 55%,#0d1117 100%)",
        minHeight: "100vh",
        fontFamily: "'Syne', 'Barlow', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');
        .node-gem { cursor: pointer; }
        .node-gem:hover .gem-wrap { transform: scale(1.1); }
        .gem-wrap { transition: transform 0.35s cubic-bezier(0.34,1.5,0.64,1); }
        .popup-enter { animation: popupIn 0.36s cubic-bezier(0.34,1.26,0.64,1) forwards; }
        .popup-exit  { animation: popupOut 0.26s ease-in forwards; }
        @keyframes popupIn  {
          from { opacity:0; transform:translateY(-50%) translateX(24px) scale(0.96); }
          to   { opacity:1; transform:translateY(-50%) translateX(0)     scale(1);    }
        }
        @keyframes popupOut {
          from { opacity:1; transform:translateY(-50%) translateX(0)    scale(1);    }
          to   { opacity:0; transform:translateY(-50%) translateX(24px) scale(0.96); }
        }
        .legend-dot { width:10px; height:10px; border-radius:2px; display:inline-block; margin-right:7px; }
        .pulse-ring { animation: pulseRing 2.1s ease-out infinite; }
        @keyframes pulseRing { 0%{r:28;opacity:0.55} 100%{r:46;opacity:0} }
      `}</style>

      {/* ── Header ── */}
      <div className="relative z-10 pt-12 pb-4 text-center px-6">
        <p style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800,
          fontSize: "clamp(1.5rem,3.5vw,2.4rem)", color: "#f1f5f9",
          letterSpacing: "-0.02em", marginBottom: "0.5rem",
        }}>
          ¿Qué pasó realmente?
        </p>
        <p style={{
          fontFamily: "'Barlow',sans-serif", fontWeight: 300,
          fontSize: "clamp(0.85rem,1.5vw,1rem)", color: "#94a3b8",
          maxWidth: 540, margin: "0 auto", lineHeight: 1.6,
        }}>
          Cada proyecto acumula una historia de negligencia, opacidad o abandono
          administrativo que explica por qué los fondos no se convirtieron en resultados.
        </p>
      </div>

      {/* ── Legend ── */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-center mb-1" style={{ paddingBottom: "0.4rem" }}>
        {Object.entries(TYPE_CONFIG).map(([k, v]) => (
          <div key={k} className="flex items-center" style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.78rem", color: "#cbd5e1" }}>
            <span className="legend-dot" style={{ background: v.color, boxShadow: `0 0 6px ${v.glow}` }} />
            {v.label}
          </div>
        ))}
      </div>

      {/* ── Network Canvas ── */}
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{ width: "100%", height: "clamp(340px,55vh,600px)" }}
      >
        {/* SVG Lines layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="glow-line">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {CONNECTIONS.map(([aId, bId]) => {
            const a = PROJECTS.find((p) => p.id === aId);
            const b = PROJECTS.find((p) => p.id === bId);
            const pa = getPos(a);
            const pb = getPos(b);
            const isActive = selected && (selected.id === aId || selected.id === bId);
            const isDimmed = selected && !isActive;

            return (
              <line
                key={`${aId}-${bId}`}
                x1={pa.x} y1={pa.y}
                x2={pb.x} y2={pb.y}
                stroke={isActive ? TYPE_CONFIG[selected.type].color : "rgba(148,163,184,0.25)"}
                strokeWidth={isActive ? 2 : 1}
                filter={isActive ? "url(#glow-line)" : undefined}
                opacity={isDimmed ? 0.07 : isActive ? 0.9 : 0.45}
                style={{ transition: "stroke 0.3s, opacity 0.3s, stroke-width 0.3s" }}
              />
            );
          })}

          {/* Pulse rings on selected node – stays at original position */}
          {selected && (() => {
            const pos = getPos(selected);
            return (
              <>
                <circle cx={pos.x} cy={pos.y} r="28" fill="none"
                  stroke={TYPE_CONFIG[selected.type].color} strokeWidth="1.5"
                  className="pulse-ring" />
                <circle cx={pos.x} cy={pos.y} r="28" fill="none"
                  stroke={TYPE_CONFIG[selected.type].color} strokeWidth="1"
                  className="pulse-ring" style={{ animationDelay: "0.9s" }} />
              </>
            );
          })()}
        </svg>

        {/* Nodes */}
        {PROJECTS.map((p) => {
          const pos = getPos(p);
          const isSelected = selected?.id === p.id;
          const isConnected = connectedIds.includes(p.id);
          const isDimmed = selected && !isSelected && !isConnected;
          const scale = isSelected ? 1.6 : isConnected ? 1.1 : 1;

          return (
            <div
              key={p.id}
              className="node-gem absolute"
              style={{
                left: pos.x,
                top: pos.y,
                // Fixed anchor — no positional transform, only scale via child
                transform: "translate(-50%, -50%)",
                zIndex: isSelected ? 20 : isConnected ? 15 : 10,
                opacity: isDimmed ? 0.18 : 1,
                transition: "opacity 0.3s",
              }}
              onClick={() => handleNodeClick(p)}
            >
              {/* Scale wrapper — scales in place around center */}
              <div
                className="gem-wrap"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  transition: "transform 0.38s cubic-bezier(0.34,1.5,0.64,1)",
                }}
              >
                <GemNode type={p.type} active={isSelected} />
              </div>

              {/* Label */}
              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "'Barlow',sans-serif",
                fontSize: "0.68rem",
                fontWeight: isSelected ? 600 : 400,
                color: isSelected
                  ? TYPE_CONFIG[p.type].color
                  : isConnected ? "#e2e8f0" : "#64748b",
                whiteSpace: "nowrap",
                textShadow: isSelected ? `0 0 10px ${TYPE_CONFIG[p.type].glow}` : "none",
                transition: "color 0.3s",
                pointerEvents: "none",
                letterSpacing: "0.04em",
              }}>
                {p.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-center pb-4" style={{
        fontFamily: "'Barlow',sans-serif", fontSize: "0.72rem",
        color: selected ? "transparent" : "#2d3f55",
        letterSpacing: "0.07em", textTransform: "uppercase",
        transition: "color 0.3s", userSelect: "none",
      }}>
        Haz clic en un nodo para explorar el proyecto
      </p>

      {/* ── Popup ── */}
      {selected && (
        <div
          className={`absolute z-30 ${closing ? "popup-exit" : "popup-enter"}`}
          style={{
            top: "50%",
            right: "clamp(12px, 3vw, 40px)",
            width: "clamp(220px, 26vw, 310px)",
            background: "rgba(10,18,32,0.84)",
            backdropFilter: "blur(20px) saturate(1.6)",
            WebkitBackdropFilter: "blur(20px) saturate(1.6)",
            border: `1px solid ${TYPE_CONFIG[selected.type].color}38`,
            borderRadius: 14,
            boxShadow: `0 0 50px rgba(0,0,0,0.65), 0 0 22px ${TYPE_CONFIG[selected.type].glow}`,
            padding: "1.4rem 1.4rem 1.2rem",
            transform: "translateY(-50%)",
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 26, height: 26, borderRadius: "50%",
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(148,163,184,0.1)", color: "#94a3b8",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "0.8rem", fontWeight: 700,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,114,182,0.2)"; e.currentTarget.style.color = "#f472b6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(148,163,184,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            ✕
          </button>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${TYPE_CONFIG[selected.type].color}14`,
            border: `1px solid ${TYPE_CONFIG[selected.type].color}48`,
            borderRadius: 99, padding: "2px 10px", marginBottom: "0.75rem",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: TYPE_CONFIG[selected.type].color,
              boxShadow: `0 0 6px ${TYPE_CONFIG[selected.type].color}`,
              display: "inline-block",
            }} />
            <span style={{
              fontFamily: "'Barlow',sans-serif", fontSize: "0.66rem", fontWeight: 500,
              color: TYPE_CONFIG[selected.type].color,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {TYPE_CONFIG[selected.type].label}
            </span>
          </div>

          {/* Title */}
          <p style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 700,
            fontSize: "1.05rem", color: "#f1f5f9",
            marginBottom: "0.55rem", lineHeight: 1.25,
          }}>
            {selected.label}
          </p>

          {/* Description */}
          <p style={{
            fontFamily: "'Barlow',sans-serif", fontWeight: 300,
            fontSize: "0.79rem", color: "#94a3b8",
            lineHeight: 1.65, marginBottom: "0.75rem",
          }}>
            {selected.description}
          </p>

          {/* Error */}
          <div style={{
            background: "rgba(244,114,182,0.07)",
            border: "1px solid rgba(244,114,182,0.2)",
            borderRadius: 8, padding: "0.5rem 0.7rem", marginBottom: "0.85rem",
          }}>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.66rem", color: "#f472b6", fontWeight: 500, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Error detectado
            </p>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.77rem", color: "#fecdd3" }}>
              {selected.error}
            </p>
          </div>

          {/* Budget */}
          <div style={{ borderTop: "1px solid rgba(148,163,184,0.1)", paddingTop: "0.7rem" }}>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.66rem", color: "#475569", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>
              Costo del proyecto
            </p>
            <p style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: "1.45rem", color: "#f1f5f9", letterSpacing: "-0.01em",
            }}>
              {selected.budget}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DenunciasSection;