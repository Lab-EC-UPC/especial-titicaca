import { useState, useRef } from "react";

/*
  HERRAMIENTA DE COORDENADAS — CoordFinder
  
  USO:
  1. Pon temporalmente <CoordFinder /> en tu App.tsx
  2. Haz click sobre el lago donde quieres cada punto
  3. Copia las coordenadas que aparecen
  4. Pégalas en NAV_POINTS en StickyMenu.tsx
  5. Quita <CoordFinder /> del App.tsx cuando termines
*/

const LAKE_IMAGE_URL = "/titicaca.png";
const MAP_W = 280;
const MAP_H = 200;

const SECTION_NAMES = [
  "01 Inicio", "02 Juliaca", "03 FloraFauna", "04 Capachica",
  "05 Denuncias", "06 Footer",
];

export function CoordFinder() {
  const [points, setPoints]     = useState<{ x: number; y: number }[]>([]);
  const [current, setCurrent]   = useState(0);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const imgRef                  = useRef<HTMLDivElement>(null);

  const getCoords = (e: React.MouseEvent) => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width)  * MAP_W);
    const y = Math.round(((e.clientY - rect.top)  / rect.height) * MAP_H);
    return { x, y };
  };

  const handleClick = (e: React.MouseEvent) => {
    const c = getCoords(e);
    if (!c) return;
    if (current < SECTION_NAMES.length) {
      setPoints(prev => [...prev, c]);
      setCurrent(prev => prev + 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setHoverPos(getCoords(e));
  };

  const reset = () => { setPoints([]); setCurrent(0); };

  const code = points.map((p, i) =>
    `  { x: ${String(p.x).padStart(3)}, y: ${String(p.y).padStart(3)} }, // ${SECTION_NAMES[i]}`
  ).join("\n");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(4,12,24,0.97)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "monospace", gap: "16px", padding: "20px",
    }}>
      <div style={{ color: "#E0B040", fontSize: "18px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Buscador de Coordenadas
      </div>

      {/* Instrucción actual */}
      <div style={{
        background: "rgba(26,85,128,0.5)",
        border: "1px solid #3E9AC4",
        borderRadius: "8px", padding: "8px 20px",
        color: "#EEF6FB", fontSize: "13px",
      }}>
        {current < SECTION_NAMES.length
          ? `Haz click donde va: ${SECTION_NAMES[current]}`
          : "¡Listo! Copia el código abajo"}
      </div>

      {/* Imagen con overlay */}
      <div
        ref={imgRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverPos(null)}
        style={{
          position: "relative",
          width: MAP_W, height: MAP_H,
          cursor: current < SECTION_NAMES.length ? "crosshair" : "default",
          border: "2px solid #3E9AC4",
          borderRadius: "8px", overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img src={LAKE_IMAGE_URL} alt="Titicaca"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>

        {/* Puntos ya colocados */}
        <svg style={{ position:"absolute", inset:0, overflow:"visible" }}
          width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="7"
                fill="#FFD060" opacity="0.9"/>
              <circle cx={p.x} cy={p.y} r="3"
                fill="#040F1A"/>
              <text x={p.x} y={p.y - 10}
                fontSize="9" fill="#FFD060"
                textAnchor="middle" fontFamily="monospace">
                {SECTION_NAMES[i].split(" ")[0]}
              </text>
            </g>
          ))}

          {/* Crosshair en hover */}
          {hoverPos && current < SECTION_NAMES.length && (
            <g opacity="0.6">
              <line x1={hoverPos.x} y1="0" x2={hoverPos.x} y2={MAP_H}
                stroke="#FFD060" strokeWidth="0.5" strokeDasharray="4 4"/>
              <line x1="0" y1={hoverPos.y} x2={MAP_W} y2={hoverPos.y}
                stroke="#FFD060" strokeWidth="0.5" strokeDasharray="4 4"/>
              <circle cx={hoverPos.x} cy={hoverPos.y} r="4"
                fill="#FFD060" opacity="0.8"/>
              <rect x={hoverPos.x + 6} y={hoverPos.y - 16}
                width="52" height="14" rx="3"
                fill="rgba(4,12,24,0.9)"/>
              <text x={hoverPos.x + 32} y={hoverPos.y - 6}
                fontSize="8" fill="#EEF6FB" textAnchor="middle"
                fontFamily="monospace">
                {hoverPos.x}, {hoverPos.y}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Posición actual */}
      {hoverPos && (
        <div style={{ color: "#A8D4EE", fontSize: "11px" }}>
          Posición actual: x={hoverPos.x}, y={hoverPos.y}
        </div>
      )}

      {/* Progreso */}
      <div style={{ display:"flex", gap:"6px" }}>
        {SECTION_NAMES.map((_, i) => (
          <div key={i} style={{
            width:"10px", height:"10px", borderRadius:"50%",
            background: i < points.length ? "#FFD060" : i === current ? "#3E9AC4" : "rgba(255,255,255,0.15)",
            border: i === current ? "2px solid #6CC0DE" : "none",
            transition: "all 0.2s",
          }}/>
        ))}
      </div>

      {/* Código generado */}
      {points.length > 0 && (
        <div style={{ width:"100%", maxWidth:"500px" }}>
          <div style={{ color:"#A8D4EE", fontSize:"11px", marginBottom:"6px" }}>
            Copia esto en NAV_POINTS dentro de StickyMenu.tsx:
          </div>
          <pre style={{
            background:"rgba(0,0,0,0.5)",
            border:"1px solid #1A5580",
            borderRadius:"8px",
            padding:"12px 16px",
            color:"#6CC0DE",
            fontSize:"11px",
            overflowX:"auto",
            margin:0,
            userSelect:"all",
          }}>
{`const NAV_POINTS = [\n${code}\n];`}
          </pre>
          <button
            onClick={() => navigator.clipboard?.writeText(`const NAV_POINTS = [\n${code}\n];`)}
            style={{
              marginTop:"8px", padding:"6px 18px",
              background:"#1A5580", border:"1px solid #3E9AC4",
              borderRadius:"6px", color:"#EEF6FB",
              fontSize:"11px", cursor:"pointer",
              fontFamily:"monospace",
            }}
          >
           Copiar coordenadas
          </button>
        </div>
      )}

      {/* Botones */}
      <div style={{ display:"flex", gap:"12px" }}>
        {current > 0 && (
          <button onClick={() => { setPoints(p => p.slice(0,-1)); setCurrent(c => c-1); }}
            style={{ padding:"6px 16px", background:"rgba(107,64,32,0.5)",
              border:"1px solid #C49028", borderRadius:"6px",
              color:"#E0B040", fontSize:"11px", cursor:"pointer", fontFamily:"monospace" }}>
            ← Deshacer último
          </button>
        )}
        <button onClick={reset}
          style={{ padding:"6px 16px", background:"rgba(26,85,128,0.3)",
            border:"1px solid #3E9AC4", borderRadius:"6px",
            color:"#A8D4EE", fontSize:"11px", cursor:"pointer", fontFamily:"monospace" }}>
          🔄 Reiniciar
        </button>
        <button onClick={() => document.querySelector<HTMLElement>('[data-coord-finder]')?.remove()}
          style={{ padding:"6px 16px", background:"rgba(6,30,48,0.8)",
            border:"1px solid #6CC0DE", borderRadius:"6px",
            color:"#EEF6FB", fontSize:"11px", cursor:"pointer", fontFamily:"monospace" }}>
          ✕ Cerrar
        </button>
      </div>
    </div>
  );
}