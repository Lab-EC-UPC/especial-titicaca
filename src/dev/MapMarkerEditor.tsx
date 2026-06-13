import { useState, useRef, useEffect } from "react";
import {
  PROVINCE_MARKERS,
  type SaludMarker,
  type MineriaMarker,
} from "../features/04-Capachica/data/triangulacionData";

import mapaCarabaya      from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-carabaya.png";
import mapaElCollao      from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-collao.png";
import mapaPuno          from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-puno.png";
import mapaChucuito      from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-chucuito.png";
import mapaYunguyo       from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-yunguyo.png";
import mapaSanRoman      from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sanroman.png";
import mapaLampa         from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-lampa.png";
import mapaHuancane      from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-huancane.png";
import mapaMoho          from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-moho.png";
import mapaAzangaro      from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-azarango.png";
import mapaSanAntonio    from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sanantonio.png";
import mapaSandia        from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sandia.png";
import mapaMelgar        from "../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-melgar.png";

type ESaludMarker  = SaludMarker  & { id: number };
type EMineriaMarker = MineriaMarker & { id: number };
type TabMode = "salud" | "mineria";
type SaludTipo = "segura" | "riesgo" | "critica";
type MineriaTipo = "formal" | "informal";

const PROVINCE_MAP_IMAGES: Record<string, string> = {
  carabaya:               mapaCarabaya,
  "el-collao":            mapaElCollao,
  puno:                   mapaPuno,
  chucuito:               mapaChucuito,
  yunguyo:                mapaYunguyo,
  "san-roman":            mapaSanRoman,
  lampa:                  mapaLampa,
  huancane:               mapaHuancane,
  moho:                   mapaMoho,
  azangaro:               mapaAzangaro,
  "san-antonio-de-putina": mapaSanAntonio,
  sandia:                 mapaSandia,
  melgar:                 mapaMelgar,
};

const PROVINCE_LABELS: Record<string, string> = {
  carabaya:               "Carabaya",
  "el-collao":            "El Collao",
  puno:                   "Puno",
  chucuito:               "Chucuito",
  yunguyo:                "Yunguyo",
  "san-roman":            "San Román",
  lampa:                  "Lampa",
  huancane:               "Huancané",
  moho:                   "Moho",
  azangaro:               "Azángaro",
  "san-antonio-de-putina": "San Antonio de Putina",
  sandia:                 "Sandia",
  melgar:                 "Melgar",
};

const TIPO_COLORS: Record<string, string> = {
  segura:   "#F4F4F4",
  riesgo:   "#13A383",
  critica:  "#C03583",
  formal:   "#13A383",
  informal: "#C03583",
};

let _uid = 0;
const nextId = () => ++_uid;

interface Props { onClose: () => void }

