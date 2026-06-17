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
const GROUP_TEC = "tecnica";
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

// Imagen PNG de cada proyecto (en /public/nodes/)
const NODE_IMG: Record<number, string> = {
  1: "node_1.png", // Plan Maestro
  6: "node_2.png", // Hospital Regional
  7: "node_3.png", // Adecuación de Vertimientos
  2: "node_4.png", // Limpieza Pública
  3: "node_5.png", // Agua y Saneamiento
  5: "node_6.png", // Sistemas de Bombeo (PEBLT)
  4: "node_7.png", // Electrobombas
  8: "node_8.png", // PTAR Titicaca
};

// Project data
const PROJECTS: Project[] = [
  {
    id: 1,
    label: "Plan Maestro",
    type: "transparencia",
    dx: 23,
    dy: 20,
    mx: 29,
    my: 9,
    description:
      "Se enfocó en conservar el ecosistema del Titicaca e impulsar turismo sostenible. Además, el documento no reporta resultados concretos ni detalla limitaciones durante su ejecución efectiva.",
    budget: "6,900,000",
  },
  {
    id: 2,
    label: "Limpieza Pública\nen Ayaviri",
    type: "tecnica",
    dx: 47,
    dy: 29,
    mx: 21,
    my: 33,
    description:
      "Se destinó a modernizar la recolección de residuos mediante maquinaria y equipamiento. Asimismo, se detectaron compras deficientes y fallas en los procesos administrativos.",
    budget: "936,358.60",
  },
  {
    id: 3,
    label: "Agua y Saneamiento\nen Ocuviri",
    type: "transparencia",
    dx: 40,
    dy: 51,
    mx: 64,
    my: 44,
    description:
      "Se propusó instalar captaciones, tuberías y sistemas de tratamiento para zonas rurales. No se aplicaron penalidades pese a retrasos en la ejecución.",
    budget: "1,534,632.25",
  },
  {
    id: 4,
    label: "Electrobombas\nEMSAPUNO",
    type: "administrativa",
    dx: 75,
    dy: 27,
    mx: 24,
    my: 78,
    description:
      "Tuvo como objetivo renovar las electrobombas de la planta de agua potable de Puno. Se otorgaron ampliaciones de plazo injustificadas y no se aplicaron penalidades por retrasos.",
    budget: "1,214,950.00",
  },
  {
    id: 5,
    label: "Sistemas de Bombeo\ny Riego (PEBLT)",
    type: "tecnica",
    dx: 60,
    dy: 61,
    mx: 74,
    my: 67,
    description:
      "Se tenía previsto implementar sistemas de bombeo y riego para fortalecer la agricultura. Además, se detectaron irregularidades, falta de transparencia y contrataciones que incumplían requisitos técnicos.",
    budget: "106,060,807.00",
  },
  {
    id: 6,
    label: "Hospital Regional\nManuel Núñez Butrón",
    type: "tecnica",
    dx: 18,
    dy: 48,
    mx: 73,
    my: 21,
    description:
      "Se buscó construir y equipar un hospital moderno para reducir derivaciones. Además, el proyecto registró paralizaciones, problemas técnicos y cuestionamientos sobre la ubicación del terreno.",
    budget: "No se especifica",
  },
  {
    id: 7,
    label: "Adecuación de Vertimientos\n(Río Cabanillas)",
    type: "tecnica",
    dx: 27,
    dy: 70,
    mx: 33,
    my: 57,
    description:
      "Tuvo como objetivo tratar aguas residuales antes de verterlas al río pero el plan fue abandonado. Se incumplió plazos y careció de seguimiento adecuado.",
    budget: "23,692.20",
  },
  {
    id: 8,
    label: "PTAR Titicaca",
    type: "administrativa",
    dx: 82,
    dy: 72,
    mx: 60,
    my: 89,
    description:
      "Se buscó construir y mejorar plantas de tratamiento de aguas residuales en Puno. El proyecto enfrentó abandono de obras, problemas técnicos y culminó con la resolución del contrato.",
    budget: "863,000,000",
  },
];

const TYPE_CFG: Record<ProjectType, TypeConfig> = {
  tecnica: {
    label: "Deficiencias técnicas",
    color: "#3aacb8",
    glow: "rgba(58,172,184,0.55)",
    gem: ["#14443a", "#226d5b", "#3a9580", "#0e3029", "#2c7b67", "#4fa88e"],
  },
  administrativa: {
    label: "Neglicencia administrativa",
    color: "#3a6e8a",
    glow: "rgba(58,110,138,0.6)",
    gem: ["#1e4555", "#2d6070", "#4a8090", "#163545", "#3a7080", "#5a96a4"],
  },
  transparencia: {
    label: "Falta de transparencia",
    color: "#b05898",
    glow: "rgba(176,88,152,0.65)",
    gem: ["#6a2a58", "#8a3a70", "#ae5890", "#451838", "#9a4880", "#c070b0"],
  },
} as const;

