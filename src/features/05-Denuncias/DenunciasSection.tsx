import { useState, useRef, useEffect, useCallback } from "react";

//Types
type ProjectType = "tecnica" | "administrativa" | "transparencia";

interface Project {
  id: number;
  label: string;
  type: ProjectType;
  img: string;        // /public/nodes/{img}
  dx: number; dy: number; // desktop % of canvas
  mx: number; my: number; // mobile  % of canvas
  description: string;
  budget: string;
}

//Group constants
const G_PURPLE = "purple"; // P1 ↔ P5
const G_TEAL   = "teal";   // P2, P3, P6
const G_BLUE   = "blue";   // P4, P7, P8
const G_CROSS  = "cross";  // siempre


const GROUP_COLOR: Record<string, string> = {
  [G_PURPLE]: "#b05898",
  [G_TEAL]:   "#3aacb8",
  [G_BLUE]:   "#3a6e8a",
};
const GROUP_GLOW: Record<string, string> = {
  [G_PURPLE]: "rgba(176,88,152,0.72)",
  [G_TEAL]:   "rgba(58,172,184,0.72)",
  [G_BLUE]:   "rgba(58,110,138,0.72)",
};

interface Conn { a: number; b: number; g: string; }


const CONNECTIONS: Conn[] = [
  { a: 1, b: 5, g: G_PURPLE },
  { a: 2, b: 3, g: G_TEAL },
  { a: 3, b: 6, g: G_TEAL },
  { a: 2, b: 6, g: G_TEAL },
  { a: 4, b: 7, g: G_BLUE },
  { a: 7, b: 8, g: G_BLUE },
  { a: 4, b: 8, g: G_BLUE },
  { a: 1, b: 2, g: G_CROSS },
  { a: 1, b: 4, g: G_CROSS },
  { a: 2, b: 5, g: G_CROSS },
  { a: 3, b: 5, g: G_CROSS },
  { a: 4, b: 5, g: G_CROSS },
  { a: 5, b: 6, g: G_CROSS },
  { a: 5, b: 7, g: G_CROSS },
  { a: 5, b: 8, g: G_CROSS },
  { a: 6, b: 8, g: G_CROSS },
];

const NODE_GROUP: Record<number, string> = {
  1: G_PURPLE, 5: G_PURPLE,
  2: G_TEAL,   3: G_TEAL,   6: G_TEAL,
  4: G_BLUE,   7: G_BLUE,   8: G_BLUE,
};

const PROJECTS: Project[] = [
  {
    id: 1, label: "Plan Maestro", type: "transparencia", img: "node_1.png",
    dx: 15, dy: 56,
    mx: 18, my: 12,
    description: "Se enfocó en conservar el ecosistema del Titicaca e impulsar turismo sostenible. Además, el documento no reporta resultados concretos ni detalla limitaciones durante su ejecución efectiva.",
    budget: "6,900,000",
  },
  {
    id: 2, label: "Hospital Regional\nManuel Núñez Butrón", type: "tecnica", img: "node_2.png",
    dx: 31, dy: 76,
    mx: 18, my: 34,
    description: "Equipamiento hospitalario adquirido a precio inflado. Parte del lote nunca fue entregado ni instalado correctamente en las áreas designadas.",
    budget: "12,400,000",
  },
  {
    id: 3, label: "Adecuación de Vertimientos\n(Río Cabanillas)", type: "tecnica", img: "node_3.png",
    dx: 50, dy: 76,
    mx: 26, my: 57,
    description: "Obra de tratamiento de aguas residuales con deficiencias técnicas graves. Sin estudios de impacto ambiental actualizados al momento de la ejecución.",
    budget: "8,200,000",
  },
  {
    id: 4, label: "Agua y Saneamiento\nen Ocuviri", type: "administrativa", img: "node_4.png",
    dx: 43, dy: 13,
    mx: 68, my: 12,
    description: "Sistema de agua potable rural con expediente técnico incompleto. No se realizaron rendiciones de cuenta ni informes de avance a la comunidad.",
    budget: "5,300,000",
  },
  {
    id: 5, label: "Limpieza Pública\nen Ayaviri", type: "transparencia", img: "node_5.png",
    dx: 49, dy: 42,
    mx: 66, my: 34,
    description: "Servicio de residuos sólidos con contratos irregulares. Solo se ejecutó el 40% de las rutas de recolección planificadas según el cronograma.",
    budget: "3,750,000",
  },
  {
    id: 6, label: "Sistemas de Bombeo\ny Riego (PEBLT)", type: "tecnica", img: "node_6.png",
    dx: 67, dy: 76,
    mx: 72, my: 57,
    description: "Infraestructura de riego con fallas en la instalación de bombas. El sistema operó al 30% de capacidad durante el primer año de funcionamiento.",
    budget: "9,800,000",
  },
  {
    id: 7, label: "Electrobombas\nEMSAPUNO", type: "administrativa", img: "node_7.png",
    dx: 80, dy: 22,
    mx: 18, my: 80,
    description: "Adquisición de electrobombas con sobreprecios documentados. Los equipos instalados no correspondían a las especificaciones técnicas del contrato original.",
    budget: "4,600,000",
  },
  {
    id: 8, label: "PTAR Titicaca", type: "administrativa", img: "node_8.png",
    dx: 86, dy: 65,
    mx: 64, my: 88,
    description: "Planta de tratamiento de aguas residuales con ejecución deficiente. La obra fue entregada sin pruebas de funcionamiento ni capacitación al personal operativo.",
    budget: "11,200,000",
  },
];

