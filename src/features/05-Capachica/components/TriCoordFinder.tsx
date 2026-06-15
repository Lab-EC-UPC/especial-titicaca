import { useState, useRef } from "react";

/*
  HERRAMIENTA TEMPORAL — TriCoordFinder
  ─────────────────────────────────────
  Sirve para encontrar las coordenadas (en el espacio 1920x1080) de los
  marcadores de salud y minería de cada provincia de la TriangulacionSection.

  USO:
  1. Entra a una provincia (vista "province").
  2. Pulsa Ctrl + Shift + C para abrir/cerrar esta herramienta.
  3. Elige el tipo de marcador (arriba a la derecha).
  4. Haz click sobre el mapa donde va cada punto.
  5. Copia el código generado y pégalo en PROVINCE_MARKERS
     (src/features/05-Capachica/data/triangulacionData.ts).

  Como usa el mismo viewBox y preserveAspectRatio que ProvinceView,
  las coordenadas coinciden 1:1 con las del mapa real.

  Para quitar la herramienta del proyecto: borra este archivo y la
  integración en ProvinceView.tsx (estado coordMode + atajo + render).
*/

type Kind =
  | { group: "salud"; tipo: "segura" | "riesgo" | "critica" }
  | { group: "mineria"; tipo: "formal" | "informal" };

interface Point {
  x: number;
  y: number;
  kind: Kind;
}

const KIND_OPTIONS: { label: string; color: string; kind: Kind }[] = [
  { label: "Salud · segura", color: "#F4F4F4", kind: { group: "salud", tipo: "segura" } },
  { label: "Salud · riesgo", color: "#13A383", kind: { group: "salud", tipo: "riesgo" } },
  { label: "Salud · crítica", color: "#C03583", kind: { group: "salud", tipo: "critica" } },
  { label: "Minería · formal", color: "#13A383", kind: { group: "mineria", tipo: "formal" } },
  { label: "Minería · informal", color: "#C03583", kind: { group: "mineria", tipo: "informal" } },
];

interface Props {
  provinceId: string;
  provinceMap: string;
  onClose: () => void;
}