export function MapMarkerEditor({ onClose }: Props) {
  const [province,    setProvince]    = useState("sandia");
  const [tab,         setTab]         = useState<TabMode>("salud");
  const [saludTipo,   setSaludTipo]   = useState<SaludTipo>("critica");
  const [mineriaTipo, setMineriaTipo] = useState<MineriaTipo>("informal");
  const [salud,       setSalud]       = useState<ESaludMarker[]>([]);
  const [mineria,     setMineria]     = useState<EMineriaMarker[]>([]);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [dragId,      setDragId]      = useState<number | null>(null);
  const [history,     setHistory]     = useState<{ salud: ESaludMarker[]; mineria: EMineriaMarker[] }[]>([]);
  const [hoverPos,    setHoverPos]    = useState<{ x: number; y: number } | null>(null);
  const [copied,      setCopied]      = useState(false);

  const svgRef       = useRef<SVGSVGElement>(null);
  const wasDragging  = useRef(false);
  // Always-current refs to avoid stale closures in effects
  const saludRef     = useRef(salud);
  const mineriaRef   = useRef(mineria);
  saludRef.current   = salud;
  mineriaRef.current = mineria;

  // Load province markers on change
  useEffect(() => {
    const existing = PROVINCE_MARKERS[province];
    _uid = 0;
    setSalud((existing?.salud  ?? []).map(m => ({ ...m, id: nextId() })));
    setMineria((existing?.mineria ?? []).map(m => ({ ...m, id: nextId() })));
    setSelected(null);
    setHistory([]);
  }, [province]);

  function getSVGCoords(e: React.MouseEvent | MouseEvent) {
    if (!svgRef.current) return null;
    const pt  = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return null;
    const p = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.round(Math.max(0, Math.min(1920, p.x))),
      y: Math.round(Math.max(0, Math.min(1080, p.y))),
    };
  }

  function snapshot() {
    setHistory(h => [...h.slice(-40), {
      salud:   [...saludRef.current],
      mineria: [...mineriaRef.current],
    }]);
  }

  function undo() {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setSalud(prev.salud);
      setMineria(prev.mineria);
      return h.slice(0, -1);
    });
  }

  // Click on SVG background → add marker
  function handleSVGClick(e: React.MouseEvent<SVGSVGElement>) {
    if (wasDragging.current) { wasDragging.current = false; return; }
    const c = getSVGCoords(e);
    if (!c) return;
    snapshot();
    if (tab === "salud") {
      setSalud(s => [...s, { x: c.x, y: c.y, tipo: saludTipo, id: nextId() }]);
    } else {
      setMineria(m => [...m, {
        x: c.x, y: c.y, tipo: mineriaTipo,
        nombre: "Nuevo", eessMasCercano: "—", distanciaKm: 0,
        id: nextId(),
      }]);
    }
  }

  // Mousedown on marker → start drag
  function handleMarkerMouseDown(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    snapshot();
    setSelected(id);
    setDragId(id);
    wasDragging.current = false;
  }

  // Drag effect
  useEffect(() => {
    if (dragId === null) return;
    function onMove(e: MouseEvent) {
      wasDragging.current = true;
      const c = getSVGCoords(e);
      if (!c) return;
      if (tab === "salud") {
        setSalud(s => s.map(m => m.id === dragId ? { ...m, x: c.x, y: c.y } : m));
      } else {
        setMineria(m => m.map(m => m.id === dragId ? { ...m, x: c.x, y: c.y } : m));
      }
    }
    function onUp() { setDragId(null); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [dragId, tab]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && selected !== null && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)) {
        snapshot();
        if (tab === "salud") setSalud(s => s.filter(m => m.id !== selected));
        else setMineria(m => m.filter(m => m.id !== selected));
        setSelected(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, tab, onClose]);

  // When tipo changes, also update selected marker's tipo
  function handleSaludTipoChange(t: SaludTipo) {
    setSaludTipo(t);
    if (selected !== null && tab === "salud") {
      setSalud(s => s.map(m => m.id === selected ? { ...m, tipo: t } : m));
    }
  }

  function handleMineriaTipoChange(t: MineriaTipo) {
    setMineriaTipo(t);
    if (selected !== null && tab === "mineria") {
      setMineria(m => m.map(m => m.id === selected ? { ...m, tipo: t } : m));
    }
  }

  function deleteSelected() {
    if (selected === null) return;
    snapshot();
    if (tab === "salud") setSalud(s => s.filter(m => m.id !== selected));
    else setMineria(m => m.filter(m => m.id !== selected));
    setSelected(null);
  }

  function resetProvince() {
    const existing = PROVINCE_MARKERS[province];
    _uid = 0;
    setSalud((existing?.salud  ?? []).map(m => ({ ...m, id: nextId() })));
    setMineria((existing?.mineria ?? []).map(m => ({ ...m, id: nextId() })));
    setSelected(null);
    setHistory([]);
  }

  function generateCode() {
    const pad = (n: number) => String(n).padStart(4);
    const saludLines = salud
      .map(m => `      { x: ${pad(m.x)}, y: ${pad(m.y)}, tipo: "${m.tipo}"  },`)
      .join("\n");
    const mineriaLines = mineria
      .map(m => `      { x: ${pad(m.x)}, y: ${pad(m.y)}, tipo: "${m.tipo}", nombre: "${m.nombre}", eessMasCercano: "${m.eessMasCercano}", distanciaKm: ${m.distanciaKm} },`)
      .join("\n");
    return `  ${province}: {\n    salud: [\n${saludLines}\n    ],\n    mineria: [\n${mineriaLines}\n    ],\n  },`;
  }

  function copyCode() {
    navigator.clipboard?.writeText(generateCode()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const selectedSalud   = tab === "salud"   ? salud.find(m   => m.id === selected) : null;
  const selectedMineria = tab === "mineria" ? mineria.find(m => m.id === selected) : null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "#080E11", display: "flex", fontFamily: "monospace" }}>

      {/* ── MAP AREA ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img
          src={PROVINCE_MAP_IMAGES[province]}
          alt="mapa"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
        />

        <svg
          ref={svgRef}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: dragId ? "grabbing" : "crosshair" }}
          onClick={handleSVGClick}
          onMouseMove={e => { if (dragId === null) setHoverPos(getSVGCoords(e)); }}
          onMouseLeave={() => setHoverPos(null)}
        >
          {/* Crosshair */}
          {hoverPos && dragId === null && (
            <g opacity={0.45} pointerEvents="none">
              <line x1={hoverPos.x} y1={0}    x2={hoverPos.x} y2={1080} stroke="#FFD060" strokeWidth={1} strokeDasharray="10 8" />
              <line x1={0}          y1={hoverPos.y} x2={1920} y2={hoverPos.y} stroke="#FFD060" strokeWidth={1} strokeDasharray="10 8" />
              <rect x={hoverPos.x + 10} y={hoverPos.y - 24} width={86} height={18} rx={4} fill="rgba(0,0,0,0.8)" />
              <text x={hoverPos.x + 53} y={hoverPos.y - 11} fontSize={11} fill="#FFD060" textAnchor="middle">
                {hoverPos.x}, {hoverPos.y}
              </text>
            </g>
          )}

          {/* Salud markers */}
          {tab === "salud" && salud.map(m => {
            const isSelected = m.id === selected;
            const r = m.tipo === "segura" ? 22 : isSelected ? 18 : 14;
            return (
              <circle
                key={m.id}
                cx={m.x} cy={m.y} r={r}
                fill={TIPO_COLORS[m.tipo]}
                stroke={isSelected ? "#FFD060" : "rgba(0,0,0,0.5)"}
                strokeWidth={isSelected ? 3 : 1}
                style={{ cursor: dragId === m.id ? "grabbing" : "grab" }}
                onMouseDown={e => handleMarkerMouseDown(e, m.id)}
              />
            );
          })}

          {/* Minería markers (triangles) */}
          {tab === "mineria" && mineria.map(m => {
            const isSelected = m.id === selected;
            const pts = `${m.x},${m.y - 18} ${m.x + 16},${m.y + 14} ${m.x - 16},${m.y + 14}`;
            return (
              <polygon
                key={m.id}
                points={pts}
                fill={TIPO_COLORS[m.tipo]}
                stroke={isSelected ? "#FFD060" : "rgba(0,0,0,0.5)"}
                strokeWidth={isSelected ? 3 : 1}
                style={{ cursor: dragId === m.id ? "grabbing" : "grab" }}
                onMouseDown={e => handleMarkerMouseDown(e, m.id)}
              />
            );
          })}
        </svg>
      </div>

      {/* ── CONTROL PANEL ────────────────────────────────────────────── */}
      <div style={{
        width: 290, background: "#0D161C",
        borderLeft: "1px solid #1A3040",
        display: "flex", flexDirection: "column",
        gap: 0, overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #1A3040", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#E0B040", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>Map Editor</span>
          <button onClick={onClose} style={btn("#0D161C", "#4A7A90")}>ESC</button>
        </div>

        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Province */}
          <div>
            <div style={label}>Provincia</div>
            <select value={province} onChange={e => setProvince(e.target.value)} style={select}>
              {Object.entries(PROVINCE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Tab */}
          <div>
            <div style={label}>Modo</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["salud", "mineria"] as TabMode[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ ...btn(tab === t ? "#163040" : "#0D161C", tab === t ? "#3E9AC4" : "#2A5060"), flex: 1, textTransform: "capitalize" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo – salud */}
          {tab === "salud" && (
            <div>
              <div style={label}>Tipo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {(["segura", "riesgo", "critica"] as SaludTipo[]).map(t => (
                  <button key={t} onClick={() => handleSaludTipoChange(t)} style={{
                    ...btn(
                      saludTipo === t ? "rgba(224,176,64,0.12)" : "#0D161C",
                      saludTipo === t ? "#E0B040" : "#2A5060",
                    ),
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ width: 11, height: 11, borderRadius: "50%", background: TIPO_COLORS[t], flexShrink: 0 }} />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tipo – mineria */}
          {tab === "mineria" && (
            <div>
              <div style={label}>Tipo</div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["formal", "informal"] as MineriaTipo[]).map(t => (
                  <button key={t} onClick={() => handleMineriaTipoChange(t)} style={{
                    ...btn(
                      mineriaTipo === t ? "rgba(224,176,64,0.12)" : "#0D161C",
                      mineriaTipo === t ? "#E0B040" : "#2A5060",
                    ),
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <span style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: `10px solid ${TIPO_COLORS[t]}`, flexShrink: 0 }} />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ borderTop: "1px solid #1A3040", paddingTop: 10 }}>
            <div style={label}>Conteo</div>
            {tab === "salud" ? (
              <div style={{ color: "#4A7A90", fontSize: 11, lineHeight: 1.8 }}>
                <span style={{ color: TIPO_COLORS.segura }}>●</span> segura:&nbsp;&nbsp;{salud.filter(m => m.tipo === "segura").length}{"\n"}
                <br />
                <span style={{ color: TIPO_COLORS.riesgo }}>●</span> riesgo:&nbsp;&nbsp;{salud.filter(m => m.tipo === "riesgo").length}
                <br />
                <span style={{ color: TIPO_COLORS.critica }}>●</span> critica:&nbsp;{salud.filter(m => m.tipo === "critica").length}
                <br />
                <span style={{ color: "#8AAABB" }}>total:&nbsp;&nbsp;&nbsp;{salud.length}</span>
              </div>
            ) : (
              <div style={{ color: "#4A7A90", fontSize: 11, lineHeight: 1.8 }}>
                <span style={{ color: TIPO_COLORS.formal }}>▲</span> formal:&nbsp;&nbsp;&nbsp;{mineria.filter(m => m.tipo === "formal").length}
                <br />
                <span style={{ color: TIPO_COLORS.informal }}>▲</span> informal:&nbsp;{mineria.filter(m => m.tipo === "informal").length}
                <br />
                <span style={{ color: "#8AAABB" }}>total:&nbsp;&nbsp;&nbsp;&nbsp;{mineria.length}</span>
              </div>
            )}
          </div>

          {/* Selected marker */}
          {(selectedSalud || selectedMineria) && (
            <div style={{ borderTop: "1px solid #1A3040", paddingTop: 10 }}>
              <div style={label}>Seleccionado</div>
              <div style={{ color: "#FFD060", fontSize: 11, lineHeight: 1.8 }}>
                x: {(selectedSalud || selectedMineria)!.x}
                <br />
                y: {(selectedSalud || selectedMineria)!.y}
                <br />
                tipo: {(selectedSalud || selectedMineria)!.tipo}
              </div>
              <button onClick={deleteSelected} style={{ ...btn("rgba(180,30,30,0.15)", "#C05050"), marginTop: 8, width: "100%" }}>
                Eliminar (Del)
              </button>
            </div>
          )}

          {/* Undo / Reset */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={undo} disabled={history.length === 0}
              style={{ ...btn("#0D161C", "#3E9AC4"), flex: 1, opacity: history.length === 0 ? 0.35 : 1 }}>
              ↩ Deshacer
            </button>
            <button onClick={resetProvince} style={{ ...btn("#0D161C", "#C05050"), flex: 1 }}>
              Reset
            </button>
          </div>

          {/* Instructions */}
          <div style={{ borderTop: "1px solid #1A3040", paddingTop: 10, color: "#2A5060", fontSize: 10, lineHeight: 1.9 }}>
            <b style={{ color: "#3A6070" }}>Click</b> → agregar punto<br />
            <b style={{ color: "#3A6070" }}>Drag</b>  → mover punto<br />
            <b style={{ color: "#3A6070" }}>Del</b>   → eliminar seleccionado<br />
            <b style={{ color: "#3A6070" }}>Ctrl+Z</b> → deshacer<br />
            <b style={{ color: "#3A6070" }}>Esc</b>   → cerrar
          </div>

          {/* Code output */}
          <div style={{ borderTop: "1px solid #1A3040", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={label}>Código generado</div>
              <button onClick={copyCode} style={btn(copied ? "rgba(19,163,131,0.2)" : "#0D161C", copied ? "#13A383" : "#3E9AC4")}>
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <pre
              onClick={() => navigator.clipboard?.writeText(generateCode())}
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid #1A3040",
                borderRadius: 6,
                padding: "8px 10px",
                color: "#4A8FA8",
                fontSize: 9,
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: 220,
                margin: 0,
                whiteSpace: "pre",
                userSelect: "all",
                cursor: "pointer",
                lineHeight: 1.5,
              }}
              title="Click para copiar"
            >
              {generateCode()}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────────

const label: React.CSSProperties = {
  color: "#3A6070",
  fontSize: 9,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: 5,
};

const select: React.CSSProperties = {
  width: "100%",
  background: "#080E11",
  border: "1px solid #1A3040",
  borderRadius: 5,
  color: "#8AAABB",
  fontSize: 11,
  padding: "6px 8px",
  fontFamily: "monospace",
  cursor: "pointer",
};

function btn(bg: string, border: string): React.CSSProperties {
  return {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 5,
    color: border,
    fontSize: 10,
    padding: "5px 10px",
    cursor: "pointer",
    fontFamily: "monospace",
    textAlign: "center",
  };
}
