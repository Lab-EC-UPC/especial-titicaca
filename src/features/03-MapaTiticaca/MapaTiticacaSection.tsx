import { useState, useEffect, useRef } from "react";


const LEVELS = {
  critical: { color: "#E91E8C", label: "CRÍTICO",        sub: "Relaves mineros, drenaje ácido" },
  high:     { color: "#F06292", label: "ALTO",            sub: "Daño bacteriológico" },
  moderate: { color: "#CE93D8", label: "MODERADO",        sub: "Excedencias menores de uso urbano" },
  sin:      { color: "#90A4AE", label: "SIN EXCEDENCIAS", sub: "No se registran excedencias" },
} as const;

const SCALE = 2.2;
const MAX_T = parseFloat(((1 - 1 / SCALE) / 2 * 100).toFixed(1)); // 27.3

const MIN_DOT = 0;
const MAX_DOT = 100;

const clampT   = (v: number) => Math.max(-MAX_T,  Math.min(MAX_T,  v));
const clampDot = (v: number) => Math.max(MIN_DOT, Math.min(MAX_DOT, v));

const ZOOM_TARGETS_DEFAULT = {
  azangaro:   { x: 18.2, y:  27.2 },
  lagunillas: { x: 17.2, y: -16.8 },
  pucara:     { x: 20.7, y:  27.2 },
  ilave:      { x: 13.2, y: -27.3 },
  illpa:      { x: 19.7, y:   7.7 },
  suches:     { x:  2.7, y:  27.2 },
  ramis:      { x: 18.7, y:  25.2 },
  huancane:   { x: 11.2, y:  27.2 },
} as const;

type LevelKey = keyof typeof LEVELS;
type CuencaId = keyof typeof ZOOM_TARGETS_DEFAULT;

interface ZoomTarget { x: number; y: number; }
type ZoomTargets = Record<CuencaId, ZoomTarget>;
type DotPositions = Record<CuencaId, { x: number; y: number }>;

interface Cuenca {
  id: CuencaId;
  name: string;
  contaminant: string;
  value: string;
  excede: string;
  level: LevelKey;
  x: string; // default dot X %
  y: string; // default dot Y %
}

const CUENCAS: Cuenca[] = [
  { id: "azangaro",   name: "Cuenca Azángaro",  contaminant: "Mercurio", value: "2.15 mg/L",   excede: "2153 veces", level: "critical", x: "36%", y: "58%" },
  { id: "lagunillas", name: "Cuenca Lagunillas", contaminant: "Hierro",   value: "2.67 mg/L",   excede: "0.6 veces",  level: "sin",      x: "57%", y: "37%" },
  { id: "pucara",     name: "Cuenca Pucará",     contaminant: "Hierro",   value: "128.07 mg/L", excede: "25.6 veces", level: "high",     x: "29%", y: "50%" },
  { id: "ilave",      name: "Cuenca Ilave",      contaminant: "Arsénico", value: "0.03 mg/L",   excede: "3.4 veces",  level: "moderate", x: "50%", y: "56%" },
  { id: "illpa",      name: "Cuenca Illpa",      contaminant: "Aluminio", value: "13.13 mg/L",  excede: "2.6 veces",  level: "moderate", x: "66%", y: "49%" },
  { id: "suches",     name: "Cuencas Suches",    contaminant: "Aluminio", value: "40.28 mg/L",  excede: "5.0 veces",  level: "high",     x: "27%", y: "70%" },
  { id: "ramis",      name: "Intercuenca Ramis", contaminant: "Hierro",   value: "178.05 mg/L", excede: "35.6 veces", level: "critical", x: "49%", y: "72%" },
  { id: "huancane",   name: "Cuenca Huancané",   contaminant: "Cobre",    value: "3.00 mg/L",   excede: "15 veces",   level: "high",     x: "61%", y: "74%" },
];

const MAP_IMAGE = "/mapa_titicaca.png";

// EDITOR PANEL

type EditorTab = "zoom" | "dots";