export default function TriCoordFinder({ provinceId, provinceMap, onClose }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [activeKind, setActiveKind] = useState<number>(0);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [pos, setPos] = useState(() => ({ x: window.innerWidth - 340, y: 16 }));
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  const onDragStart = (e: React.PointerEvent) => {
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPos({ x: e.clientX - dragRef.current.dx, y: e.clientY - dragRef.current.dy });
  };
  const onDragEnd = () => {
    dragRef.current = null;
  };

  // Convierte un click (px de pantalla) al espacio del viewBox 1920x1080,
  // descontando el letterboxing del object-contain (igual que ProvinceView).
  const toViewBox = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const scale = Math.min(rect.width / 1920, rect.height / 1080);
    const offX = (rect.width - 1920 * scale) / 2;
    const offY = (rect.height - 1080 * scale) / 2;
    return {
      x: Math.round((clientX - rect.left - offX) / scale),
      y: Math.round((clientY - rect.top - offY) / scale),
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    const c = toViewBox(e.clientX, e.clientY);
    setPoints((prev) => [...prev, { ...c, kind: KIND_OPTIONS[activeKind].kind }]);
  };

  const colorFor = (kind: Kind) =>
    KIND_OPTIONS.find(
      (o) => o.kind.group === kind.group && o.kind.tipo === kind.tipo
    )!.color;

  const salud = points.filter((p) => p.kind.group === "salud");
  const mineria = points.filter((p) => p.kind.group === "mineria");

  const saludCode = salud
    .map((p) => `      { x: ${p.x}, y: ${p.y}, tipo: "${p.kind.tipo}" },`)
    .join("\n");

  const mineriaCode = mineria
    .map(
      (p) =>
        `      { x: ${p.x}, y: ${p.y}, tipo: "${p.kind.tipo}", nombre: "", eessMasCercano: "", distanciaKm: 0, descripcion: "" },`
    )
    .join("\n");

  const fullCode =
    `  "${provinceId}": {\n` +
    `    salud: [\n${saludCode}\n    ],\n` +
    `    mineria: [\n${mineriaCode}\n    ],\n` +
    `  },`;

  return (
    <>
      {/* Mapa (misma geometría que ProvinceView) */}
      <img
        src={provinceMap}
        alt="Mapa provincia"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      <svg
        ref={svgRef}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full z-30"
        style={{ cursor: "crosshair" }}
        onClick={handleClick}
        onMouseMove={(e) => setHover(toViewBox(e.clientX, e.clientY))}
        onMouseLeave={() => setHover(null)}
      >
        {points.map((p, i) =>
          p.kind.group === "salud" ? (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.kind.tipo === "segura" ? 22 : 14}
                fill={colorFor(p.kind)}
                stroke="#000"
                strokeWidth="1.5"
                opacity="0.95"
              />
              <text x={p.x} y={p.y - 26} fontSize="20" fill="#FFD060" textAnchor="middle">
                {i + 1}
              </text>
            </g>
          ) : (
            <g key={i}>
              <polygon
                points={`${p.x},${p.y - 18} ${p.x + 16},${p.y + 14} ${p.x - 16},${p.y + 14}`}
                fill={colorFor(p.kind)}
                stroke="#000"
                strokeWidth="1.5"
              />
              <text x={p.x} y={p.y - 24} fontSize="20" fill="#FFD060" textAnchor="middle">
                {i + 1}
              </text>
            </g>
          )
        )}

        {/* Cruz guía */}
        {hover && (
          <g opacity="0.6" pointerEvents="none">
            <line x1={hover.x} y1="0" x2={hover.x} y2="1080" stroke="#FFD060" strokeWidth="1" strokeDasharray="8 8" />
            <line x1="0" y1={hover.y} x2="1920" y2={hover.y} stroke="#FFD060" strokeWidth="1" strokeDasharray="8 8" />
          </g>
        )}
      </svg>

      {/* Panel de control (arrastrable desde la cabecera) */}
      <div
        className="fixed z-40 w-80 max-h-[92vh] overflow-y-auto rounded-xl bg-black/85 backdrop-blur border border-white/20 text-white font-mono text-xs"
        style={{ left: pos.x, top: pos.y }}
      >
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          className="flex items-center justify-between px-4 py-3 cursor-move select-none border-b border-white/10"
          style={{ touchAction: "none" }}
        >
          <span className="text-[#FFD060] font-bold uppercase tracking-wider">
            ⠿ CoordFinder
          </span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4">{/* contenido */}

        <p className="text-white/50 mb-2">
          Provincia: <span className="text-white">{provinceId}</span>
        </p>
        <p className="text-white/40 mb-3">
          Posición: {hover ? `${hover.x}, ${hover.y}` : "—"}
        </p>

        {/* Selector de tipo */}
        <p className="text-white/50 mb-1">Tipo de marcador:</p>
        <div className="flex flex-col gap-1 mb-3">
          {KIND_OPTIONS.map((o, i) => (
            <button
              key={o.label}
              onClick={() => setActiveKind(i)}
              className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-left"
              style={{
                background: activeKind === i ? "rgba(255,255,255,0.15)" : "transparent",
                border: `1px solid ${activeKind === i ? "#FFD060" : "rgba(255,255,255,0.15)"}`,
              }}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: o.color }}
              />
              {o.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setPoints((p) => p.slice(0, -1))}
            disabled={points.length === 0}
            className="flex-1 px-2 py-1 rounded border border-white/20 hover:bg-white/10 cursor-pointer disabled:opacity-30"
          >
            ← Deshacer
          </button>
          <button
            onClick={() => setPoints([])}
            disabled={points.length === 0}
            className="flex-1 px-2 py-1 rounded border border-white/20 hover:bg-white/10 cursor-pointer disabled:opacity-30"
          >
            Limpiar
          </button>
        </div>

        <p className="text-white/50 mb-1">
          {salud.length} salud · {mineria.length} minería
        </p>

        {points.length > 0 && (
          <>
            <pre className="bg-black/60 border border-white/10 rounded p-2 mt-2 text-[#6CC0DE] text-[10px] whitespace-pre overflow-x-auto select-all">
              {fullCode}
            </pre>
            <button
              onClick={() => navigator.clipboard?.writeText(fullCode)}
              className="mt-2 w-full px-2 py-1.5 rounded bg-[#13A383] hover:opacity-90 cursor-pointer text-black font-bold"
            >
              Copiar código
            </button>
          </>
        )}
        </div>
      </div>
    </>
  );
}
