import { useState, useRef, useEffect, useCallback } from "react";

// Types
type ProjectType = "tecnica" | "administrativa" | "transparencia";

interface Project {
  id: number;
  label: string;
  type: ProjectType;
  // desktop position (% of canvas)
  dx: number;
  dy: number;
  // mobile position (% of canvas)
  mx: number;
  my: number;
  description: string;
  budget: string;
}

interface TypeConfig {
  label: string;
  color: string;
  glow: string;
  gem: [string, string, string, string, string, string];
}

// ─── Connection groups (por tipo / color)
const GROUP_TRANS = "transparencia";
const GROUP_TEC   = "tecnica";
const GROUP_ADMIN = "administrativa";
const GROUP_CROSS = "cross"; // always dim — never highlighted

interface Connection {
  a: number;
  b: number;
  group: string;
}

const CONNECTIONS: Connection[] = [
  // ── Transparencia (magenta): 1 Plan Maestro · 3 Agua y Saneamiento
  { a: 1, b: 3, group: GROUP_TRANS },

  // ── Técnica (teal): 2 Limpieza · 5 Sistemas · 6 Hospital · 7 Adecuación
  { a: 5, b: 7, group: GROUP_TEC },
  { a: 6, b: 7, group: GROUP_TEC },

  // ── Administrativa (azul): 4 Electrobombas · 8 PTAR
  { a: 4, b: 8, group: GROUP_ADMIN },

  // ── Cross connections — always dim
  { a: 1, b: 2, group: GROUP_CROSS }, // Plan Maestro ↔ Limpieza
  { a: 1, b: 6, group: GROUP_CROSS }, // Plan Maestro ↔ Hospital
  { a: 2, b: 4, group: GROUP_CROSS }, // Limpieza ↔ Electrobombas
  { a: 2, b: 8, group: GROUP_CROSS }, // Limpieza ↔ PTAR
  { a: 2, b: 3, group: GROUP_CROSS }, // Limpieza ↔ Agua y Saneamiento
  { a: 3, b: 6, group: GROUP_CROSS },
  { a: 3, b: 7, group: GROUP_CROSS },
  { a: 3, b: 5, group: GROUP_CROSS },
  { a: 4, b: 5, group: GROUP_CROSS },
  { a: 5, b: 8, group: GROUP_CROSS },
];

// Which group does each node belong to (for highlighting logic)?
const NODE_GROUP: Record<number, string> = {
  1: GROUP_TRANS,
  3: GROUP_TRANS,
  2: GROUP_TEC,
  5: GROUP_TEC,
  6: GROUP_TEC,
  7: GROUP_TEC,
  4: GROUP_ADMIN,
  8: GROUP_ADMIN,
};

// Project data
const PROJECTS: Project[] = [
  {
    id: 1, label: "Plan Maestro", type: "transparencia",
    dx: 23, dy: 20,   mx: 26, my: 9,
    description: "Construcción de puente vehicular en la av. Los Héroes. Se ejecutó sin estudio de suelos actualizado y con materiales fuera de especificación.",
    budget: "4,200,000",
  },
  {
    id: 2, label: "Limpieza Pública\nen Ayaviri", type: "tecnica",
    dx: 47, dy: 29,   mx: 72, my: 17,
    description: "Equipamiento de centro de salud primario. Bienes adquiridos a precio inflado y parte del lote nunca fue entregado.",
    budget: "980,000",
  },
  {
    id: 3, label: "Agua y Saneamiento\nen Ocuviri", type: "transparencia",
    dx: 40, dy: 51,   mx: 30, my: 40,
    description: "Mejoramiento de pista y veredas en zona residencial. Obra paralizada sin justificación técnica registrada.",
    budget: "1,560,000",
  },
  {
    id: 4, label: "Electrobombas\nEMSAPUNO", type: "administrativa",
    dx: 75, dy: 27,   mx: 76, my: 31,
    description: "Sistema de riego tecnificado para pequeños agricultores. No se realizaron rendiciones de cuenta ni informes de impacto.",
    budget: "730,000",
  },
  {
    id: 5, label: "Sistemas de Bombeo\ny Riego (PEBLT)", type: "tecnica",
    dx: 60, dy: 61,   mx: 66, my: 56,
    description: "Construcción de losas deportivas en 5 distritos. Solo se ejecutaron 2 y los contratos presentan firmas irregulares.",
    budget: "2,100,000",
  },
  {
    id: 6, label: "Hospital Regional\nManuel Núñez Butrón", type: "tecnica",
    dx: 18, dy: 48,   mx: 22, my: 52,
    description: "Instalación de paneles solares en comunidades rurales. Equipos instalados sin capacitación ni plan de mantenimiento.",
    budget: "3,400,000",
  },
  {
    id: 7, label: "Adecuación de Vertimientos\n(Río Cabanillas)", type: "tecnica",
    dx: 27, dy: 70,   mx: 34, my: 74,
    description: "Programa de capacitación laboral juvenil. Asistentes registrados no coinciden con los beneficiarios reales.",
    budget: "540,000",
  },
  {
    id: 8, label: "PTAR Titicaca", type: "administrativa",
    dx: 82, dy: 72,   mx: 72, my: 86,
    description: "Rehabilitación de infraestructura educativa en zonas de frontera. Pagos realizados sin expediente técnico aprobado.",
    budget: "1,870,000",
  },
];