// Imagen de nodo para cada tipo en la leyenda
const LEGEND_IMG: Record<ProjectType, string> = {
  tecnica: "node_3.png",
  administrativa: "node_7.png",
  transparencia: "node_5.png",
};

// Legend
function Legend({ inline }: { inline: boolean }) {
  if (inline) {
    // Mobile: box top, two columns — "LEYENDA" | items
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: 8,
          padding: "12px 16px",
          width: "100%",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          Leyenda
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {(
            ["tecnica", "administrativa", "transparencia"] as ProjectType[]
          ).map((k) => (
            <div
              key={k}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <img
                src={`/nodes/${LEGEND_IMG[k]}`}
                alt=""
                style={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  display: "inline-block",
                  objectFit: "contain",
                }}
              />
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                {TYPE_CFG[k].label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: pill bar bottom
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(14px,3vw,36px)",
        width: "fit-content",
        maxWidth: "96%",
        margin: "16px auto 28px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 14,
        padding: "3px 96px",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(9px,1.1vw,11px)",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#ffffff",
        }}
      >
        Leyenda
      </h2>
      {(["tecnica", "administrativa", "transparencia"] as ProjectType[]).map(
        (k) => (
          <h2
            key={k}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: "clamp(9px,1.2vw,12px)",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            <img
              src={`/nodes/${LEGEND_IMG[k]}`}
              alt=""
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                display: "inline-block",
                objectFit: "contain",
              }}
            />
            {TYPE_CFG[k].label}
          </h2>
        ),
      )}
    </div>
  );
}