const EditorPanel = ({
  targets,
  dots,
  activeId,
  onZoomChange,
  onDotChange,
  onClose,
}: {
  targets:      ZoomTargets;
  dots:         DotPositions;
  activeId:     CuencaId | null;
  onZoomChange: (id: CuencaId, axis: "x" | "y", val: number) => void;
  onDotChange:  (id: CuencaId, axis: "x" | "y", val: number) => void;
  onClose:      () => void;
}) => {
  const [tab, setTab]             = useState<EditorTab>("zoom");
  const [selectedId, setSelectedId] = useState<CuencaId | null>(activeId);

  useEffect(() => { if (activeId) setSelectedId(activeId); }, [activeId]);

  const cuenca    = selectedId ? CUENCAS.find(c => c.id === selectedId)! : null;
  const cfg       = cuenca ? LEVELS[cuenca.level] : null;
  const zTarget   = selectedId ? targets[selectedId] : null;
  const dTarget   = selectedId ? dots[selectedId]    : null;

  const shortName = (c: Cuenca) =>
    c.name.replace("Cuenca ", "").replace("Intercuenca ", "").replace("Cuencas ", "");

  return (
    <div style={{
      position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
      zIndex: 100,
      background: "rgba(13,21,23,0.97)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 14, padding: "14px 16px",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
      width: "min(560px, 96vw)",
      fontFamily: "monospace",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["zoom", "dots"] as EditorTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "#E91E8C" : "rgba(255,255,255,0.06)",
              border: `1px solid ${tab === t ? "#E91E8C" : "rgba(255,255,255,0.1)"}`,
              color: "#fff", borderRadius: 6, padding: "4px 12px",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "all 0.2s",
            }}>
              {t === "zoom" ? "⊕ Zoom" : "● Puntos"}
            </button>
          ))}
          <span style={{ color: "#546E7A", fontSize: 10, alignSelf: "center", marginLeft: 4 }}>
            límite {tab === "zoom" ? `±${MAX_T}%` : "0–100%"}
          </span>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#546E7A",
          cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px",
        }}>×</button>
      </div>

      {/* ── Selector cuencas ── */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
        {CUENCAS.map(c => {
          const lcfg = LEVELS[c.level];
          const sel  = selectedId === c.id;
          return (
            <button key={c.id} onClick={() => setSelectedId(c.id)} style={{
              background: sel ? lcfg.color : "rgba(255,255,255,0.05)",
              border: `1px solid ${sel ? lcfg.color : "rgba(255,255,255,0.1)"}`,
              color: sel ? "#fff" : "#8FA0AB",
              borderRadius: 6, padding: "3px 9px", fontSize: 11,
              cursor: "pointer", fontWeight: sel ? 700 : 400,
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
              {shortName(c)}
            </button>
          );
        })}
      </div>

      {/* ── Sliders ── */}
      {selectedId && cuenca && cfg ? (
        <>
          {tab === "zoom" && zTarget && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {(["x", "y"] as const).map(axis => (
                <div key={axis} style={{ flex: "1 1 200px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: "#8FA0AB", fontSize: 11 }}>
                      {axis === "x" ? "X — horizontal" : "Y — vertical"}
                    </span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>
                      {zTarget[axis].toFixed(1)}%
                    </span>
                  </div>
                  <input type="range" min={-MAX_T} max={MAX_T} step={0.5}
                    value={zTarget[axis]}
                    onChange={e => onZoomChange(selectedId, axis, parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: cfg.color }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#546E7A", fontSize: 10 }}>
                      {axis === "x" ? "← izq" : "↑ arriba"}
                    </span>
                    <span style={{ color: "#546E7A", fontSize: 10 }}>
                      {axis === "x" ? "der →" : "abajo ↓"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "dots" && dTarget && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {(["x", "y"] as const).map(axis => (
                <div key={axis} style={{ flex: "1 1 200px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: "#8FA0AB", fontSize: 11 }}>
                      {axis === "x" ? "X — horizontal" : "Y — vertical"}
                    </span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>
                      {dTarget[axis].toFixed(1)}%
                    </span>
                  </div>
                  <input type="range" min={MIN_DOT} max={MAX_DOT} step={0.5}
                    value={dTarget[axis]}
                    onChange={e => onDotChange(selectedId, axis, parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: cfg.color }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#546E7A", fontSize: 10 }}>
                      {axis === "x" ? "← izq (0%)" : "↑ arriba (0%)"}
                    </span>
                    <span style={{ color: "#546E7A", fontSize: 10 }}>
                      {axis === "x" ? "der → (100%)" : "abajo ↓ (100%)"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Output copiable */}
          <div style={{
            marginTop: 12, background: "rgba(255,255,255,0.04)",
            borderRadius: 8, padding: "8px 12px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ color: "#546E7A", fontSize: 10, display: "block", marginBottom: 3 }}>
              {tab === "zoom" ? "ZOOM" : "PUNTO"} — copia al código
            </span>
            <code style={{ color: "#E91E8C", fontSize: 11, wordBreak: "break-all" }}>
              {tab === "zoom" && zTarget &&
                selectedId + ": { x: " + zTarget.x.toFixed(1) + ", y: " + zTarget.y.toFixed(1) + " }"}
              {tab === "dots" && dTarget &&
                '{ id: "' + selectedId + '", x: "' + dTarget.x.toFixed(1) + '%", y: "' + dTarget.y.toFixed(1) + '%" }'}
            </code>
          </div>
        </>
      ) : (
        <p style={{ color: "#546E7A", fontSize: 12, margin: 0, textAlign: "center" }}>
          Selecciona una cuenca para editarla
        </p>
      )}

      {/* Exportar todos */}
      <details style={{ marginTop: 10 }}>
        <summary style={{ color: "#546E7A", fontSize: 10, cursor: "pointer", userSelect: "none" }}>
          Ver todos los valores
        </summary>
        <pre style={{
          marginTop: 6, color: "#8FA0AB", fontSize: 10,
          background: "rgba(255,255,255,0.03)", borderRadius: 6,
          padding: "8px 10px", overflow: "auto", maxHeight: 130,
        }}>
          {tab === "zoom"
            ? "const ZOOM_TARGETS = {\n" +
              Object.entries(targets).map(([k, v]) =>
                "  " + k.padEnd(12) + ": { x: " + String(v.x.toFixed(1)).padStart(5) + ", y: " + String(v.y.toFixed(1)).padStart(5) + " },"
              ).join("\n") +
              "\n} as const;"
            : CUENCAS.map(c =>
                '  { id: "' + c.id + '", x: "' + dots[c.id].x.toFixed(1) + '%", y: "' + dots[c.id].y.toFixed(1) + '%" },'
              ).join("\n")
          }
        </pre>
      </details>
    </div>
  );
};

//PRINCIPAL

export const MapaTiticacaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const [zoom,        setZoom]        = useState({ scale: 1, tx: 0, ty: 0 });
  const [showEditor,  setShowEditor]  = useState(false);
  // Para reactivar el editor: cambiar false → true

  // Zoom targets editables
  const [targets, setTargets] = useState<ZoomTargets>(() =>
    Object.fromEntries(
      Object.entries(ZOOM_TARGETS_DEFAULT).map(([k, v]) => [k, { x: v.x, y: v.y }])
    ) as ZoomTargets
  );

  // Dot positions editables — inicializadas desde los % default de CUENCAS
  const [dots, setDots] = useState<DotPositions>(() => ({
    azangaro:   { x: 48.0, y: 15.5 },
    lagunillas: { x: 45.0, y: 37.5 },
    pucara:     { x: 43.0, y: 25.0 },
    ilave:      { x: 59.5, y: 60.0 },
    illpa:      { x: 43.0, y: 45.0 },
    suches:     { x: 46.0, y: 12.0 },
    ramis:      { x: 54.0, y: 46.5 },
    huancane:   { x: 67.0, y: 25.5 },
  }));

  const activeId: CuencaId | null = activeIdx >= 0 ? CUENCAS[activeIdx].id : null;

  const handleZoomChange = (id: CuencaId, axis: "x" | "y", val: number) => {
    const clamped = clampT(val);
    setTargets(prev => ({ ...prev, [id]: { ...prev[id], [axis]: clamped } }));
    if (id === activeId) {
      setZoom(prev => ({ ...prev, [axis === "x" ? "tx" : "ty"]: clamped }));
    }
  };

  const handleDotChange = (id: CuencaId, axis: "x" | "y", val: number) => {
    setDots(prev => ({ ...prev, [id]: { ...prev[id], [axis]: clampDot(val) } }));
  };

  useEffect(() => {
    const SCREENS = 9;
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const progress   = Math.max(0, Math.min(1, -top / scrollable));
      const step       = progress * SCREENS;
      const idx        = Math.floor(step) - 1;

      if (idx < 0) {
        setActiveIdx(-1);
        setZoom({ scale: 1, tx: 0, ty: 0 });
        return;
      }
      const cuenca = CUENCAS[Math.min(idx, CUENCAS.length - 1)];
      const target = targets[cuenca.id];
      setActiveIdx(Math.min(idx, CUENCAS.length - 1));
      setZoom({ scale: SCALE, tx: clampT(target.x), ty: clampT(target.y) });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targets]);

  const active    = activeIdx >= 0 ? CUENCAS[activeIdx] : null;
  const activeCfg = active ? LEVELS[active.level] : null;

  return (
    <div id="mapatiti" ref={sectionRef} style={{ position: "relative", height: "900vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#151B1B" }}>

        {/* Imagen del mapa */}
        <img
          src={MAP_IMAGE}
          alt="Mapa cuencas hidrográficas del Lago Titicaca"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "center",
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
          position: "absolute", bottom: "clamp(16px, 3vw, 32px)", right: "clamp(12px, 2vw, 32px)",
          zIndex: 30,
          background: "rgba(18,24,27,0.92)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "clamp(10px,1.5vw,18px) clamp(12px,1.8vw,22px)",
          backdropFilter: "blur(14px)", minWidth: "clamp(160px,18vw,220px)",
        }}>
          <p style={{ color: "#90A4AE", fontSize: "clamp(9px,1vw,10px)", letterSpacing: "0.14em", fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase" }}>
            Leyenda
          </p>
          {Object.entries(LEVELS).map(([key, cfg]) => (
            <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
              <div>
                <p style={{ color: "#fff", fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, margin: 0 }}>{cfg.label}</p>
                <p style={{ color: "#78909C", fontSize: "clamp(9px,0.9vw,11px)", margin: "1px 0 0" }}>{cfg.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Marcadores — solo visible cuando es su turno */}
        {CUENCAS.map((c, i) => {
          const cfg      = LEVELS[c.level];
          const isActive = activeIdx === i;
          const dotPos   = dots[c.id];
          return (
            <div
              key={c.id}
              style={{
                position: "absolute",
                left: `${dotPos.x}%`,
                top:  `${dotPos.y}%`,
                transform: "translate(-50%,-50%)",
                zIndex: 20,
                // Solo visible cuando es su turno
                opacity: isActive ? 1 : 0,
                pointerEvents: "none",
                transition: "opacity 0.35s ease",
              }}
            >
              {/* Popup — comentado temporalmente
              <div style={{
                position: "absolute", bottom: "calc(100% + 12px)", left: "50%",
                width: "clamp(170px,20vw,210px)",
                background: "rgba(13,21,23,0.95)", border: `1.5px solid ${cfg.color}`,
                borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(12px)",
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
                <p style={{ color: "#fff", fontSize: "clamp(14px,1.5vw,18px)", fontWeight: 800, margin: "0 0 2px", lineHeight: 1.1 }}>
                  {c.contaminant}: {c.value}
                </p>
                <p style={{ color: "#90A4AE", fontSize: "clamp(10px,1vw,11px)", margin: 0 }}>
                  Excede límite permitido:{" "}
                  <span style={{ color: cfg.color, fontWeight: 700 }}>{c.excede}</span>
                </p>
                <div style={{
                  position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
                  borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                  borderTop: `7px solid ${cfg.color}`,
                }} />
              </div>
              */}

              {/* Dot */}
              <div style={{
                width: 16, height: 16,
                borderRadius: "50%", background: cfg.color,
                boxShadow: `0 0 0 5px ${cfg.color}33, 0 0 16px ${cfg.color}`,
                transition: "all 0.35s",
              }} />
            </div>
          );
        })}

        {/* Card detalle activo */}
        <div style={{
          position: "absolute",
          bottom: "clamp(16px,3vw,28px)",
          left: "clamp(12px,2vw,28px)",
          zIndex: 30, width: "clamp(200px,22vw,260px)",
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s, transform 0.4s",
          pointerEvents: "none",
        }}>
          {active && activeCfg && (
            <div style={{
              background: "rgba(13,21,23,0.95)", border: `1.5px solid ${activeCfg.color}`,
              borderRadius: 12, padding: "clamp(10px,1.5vw,14px) clamp(12px,1.8vw,18px)",
              backdropFilter: "blur(14px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${activeCfg.color}33`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeCfg.color, boxShadow: `0 0 8px ${activeCfg.color}` }} />
                <span style={{ color: activeCfg.color, fontSize: "clamp(9px,0.9vw,10px)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {activeCfg.label}
                </span>
              </div>
              <p style={{ color: "#cfd8dc", fontSize: "clamp(10px,1vw,12px)", fontWeight: 600, margin: "0 0 4px" }}>{active.name}</p>
              <p style={{ color: "#fff", fontSize: "clamp(16px,2vw,22px)", fontWeight: 900, margin: "0 0 4px", lineHeight: 1 }}>
                {active.contaminant}:{" "}
                <span style={{ color: activeCfg.color }}>{active.value}</span>
              </p>
              <p style={{ color: "#90A4AE", fontSize: "clamp(10px,1vw,11px)", margin: "0 0 10px" }}>
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
          <h2 style={{ color: "#fff", fontSize: "clamp(12px, 2vw, 20px)", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            Cuenca del Lago Titicaca
          </h2>
          <p style={{ color: "#90A4AE", fontSize: "clamp(9px,1vw,11px)", margin: "3px 0 0", letterSpacing: "0.08em" }}>
            Monitoreo de contaminantes · 8 cuencas hidrográficas
          </p>
        </div>

        {/* Scroll hint */}
        {!active && (
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            textAlign: "center", zIndex: 30, animation: "nudge 2s ease-in-out infinite",
          }}>
            <p style={{ color: "#546E7A", fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.12em", margin: "0 0 6px" }}>
              SCROLL PARA EXPLORAR
            </p>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v14M3 10l6 6 6-6" stroke="#546E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

      </div>

      {/* Panel editor — para reactivar: cambiar showEditor a true en el useState */}
      {showEditor && (
        <EditorPanel
          targets={targets}
          dots={dots}
          activeId={activeId}
          onZoomChange={handleZoomChange}
          onDotChange={handleDotChange}
          onClose={() => setShowEditor(false)}
        />
      )}

      <style>{`
        @keyframes nudge {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
};