//Type display
const TYPE_CFG: Record<ProjectType, { label: string; color: string }> = {
  tecnica:        { label: "Deficiencias técnicas",     color: "#3aacb8" },
  administrativa: { label: "Neglicencia administrativa", color: "#3a6e8a" },
  transparencia:  { label: "Falta de transparencia",    color: "#b05898" },
};

//NodeLabel
function NodeLabel({
  text, color, glow, active, size,
}: {
  text: string; color: string; glow: string; active: boolean; size: number;
}) {
  const lines = text.split("\n");
  return (
    <div style={{
      textAlign:     "center",
      pointerEvents: "none",
      lineHeight:    1.25,
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
          fontSize:      size,
          fontWeight:    active ? 700 : 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color,
          textShadow:    active ? `0 0 14px ${glow}` : "none",
          transition:    "color 0.3s, text-shadow 0.3s",
          whiteSpace:    "nowrap",
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}

//Legend
function Legend({ mobile }: { mobile: boolean }) {
  const items = (Object.entries(TYPE_CFG) as [ProjectType, { label: string; color: string }][]).map(
    ([k, v]) => (
      <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 16, height: 16, borderRadius: 3, flexShrink: 0,
          background: v.color, display: "inline-block",
        }} />
        <span style={{
          fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
          fontSize:      mobile ? 11 : "clamp(9px,1.15vw,12px)",
          fontWeight:    600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "#9aa3b0",
        }}>
          {v.label}
        </span>
      </div>
    )
  );

  if (mobile) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: 9,
        background: "rgba(15,18,26,0.65)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "11px 16px",
      }}>
        <span style={{
          fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
          fontSize:      10, fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color:         "#5a6272",
        }}>
          Leyenda
        </span>
        {items}
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center",
      justifyContent: "center", gap: "clamp(10px,2.2vw,26px)",
      margin: "0 clamp(16px,5%,80px) 28px",
      background: "rgba(15,18,26,0.55)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 40, padding: "11px 32px",
    }}>
      <span style={{
        fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
        fontSize:      "clamp(9px,1.1vw,11px)",
        fontWeight:    700, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "#5a6272",
      }}>
        Leyenda
      </span>
      {items}
    </div>
  );
}