// Section component
export const ProyectosBajoLaLupaSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [closing, setClosing] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 700, h: 420 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.offsetWidth || 700;
      const mobile = w < 600;
      setIsMobile(mobile);
      setDims({
        w,
        h: mobile ? Math.max(w * 2.0, 680) : Math.max(w * 0.56, 420),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const nodeSize = Math.max(
    72,
    Math.min(150, dims.w * (isMobile ? 0.2 : 0.175)),
  );

  const getPos = useCallback(
    (p: Project) => ({
      x: ((isMobile ? p.mx : p.dx) / 100) * dims.w,
      y: ((isMobile ? p.my : p.dy) / 100) * dims.h,
    }),
    [dims, isMobile],
  );

  // Nodes mismo grupo
  const selectedGroup = selected ? NODE_GROUP[selected.id] : null;
  const groupMemberIds: number[] = selectedGroup
    ? PROJECTS.filter((p) => NODE_GROUP[p.id] === selectedGroup).map(
        (p) => p.id,
      )
    : [];

  const handleClick = (p: Project) => {
    if (closing) return;
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
    }, 260);
  };

  // Popup positioning
  const getPopupStyle = (p: Project): React.CSSProperties => {
    const pos = getPos(p);

    const base: React.CSSProperties = {
      position: "absolute",
      background: "rgba(30,36,48,0.94)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "16px 16px 14px",
      zIndex: 40,
      boxShadow: `0 10px 50px rgba(0,0,0,0.6), 0 0 24px ${TYPE_CFG[p.type].glow}`,
    };

    // Mobile: centered overlay card — siempre visible, nunca recortada
    if (isMobile) {
      const pw = Math.min(320, dims.w - 24);
      const ph = 300; // estimación para acotar; maxHeight evita desborde real
      const left = (dims.w - pw) / 2;
      let top = pos.y - ph * 0.5;
      if (top < 12) top = 12;
      if (top + ph > dims.h - 12) top = dims.h - ph - 12;
      return {
        ...base,
        left,
        top,
        width: pw,
        maxHeight: dims.h - 24,
        overflowY: "auto",
      };
    }

    // Desktop: card al lado del nodo, acotada al canvas
    const pw = Math.max(180, Math.min(260, dims.w * 0.29));
    const ph = 210;
    let left = pos.x - pw - nodeSize * 0.7;
    let top = pos.y - ph * 0.55;
    if (left < 8) left = pos.x + nodeSize * 0.7;
    if (left + pw > dims.w - 8) left = pos.x - pw - nodeSize * 0.7;
    if (top < 8) top = 8;
    if (top + ph > dims.h - 8) top = dims.h - ph - 8;
    return { ...base, left, top, width: pw };
  };

  return (
    <div
      id="proyectos-lupa"
      ref={wrapRef}
      style={{
        background: "#2e3440",
        position: "relative",
        overflow: "hidden",
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
      <h2
        style={{
          textAlign: "center",
          padding: "28px 16px 12px",
          letterSpacing: "0.18em",
          fontSize: "clamp(14px,2.5vw,22px)",
          fontWeight: 700,
          color: "#c8cfd8",
          textTransform: "uppercase",
        }}
      >
        Proyectos bajo la lupa
      </h2>

      {/* ── Mobile legend── */}
      {isMobile && (
        <h5 style={{ padding: "0 12px 10px" }}>
          <Legend inline={true} />
        </h5>
      )}

      {/* ── Network canvas ── */}
      <div
        ref={canvasRef}
        style={{ position: "relative", width: "100%", height: dims.h }}
      >
        {/* SVG lines */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
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
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={
                  isActive
                    ? TYPE_CFG[selected!.type].color
                    : "rgba(178,188,202,0.7)"
                }
                strokeWidth={isActive ? 6.5 : 5.5}
                filter={isActive ? "url(#dn-glow-line)" : undefined}
                opacity={isDimmed ? 0.06 : group === GROUP_CROSS ? 0.32 : 0.45}
                style={{
                  transition: "stroke 0.3s, opacity 0.3s, stroke-width 0.3s",
                }}
              />
            );
          })}

          {/* Pulse rings */}
          {selected &&
            (() => {
              const pos = getPos(selected);
              const col = TYPE_CFG[selected.type].color;
              const pr = nodeSize * 0.52;
              return (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={pr}
                    fill="none"
                    stroke={col}
                    strokeWidth="1.5"
                    className="dn-pulse"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={pr}
                    fill="none"
                    stroke={col}
                    strokeWidth="1"
                    className="dn-pulse2"
                  />
                </>
              );
            })()}
        </svg>

        {/* Nodes */}
        {PROJECTS.map((p) => {
          const pos = getPos(p);
          const isSel = selected?.id === p.id;
          const isInGroup = groupMemberIds.includes(p.id);
          const isDim = selected !== null && !isInGroup;
          const scale = isSel ? 1.6 : isInGroup ? 1.12 : 1;
          const labelColor = isSel
            ? TYPE_CFG[p.type].color
            : isInGroup
              ? "#ffffff"
              : "#ffffff";

          return (
            <div
              key={p.id}
              className="dn-node"
              style={{
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%,-50%)",
                zIndex: isSel ? 20 : isInGroup ? 15 : 10,
                opacity: isDim ? 0.2 : 1,
                transition: "opacity 0.3s",
              }}
              onClick={() => handleClick(p)}
            >
              <div className="dn-wrap" style={{ transform: `scale(${scale})` }}>
                <img
                  src={`/nodes/${NODE_IMG[p.id]}`}
                  alt={p.label}
                  width={nodeSize}
                  height={nodeSize}
                  draggable={false}
                  style={{
                    display: "block",
                    filter: isSel
                      ? `drop-shadow(0 0 16px ${TYPE_CFG[p.type].glow}) drop-shadow(0 0 8px ${TYPE_CFG[p.type].color})`
                      : `drop-shadow(0 0 7px ${TYPE_CFG[p.type].glow})`,
                    transition: "filter 0.3s",
                  }}
                />
              </div>
              <h3
                style={{
                  position: "absolute",
                  top: nodeSize * 0.72,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  lineHeight: 1.25,
                  width: "max-content",
                  maxWidth: isMobile ? 130 : 180,
                  fontSize: isMobile
                    ? "clamp(9px,3vw,12px)"
                    : `clamp(10px,${dims.w * 0.014}px,14px)`,
                  fontWeight: isSel ? 700 : 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: labelColor,
                  textShadow: isSel
                    ? `0 0 12px ${TYPE_CFG[p.type].glow}`
                    : "none",
                  transition: "color 0.3s",
                  pointerEvents: "none",
                }}
              >
                {p.label}
              </h3>
            </div>
          );
        })}

        {/* Popup */}
        {selected && (
          <div
            className={closing ? "dn-popup-exit" : "dn-popup-enter"}
            style={getPopupStyle(selected)}
          >
            <p
              style={{
                fontWeight: 300,
                fontSize: "clamp(10px,1.2vw,12px)",
                color: "#9aa3b0",
                margin: "0 0 12px",
                textAlign: "center",
              }}
            >
              {selected.description}
            </p>
            <h4
              style={{
                fontWeight: 700,
                fontSize: "clamp(20px,3vw,25px)",
                color: "#f0f2f5",
                margin: 0,
                textAlign: "center",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              <em
                style={{
                  fontSize: "0.60em",
                  color: "#8a96a6",
                  marginRight: 2,
                }}
              >
                s/.
              </em>
              {selected.budget}
            </h4>
            <h5
              style={{
                fontSize: "clamp(8px,1vw,10px)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#5a6272",
                textAlign: "center",
                margin: "3px 0 14px",
              }}
            >
              Costo del proyecto
            </h5>
            <button
              onClick={handleClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#c8cfd8",
                color: "#2e3440",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                margin: "0 auto",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ffffff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#c8cfd8")
              }
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Hint */}
      <p
        style={{
          textAlign: "center",
          fontSize: "clamp(9px,1.1vw,11px)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8a94a4",
          margin: isMobile ? "16px 0 0" : "-72px 0 0",
          padding: "6px 0 8px",
          opacity: selected ? 0 : 1,
          transition: "opacity 0.3s",
          userSelect: "none",
        }}
      >
        Haz clic en un nodo para explorar el proyecto
      </p>

      {/* ── Desktop legend (bottom pill) ── */}
      {!isMobile && <Legend inline={false} />}
    </div>
  );
};

export default ProyectosBajoLaLupaSection;