const TYPE_CFG: Record<ProjectType, TypeConfig> = {
  tecnica: {
    label: "Deficiencias técnicas",
    color: "#2e9079",
    glow: "rgba(46,144,121,0.55)",
    gem: ["#14443a", "#226d5b", "#3a9580", "#0e3029", "#2c7b67", "#4fa88e"],
  },
  administrativa: {
    label: "Neglicencia administrativa",
    color: "#3a6a82",
    glow: "rgba(58,106,130,0.6)",
    gem: ["#1e4555", "#2d6070", "#4a8090", "#163545", "#3a7080", "#5a96a4"],
  },
  transparencia: {
    label: "Falta de transparencia",
    color: "#8a4a7a",
    glow: "rgba(138,74,122,0.65)",
    gem: ["#6a2a58", "#8a3a70", "#ae5890", "#451838", "#9a4880", "#c070b0"],
  },
} as const;

// ─── Gem SVG
function GemSVG({
  type,
  size,
  active,
}: {
  type: ProjectType;
  size: number;
  active: boolean;
}) {
  const c = TYPE_CFG[type];
  const [c0, c1, c2, c3, c4, c5] = c.gem;
  const f = active
    ? `drop-shadow(0 0 16px ${c.glow}) drop-shadow(0 0 8px ${c.color})`
    : `drop-shadow(0 0 7px ${c.glow})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={{ display: "block", filter: f, transition: "filter 0.3s" }}
    >
      <polygon points="40,6 70,22 74,54 55,74 25,74 6,54 10,22" fill={c0} />
      <polygon points="40,6 70,22 50,30 40,18" fill={c2} opacity="0.85" />
      <polygon points="40,6 10,22 30,30 40,18" fill={c1} opacity="0.65" />
      <polygon points="40,18 70,22 74,54 55,44" fill={c4} opacity="0.55" />
      <polygon points="40,18 10,22 6,54 25,44" fill={c1} opacity="0.5" />
      <polygon points="40,18 55,44 40,58 25,44" fill={c5} opacity="0.45" />
      <polygon points="55,44 74,54 55,74 40,58" fill={c3} opacity="0.75" />
      <polygon points="25,44 6,54 25,74 40,58" fill={c0} opacity="0.88" />
      <polygon points="40,58 55,74 25,74" fill={c3} opacity="0.92" />
      <ellipse cx="36" cy="20" rx="6" ry="3" fill="white" opacity="0.18"
        transform="rotate(-12 36 20)" />
    </svg>
  );
}

// Legend
function Legend({ inline }: { inline: boolean }) {
  if (inline) {
    // Mobile: box top-left
    return (
      <div style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 8,
        background: "rgba(20,24,34,0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "10px 14px",
        margin: "0 0 0 12px",
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed',sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#5a6272",
          marginBottom: 2,
        }}>Leyenda</span>
        {(["tecnica", "administrativa", "transparencia"] as ProjectType[]).map((k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 3,
              background: TYPE_CFG[k].color, flexShrink: 0, display: "inline-block",
            }} />
            <span style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#9aa3b0",
            }}>{TYPE_CFG[k].label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: pill bar bottom
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: "clamp(8px,2vw,22px)",
      margin: "16px clamp(12px,5%,64px) 28px",
      background: "rgba(15,18,26,0.55)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 40,
      padding: "10px 28px",
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed',sans-serif",
        fontSize: "clamp(9px,1.1vw,11px)", fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase", color: "#5a6272",
      }}>Leyenda</span>
      {(["tecnica", "administrativa", "transparencia"] as ProjectType[]).map((k) => (
        <div key={k} style={{
          display: "flex", alignItems: "center", gap: 7,
          fontSize: "clamp(9px,1.2vw,12px)", fontWeight: 600,
          letterSpacing: "0.12em", textTransform: "uppercase", color: "#9aa3b0",
          fontFamily: "'Barlow Condensed',sans-serif",
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: 3,
            background: TYPE_CFG[k].color, flexShrink: 0, display: "inline-block",
          }} />
          {TYPE_CFG[k].label}
        </div>
      ))}
    </div>
  );
}

// Section component
export const ProyectosBajoLaLupaSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [closing, setClosing]   = useState(false);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);
  const [dims, setDims]     = useState({ w: 700, h: 420 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.offsetWidth || 700;
      const mobile = w < 600;
      setIsMobile(mobile);
      setDims({
        w,
        h: mobile ? Math.max(w * 1.5, 480) : Math.max(w * 0.44, 340),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const nodeSize = Math.max(32, Math.min(62, dims.w * (isMobile ? 0.1 : 0.075)));

  const getPos = useCallback(
    (p: Project) => ({
      x: ((isMobile ? p.mx : p.dx) / 100) * dims.w,
      y: ((isMobile ? p.my : p.dy) / 100) * dims.h,
    }),
    [dims, isMobile]
  );

  // Nodes mismo grupo
  const selectedGroup = selected ? NODE_GROUP[selected.id] : null;
  const groupMemberIds: number[] = selectedGroup
    ? PROJECTS.filter((p) => NODE_GROUP[p.id] === selectedGroup).map((p) => p.id)
    : [];

  const handleClick = (p: Project) => {
    if (closing) return;
    if (selected?.id === p.id) { handleClose(); return; }
    setClosing(false);
    setSelected(p);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setSelected(null); setClosing(false); }, 260);
  };

  // Popup positioning
  const getPopupStyle = (p: Project): React.CSSProperties => {
    const pos = getPos(p);
    const pw  = Math.max(180, Math.min(260, dims.w * (isMobile ? 0.55 : 0.29)));
    const ph  = 210;
    let left  = pos.x - pw - nodeSize * 0.7;
    let top   = pos.y - ph * 0.55;
    if (left < 8)              left = pos.x + nodeSize * 0.7;
    if (left + pw > dims.w - 8) left = pos.x - pw - nodeSize * 0.7;
    if (top < 8)               top  = 8;
    if (top + ph > dims.h - 8) top  = dims.h - ph - 8;
    return {
      position: "absolute", left, top, width: pw,
      background: "rgba(30,36,48,0.94)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "16px 16px 14px",
      zIndex: 40,
      boxShadow: `0 10px 50px rgba(0,0,0,0.6), 0 0 24px ${TYPE_CFG[p.type].glow}`,
    };
  };

  return (
    <div
      id="proyectos-lupa"
      ref={wrapRef}
      style={{
        background: "#2e3440",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      {/* ── Scoped styles — only inside #proyectos-lupa ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap');
        #proyectos-lupa .dn-node { cursor: pointer; position: absolute; }
        #proyectos-lupa .dn-wrap { transition: transform 0.4s cubic-bezier(0.34,1.5,0.64,1); transform-origin: center center; }
        #proyectos-lupa .dn-node:hover .dn-wrap { filter: brightness(1.2); }
        #proyectos-lupa .dn-popup-enter { animation: dnPopIn  0.36s cubic-bezier(0.34,1.26,0.64,1) forwards; }
        #proyectos-lupa .dn-popup-exit  { animation: dnPopOut 0.24s ease-in forwards; }
        @keyframes dnPopIn  { from{opacity:0;transform:scale(0.86) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes dnPopOut { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(0.86) translateY(10px)} }
        #proyectos-lupa .dn-pulse  { animation: dnPulse 2.2s ease-out infinite; }
        #proyectos-lupa .dn-pulse2 { animation: dnPulse 2.2s ease-out 1s infinite; }
        @keyframes dnPulse { 0%{opacity:0.6} 100%{r:54;opacity:0} }
      `}</style>

      {/* ── Title ── */}
      <div style={{
        textAlign: "center",
        padding: "28px 16px 12px",
        letterSpacing: "0.18em",
        fontSize: "clamp(14px,2.5vw,22px)",
        fontWeight: 700,
        color: "#c8cfd8",
        textTransform: "uppercase",
      }}>
        Proyectos bajo la lupa
      </div>

      {/* ── Mobile legend── */}
      {isMobile && (
        <div style={{ padding: "0 12px 10px" }}>
          <Legend inline={true} />
        </div>
      )}

      {/* ── Network canvas ── */}
      <div
        ref={canvasRef}
        style={{ position: "relative", width: "100%", height: dims.h }}
      >
        {/* SVG lines */}
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          overflow: "visible", pointerEvents: "none",
        }}>
          <defs>
            <filter id="dn-glow-line">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {CONNECTIONS.map(({ a: aId, b: bId, group }) => {
            const a = PROJECTS.find((p) => p.id === aId)!;
            const b = PROJECTS.find((p) => p.id === bId)!;
            const pa = getPos(a);
            const pb = getPos(b);

            const isActive =
              selected !== null &&
              group !== GROUP_CROSS &&
              group === selectedGroup;


            const isDimmed = selected !== null && !isActive;

            return (
              <line
                key={`${aId}-${bId}`}
                x1={pa.x} y1={pa.y}
                x2={pb.x} y2={pb.y}
                stroke={isActive ? TYPE_CFG[selected!.type].color : "rgba(178,188,202,0.7)"}
                strokeWidth={isActive ? 6.5 : 5.5}
                filter={isActive ? "url(#dn-glow-line)" : undefined}
                opacity={isDimmed ? 0.06 : group === GROUP_CROSS ? 0.32 : 0.45}
                style={{ transition: "stroke 0.3s, opacity 0.3s, stroke-width 0.3s" }}
              />
            );
          })}

          {/* Pulse rings */}
          {selected && (() => {
            const pos = getPos(selected);
            const col = TYPE_CFG[selected.type].color;
            const pr  = nodeSize * 0.52;
            return (
              <>
                <circle cx={pos.x} cy={pos.y} r={pr} fill="none"
                  stroke={col} strokeWidth="1.5" className="dn-pulse" />
                <circle cx={pos.x} cy={pos.y} r={pr} fill="none"
                  stroke={col} strokeWidth="1" className="dn-pulse2" />
              </>
            );
          })()}
        </svg>

        {/* Nodes */}
        {PROJECTS.map((p) => {
          const pos      = getPos(p);
          const isSel    = selected?.id === p.id;
          const isInGroup = groupMemberIds.includes(p.id);
          const isDim    = selected !== null && !isInGroup;
          const scale    = isSel ? 1.6 : isInGroup ? 1.12 : 1;
          const labelColor = isSel
            ? TYPE_CFG[p.type].color
            : isInGroup ? "#d0d8e4" : "#6b7585";

          return (
            <div
              key={p.id}
              className="dn-node"
              style={{
                left: pos.x, top: pos.y,
                transform: "translate(-50%,-50%)",
                zIndex: isSel ? 20 : isInGroup ? 15 : 10,
                opacity: isDim ? 0.2 : 1,
                transition: "opacity 0.3s",
              }}
              onClick={() => handleClick(p)}
            >
              <div className="dn-wrap" style={{ transform: `scale(${scale})` }}>
                <GemSVG type={p.type} size={nodeSize} active={isSel} />
              </div>
              <div style={{
                position: "absolute",
                top: nodeSize + 6,
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "pre-line",
                textAlign: "center",
                lineHeight: 1.25,
                width: "max-content",
                maxWidth: 180,
                fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: `clamp(10px,${dims.w * 0.014}px,14px)`,
                fontWeight: isSel ? 700 : 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: labelColor,
                textShadow: isSel ? `0 0 12px ${TYPE_CFG[p.type].glow}` : "none",
                transition: "color 0.3s",
                pointerEvents: "none",
              }}>
                {p.label}
              </div>
            </div>
          );
        })}

        {/* Popup */}
        {selected && (
          <div
            className={closing ? "dn-popup-exit" : "dn-popup-enter"}
            style={getPopupStyle(selected)}
          >
            <p style={{
              fontFamily: "'Barlow',sans-serif", fontWeight: 300,
              fontSize: "clamp(10px,1.2vw,12px)", color: "#9aa3b0",
              lineHeight: 1.65, margin: "0 0 12px", textAlign: "center",
            }}>
              {selected.description}
            </p>
            <p style={{
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
              fontSize: "clamp(22px,3vw,32px)", color: "#f0f2f5",
              margin: 0, textAlign: "center", letterSpacing: "-0.01em", lineHeight: 1.1,
            }}>
              <em style={{ fontStyle: "italic", fontSize: "0.68em", color: "#8a96a6", marginRight: 2 }}>
                s/.
              </em>
              {selected.budget}
            </p>
            <p style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: "clamp(8px,1vw,10px)", letterSpacing: "0.15em",
              textTransform: "uppercase", color: "#5a6272",
              textAlign: "center", margin: "3px 0 14px",
            }}>
              Costo del proyecto
            </p>
            <button
              onClick={handleClose}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: "50%",
                background: "#c8cfd8", color: "#2e3440",
                border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                margin: "0 auto", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#c8cfd8")}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Hint */}
      <p style={{
        textAlign: "center",
        fontFamily: "'Barlow Condensed',sans-serif",
        fontSize: "clamp(9px,1.1vw,11px)", letterSpacing: "0.1em",
        textTransform: "uppercase", color: "#8a94a4",
        margin: "-72px 0 0",
        padding: "6px 0 8px",
        opacity: selected ? 0 : 1, transition: "opacity 0.3s",
        userSelect: "none",
      }}>
        Haz clic en un nodo para explorar el proyecto
      </p>

      {/* ── Desktop legend (bottom pill) ── */}
      {!isMobile && <Legend inline={false} />}
    </div>
  );
};

export default ProyectosBajoLaLupaSection;