//Main Section
export const DenunciasSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [closing,  setClosing]  = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims]         = useState({ w: 800, h: 460 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.offsetWidth || 800;
      const mob = w < 600;
      setIsMobile(mob);
      setDims({ w, h: mob ? Math.max(w * 1.62, 480) : Math.max(w * 0.56, 340) });
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Node image size — proportional to container
  const nodeSize  = Math.max(36, Math.min(72, dims.w * (isMobile ? 0.115 : 0.078)));
  const labelSize = Math.max(9,  Math.min(13, dims.w * 0.013));

  const getPos = useCallback(
    (p: Project) => ({
      x: ((isMobile ? p.mx : p.dx) / 100) * dims.w,
      y: ((isMobile ? p.my : p.dy) / 100) * dims.h,
    }),
    [dims, isMobile]
  );

  const selectedGroup  = selected ? NODE_GROUP[selected.id] : null;
  const groupMemberIds = selectedGroup
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

  
  const getPopupPos = (p: Project) => {
    const pp       = getPos(p);
    const pw       = Math.max(170, Math.min(230, dims.w * (isMobile ? 0.62 : 0.23)));
    const ph       = 175; 
    const btnH     = 40;  
    const nodeHalf = nodeSize / 2;

    
    let left = pp.x - pw / 2;
    
    let top  = pp.y - nodeHalf - ph - 4;

    
    if (left < 4)               left = 4;
    if (left + pw > dims.w - 4) left = dims.w - pw - 4;

    
    if (top < 4) top = pp.y + nodeHalf + 4;

    return { left, top, pw };
  };

  return (
    <div
      id="denuncias"
      ref={wrapRef}
      style={{
        background: "#2e3440",
        position:   "relative",
        fontFamily: "'Citizen OT', 'Barlow Condensed', sans-serif",
      }}
    >
      {/*
        FONT SETUP
        These fonts are self-hosted. Add to your global CSS (index.css):

        @font-face {
          font-family: 'Citizen OT';
          src: url('/fonts/CitizenOT-Regular.woff2') format('woff2');
          font-weight: 400; font-display: swap;
        }
        @font-face {
          font-family: 'Citizen OT';
          src: url('/fonts/CitizenOT-Bold.woff2') format('woff2');
          font-weight: 700; font-display: swap;
        }
        @font-face {
          font-family: 'Elza';
          src: url('/fonts/Elza-Regular.woff2') format('woff2');
          font-weight: 400; font-display: swap;
        }
        Place .woff2 files in /public/fonts/

        PNG nodes: place in /public/nodes/
          node_1.png … node_8.png
        
      */}

      {/*Scoped styles*/}
      <style>{`
        #denuncias .dn-node {
          cursor: pointer;
          position: absolute;
        }
        #denuncias .dn-img-wrap {
          transition: transform 0.4s cubic-bezier(0.34,1.5,0.64,1);
          transform-origin: center center;
        }
        #denuncias .dn-node:hover .dn-img-wrap {
          filter: brightness(1.15) saturate(1.15);
        }
        #denuncias .dn-popup-box {
          position: absolute;
          z-index: 40;
        }
        #denuncias .dn-popup-enter .dn-popup-inner {
          animation: dnPopIn 0.36s cubic-bezier(0.34,1.26,0.64,1) forwards;
        }
        #denuncias .dn-popup-exit .dn-popup-inner {
          animation: dnPopOut 0.24s ease-in forwards;
        }
        #denuncias .dn-popup-enter .dn-close-btn {
          animation: dnPopIn 0.36s cubic-bezier(0.34,1.26,0.64,1) forwards;
        }
        #denuncias .dn-popup-exit .dn-close-btn {
          animation: dnPopOut 0.24s ease-in forwards;
        }
        @keyframes dnPopIn {
          from { opacity:0; transform:scale(0.88) translateY(10px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        @keyframes dnPopOut {
          from { opacity:1; transform:scale(1)    translateY(0);    }
          to   { opacity:0; transform:scale(0.88) translateY(10px); }
        }
        #denuncias .dn-pulse  { animation: dnPulse 2.3s ease-out infinite; }
        #denuncias .dn-pulse2 { animation: dnPulse 2.3s ease-out 1.1s infinite; }
        @keyframes dnPulse {
          0%   { opacity: 0.55; }
          100% { r: 58; opacity: 0; }
        }
        #denuncias .dn-close-btn {
          display:         flex;
          align-items:     center;
          justify-content: center;
          width:           32px;
          height:          32px;
          border-radius:   50%;
          background:      #c8cfd8;
          color:           #1a2030;
          border:          none;
          cursor:          pointer;
          font-size:       13px;
          font-weight:     700;
          transition:      background 0.2s, transform 0.15s;
          flex-shrink:     0;
        }
        #denuncias .dn-close-btn:hover {
          background: #ffffff;
          transform:  scale(1.08);
        }
      `}</style>

      {/*Title*/}
      <div style={{
        textAlign:     "center",
        padding:       "28px 16px 14px",
        letterSpacing: "0.18em",
        fontSize:      "clamp(15px, 2.4vw, 22px)",
        fontWeight:    700,
        color:         "#c8cfd8",
        textTransform: "uppercase",
        fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
      }}>
        Denuncias de Proyectos
      </div>

      {/*Mobile legend*/}
      {isMobile && (
        <div style={{ display: "flex", justifyContent: "center", padding: "0 16px 14px" }}>
          <Legend mobile />
        </div>
      )}

      {/*Network canvas*/}
      <div style={{ position: "relative", width: "100%", height: dims.h, overflow: "visible" }}>

        {/*SVG lines*/}
        <svg style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          overflow: "visible", pointerEvents: "none",
        }}>
          <defs>
            <filter id="dn-glow-line">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {CONNECTIONS.map(({ a: aId, b: bId, g: group }) => {
            const a  = PROJECTS.find((p) => p.id === aId)!;
            const b  = PROJECTS.find((p) => p.id === bId)!;
            const pa = getPos(a);
            const pb = getPos(b);

            const isActive = selected !== null && group !== G_CROSS && group === selectedGroup;
            const isDimmed = selected !== null && !isActive;
            const isCross  = group === G_CROSS;

            return (
              <line
                key={`${aId}-${bId}`}
                x1={pa.x} y1={pa.y}
                x2={pb.x} y2={pb.y}
                stroke={isActive ? GROUP_COLOR[group] : "rgba(155,168,185,0.28)"}
                strokeWidth={isActive ? 2.4 : 1.4}
                filter={isActive ? "url(#dn-glow-line)" : undefined}
                opacity={isDimmed ? 0.05 : isActive ? 0.95 : isCross ? 0.20 : 0.36}
                style={{ transition: "stroke 0.3s, opacity 0.3s, stroke-width 0.3s" }}
              />
            );
          })}

          {/*Pulsar Nodo*/}
          {selected && (() => {
            const pp  = getPos(selected);
            const col = GROUP_COLOR[NODE_GROUP[selected.id]];
            const pr  = nodeSize * 0.54;
            return (
              <>
                <circle cx={pp.x} cy={pp.y} r={pr}
                  fill="none" stroke={col} strokeWidth="1.5" className="dn-pulse" />
                <circle cx={pp.x} cy={pp.y} r={pr}
                  fill="none" stroke={col} strokeWidth="1" className="dn-pulse2" />
              </>
            );
          })()}
        </svg>

        {/*Nodes*/}
        {PROJECTS.map((p) => {
          const pp        = getPos(p);
          const isSel     = selected?.id === p.id;
          const isInGroup = groupMemberIds.includes(p.id);
          const isDim     = selected !== null && !isInGroup;
          const scale     = isSel ? 1.55 : isInGroup ? 1.1 : 1;

          const labelColor = isSel
            ? GROUP_COLOR[NODE_GROUP[p.id]]
            : isInGroup ? "#d0d8e4"
            : "#6b7585";

          const imgFilter = isSel
            ? `drop-shadow(0 0 14px ${GROUP_COLOR[NODE_GROUP[p.id]]}) drop-shadow(0 0 6px ${GROUP_GLOW[NODE_GROUP[p.id]]})`
            : isInGroup
            ? `drop-shadow(0 0 8px ${GROUP_GLOW[NODE_GROUP[p.id]]})`
            : "none";

          return (
            <div
              key={p.id}
              className="dn-node"
              style={{
                left:       pp.x,
                top:        pp.y,
                transform:  "translate(-50%,-50%)",
                zIndex:     isSel ? 20 : isInGroup ? 15 : 10,
                opacity:    isDim ? 0.18 : 1,
                transition: "opacity 0.3s",
              }}
              onClick={() => handleClick(p)}
            >
              {/*PNG image*/}
              <div
                className="dn-img-wrap"
                style={{ transform: `scale(${scale})` }}
              >
                <img
                  src={`/nodes/${p.img}`}
                  alt={p.label.replace("\n", " ")}
                  width={nodeSize}
                  height={nodeSize}
                  draggable={false}
                  style={{
                    display:    "block",
                    objectFit:  "contain",
                    filter:     imgFilter,
                    transition: "filter 0.35s",
                    userSelect: "none",
                  }}
                  onError={(e) => {
                    // Fallback
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const fb = el.nextElementSibling as HTMLElement | null;
                    if (fb) fb.style.display = "block";
                  }}
                />
                {/*Fallback*/}
                <div style={{
                  display:      "none",
                  width:        nodeSize,
                  height:       nodeSize,
                  borderRadius: "35% 45% 38% 42%",
                  background:   TYPE_CFG[p.type].color,
                  opacity:      0.75,
                  filter:       imgFilter,
                  transition:   "filter 0.35s",
                }} />
              </div>

              {/*Label*/}
              <div style={{
                position:  "absolute",
                top:       nodeSize + 6,
                left:      "50%",
                transform: "translateX(-50%)",
              }}>
                <NodeLabel
                  text={p.label}
                  color={labelColor}
                  glow={GROUP_GLOW[NODE_GROUP[p.id]]}
                  active={isSel}
                  size={labelSize}
                />
              </div>
            </div>
          );
        })}

      {/*Popup*/}
        {selected && (() => {
          const { left, top, pw } = getPopupPos(selected);
          const grpGlow = GROUP_GLOW[NODE_GROUP[selected.id]];
          return (
            <div
              className={`dn-popup-box ${closing ? "dn-popup-exit" : "dn-popup-enter"}`}
              style={{ position: "absolute", left, top, width: pw, zIndex: 50 }}
            >
              <div
                className="dn-popup-inner"
                style={{
                  background:           "rgba(30,38,52,0.94)",
                  backdropFilter:       "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  border:               "1px solid rgba(255,255,255,0.10)",
                  borderRadius:         10,
                  padding:              "14px 14px 12px",
                  boxShadow:            `0 12px 40px rgba(0,0,0,0.65), 0 0 22px ${grpGlow}`,
                }}
              >
                <p style={{
                  fontFamily: "'Elza', Georgia, serif",
                  fontWeight: 400,
                  fontSize:   "clamp(10px, 1.1vw, 12px)",
                  color:      "#b0bac6",
                  lineHeight: 1.6,
                  margin:     "0 0 10px",
                  textAlign:  "center",
                }}>
                  {selected.description}
                </p>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 0 8px" }} />
                <p style={{
                  fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
                  fontWeight:    700,
                  fontSize:      "clamp(17px, 2.2vw, 24px)",
                  color:         "#eef0f4",
                  margin:        0,
                  textAlign:     "center",
                  letterSpacing: "-0.01em",
                  lineHeight:    1.1,
                }}>
                  <em style={{ fontStyle:"italic", fontSize:"0.62em", color:"#6a7688", marginRight:2 }}>s/.</em>
                  {selected.budget}
                </p>
                <p style={{
                  fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
                  fontSize:      "clamp(7px, 0.75vw, 9px)",
                  letterSpacing: "0.17em",
                  textTransform: "uppercase",
                  color:         "#465060",
                  textAlign:     "center",
                  margin:        "3px 0 0",
                }}>
                  Costo del proyecto
                </p>
              </div>
              <div style={{ display:"flex", justifyContent:"center", marginTop:7 }}>
                <button
                  className="dn-close-btn"
                  onClick={(e) => { e.stopPropagation(); handleClose(); }}
                >✕</button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Hint */}
      <p style={{
        textAlign:     "center",
        fontFamily:    "'Citizen OT', 'Barlow Condensed', sans-serif",
        fontSize:      "clamp(9px, 1vw, 11px)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color:         "#3d4555",
        padding:       "6px 0 8px",
        opacity:       selected ? 0 : 1,
        transition:    "opacity 0.3s",
        userSelect:    "none",
      }}>
        Haz clic en un nodo para explorar el proyecto
      </p>

      {/* ── Desktop legend — pill at bottom ── */}
      {!isMobile && <Legend mobile={false} />}
    </div>
  );
};

export default DenunciasSection;