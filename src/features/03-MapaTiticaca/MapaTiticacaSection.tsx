import { useState, useEffect, useRef } from "react";

// ─── IMÁGENES MOBILE POR CUENCA (frames pre-renderizados) ─────────────────────
import imgAzangaro from "./assets/cuenca_mobile_azangaro_1.png";
import imgLagunillas from "./assets/cuenca_mobile_lagunillas_2.png";
import imgPucara from "./assets/cuenca_mobile_pucara_3.png";
import imgIlave from "./assets/cuenca_mobile_ilave_4.png";
import imgIllpa from "./assets/cuenca_mobile_illpa_5.png";
import imgSuches from "./assets/cuenca_mobile_suches_6.png";
import imgRamis from "./assets/cuenca_mobile_ramis_7.png";
import imgHuancane from "./assets/cuenca_mobile_huancane_8.png";

import {
  LEVELS,
  SCALE,
  MAX_T,
  clampT,
  clampDot,
  DESKTOP_RATIO,
  MOBILE_RATIO,
  MOBILE_BP,
  type CuencaId,
  type ZoomTargets,
  type DotPositions,
  CUENCAS,
  ZOOM_DESKTOP,
  DOTS_DESKTOP,
  ZOOM_MOBILE,
  DOTS_MOBILE,
} from "./mapData";

// ─── IMAGEN PRE-RENDERIZADA POR CUENCA (solo mobile) ──────────────────────────
// Cada frame ya contiene el mapa con el zoom hecho + punto + nombre + pop-up + leyenda.
const CUENCA_IMAGES: Record<CuencaId, string> = {
  azangaro: imgAzangaro,
  lagunillas: imgLagunillas,
  pucara: imgPucara,
  ilave: imgIlave,
  illpa: imgIllpa,
  suches: imgSuches,
  ramis: imgRamis,
  huancane: imgHuancane,
};

// ─── HOOK: área real de la imagen (objectFit:contain) ─────────────────────────
function useMapRect(
  imgRef: React.RefObject<HTMLImageElement | null>,
  imgRatio: number,
) {
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  useEffect(() => {
    const compute = () => {
      const el = imgRef.current;
      if (!el) return;
      const cw = el.clientWidth,
        ch = el.clientHeight;
      let w: number, h: number;
      if (imgRatio > cw / ch) {
        w = cw;
        h = cw / imgRatio;
      } else {
        h = ch;
        w = ch * imgRatio;
      }
      setRect({ left: (cw - w) / 2, top: (ch - h) / 2, width: w, height: h });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (imgRef.current) ro.observe(imgRef.current);
    return () => ro.disconnect();
  }, [imgRef, imgRatio]);
  return rect;
}

// ─── EDITOR PANEL ─────────────────────────────────────────────────────────────
type EditorTab = "zoom" | "dots";

const EditorPanel = ({
  device,
  accentColor,
  zoomTargets,
  dotPositions,
  activeId,
  onZoomChange,
  onDotChange,
  onClose,
}: {
  device: "desktop" | "mobile";
  accentColor: string;
  zoomTargets: ZoomTargets;
  dotPositions: DotPositions;
  activeId: CuencaId | null;
  onZoomChange: (id: CuencaId, axis: "x" | "y", val: number) => void;
  onDotChange: (id: CuencaId, axis: "x" | "y", val: number) => void;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState<EditorTab>("dots");
  const [selectedId, setSelectedId] = useState<CuencaId | null>(activeId);
  useEffect(() => {
    if (activeId) setSelectedId(activeId);
  }, [activeId]);

  const cuenca = selectedId ? CUENCAS.find((c) => c.id === selectedId)! : null;
  const cfg = cuenca ? LEVELS[cuenca.level] : null;
  const zTarget = selectedId ? zoomTargets[selectedId] : null;
  const dTarget = selectedId ? dotPositions[selectedId] : null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        background: "rgba(10,16,20,0.98)",
        border: "1px solid " + accentColor + "55",
        borderRadius: 14,
        padding: "14px 18px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.8)",
        width: "min(620px,96vw)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: accentColor + "22",
              border: "1px solid " + accentColor + "55",
              color: accentColor,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 20,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {device === "desktop" ? "Desktop" : "Mobile"}
          </span>
          {(["zoom", "dots"] as EditorTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? accentColor : "rgba(255,255,255,0.06)",
                border:
                  "1px solid " +
                  (tab === t ? accentColor : "rgba(255,255,255,0.1)"),
                color: "#fff",
                borderRadius: 6,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {t === "zoom" ? "⊕ Zoom" : "● Puntos"}
            </button>
          ))}
          <span style={{ color: "#546E7A", fontSize: 10 }}>
            lmite {tab === "zoom" ? "±" + MAX_T + "%" : "0–100%"}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#546E7A",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Selector cuencas */}
      <div
        style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}
      >
        {CUENCAS.map((c) => {
          const lc = LEVELS[c.level],
            sel = selectedId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              style={{
                background: sel ? lc.color : "rgba(255,255,255,0.05)",
                border:
                  "1px solid " + (sel ? lc.color : "rgba(255,255,255,0.1)"),
                color: sel ? "#fff" : "#8FA0AB",
                borderRadius: 6,
                padding: "3px 9px",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: sel ? 700 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {c.shortName}
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      {selectedId && cuenca && cfg ? (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {(["x", "y"] as const).map((axis) => {
              const isZoom = tab === "zoom";
              const val = isZoom
                ? (zTarget?.[axis] ?? 0)
                : (dTarget?.[axis] ?? 0);
              const min = isZoom ? -MAX_T : 0;
              const max = isZoom ? MAX_T : 100;
              return (
                <div key={axis} style={{ flex: "1 1 210px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: "#8FA0AB", fontSize: 11 }}>
                      {axis === "x"
                        ? isZoom
                          ? "Zoom X (izq←→der)"
                          : "Punto X (izq←→der)"
                        : isZoom
                          ? "Zoom Y (↑arr→aba↓)"
                          : "Punto Y (↑arr→aba↓)"}
                    </span>
                    <span
                      style={{
                        color: cfg.color,
                        fontSize: 13,
                        fontWeight: 900,
                      }}
                    >
                      {val.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={0.5}
                    value={val}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (isZoom) onZoomChange(selectedId, axis, v);
                      else onDotChange(selectedId, axis, v);
                    }}
                    style={{
                      width: "100%",
                      accentColor: cfg.color,
                      height: 6,
                      cursor: "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* Output */}
          <div
            style={{
              marginTop: 10,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 8,
              padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                color: "#546E7A",
                fontSize: 10,
                display: "block",
                marginBottom: 3,
              }}
            >
              Copia → {tab === "zoom" ? "ZOOM_" : "DOTS_"}
              {device === "desktop" ? "DESKTOP" : "MOBILE"}
            </span>
            <code
              style={{
                color: accentColor,
                fontSize: 11,
                wordBreak: "break-all",
              }}
            >
              {tab === "zoom" &&
                zTarget &&
                `${selectedId}: { x: ${zTarget.x.toFixed(1)}, y: ${zTarget.y.toFixed(1)} }`}
              {tab === "dots" &&
                dTarget &&
                `${selectedId}: { x: ${dTarget.x.toFixed(1)}, y: ${dTarget.y.toFixed(1)} }`}
            </code>
          </div>
        </>
      ) : (
        <p
          style={{
            color: "#546E7A",
            fontSize: 12,
            margin: 0,
            textAlign: "center",
          }}
        >
          Haz scroll o selecciona una cuenca
        </p>
      )}

      <details style={{ marginTop: 10 }}>
        <summary
          style={{
            color: "#546E7A",
            fontSize: 10,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          Ver todos los valores ({tab})
        </summary>
        <pre
          style={{
            marginTop: 6,
            color: "#8FA0AB",
            fontSize: 10,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 6,
            padding: "8px 10px",
            overflow: "auto",
            maxHeight: 150,
          }}
        >
          {tab === "zoom"
            ? CUENCAS.map(
                (c) =>
                  "  " +
                  c.id.padEnd(12) +
                  ": { x:" +
                  String(zoomTargets[c.id].x.toFixed(1)).padStart(6) +
                  ", y:" +
                  String(zoomTargets[c.id].y.toFixed(1)).padStart(6) +
                  " },",
              ).join("\n")
            : CUENCAS.map(
                (c) =>
                  "  " +
                  c.id.padEnd(12) +
                  ": { x:" +
                  String(dotPositions[c.id].x.toFixed(1)).padStart(6) +
                  ", y:" +
                  String(dotPositions[c.id].y.toFixed(1)).padStart(6) +
                  " },",
              ).join("\n")}
        </pre>
      </details>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export const MapaTiticacaSection = ({ start }: { start?: number }) =>
  start !== undefined ? <MapaEmbedded start={start} /> : <MapaStandalone />;

// ── Embedded mode (GSAP-driven, simplified) ──
const MapaEmbedded = ({ start }: { start: number }) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BP : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const DOTS = DOTS_DESKTOP as Record<CuencaId, { x: number; y: number }>;

  return (
    <div
      data-map-section
      data-start={start}
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

        {!isMobile &&
          CUENCAS.map((c, i) => {
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
                    fontSize: "clamp(9px,1.1vw,12px)",
                    textShadow:
                      "0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)",
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
            <p
              className="text-[#90A4AE] font-bold tracking-widest uppercase m-0"
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
                  <p
                    className="text-white font-bold m-0"
                    style={{ fontSize: "clamp(10px,1.1vw,12px)" }}
                  >
                    {cfg.label}
                  </p>
                  <p
                    className="text-[#78909C] m-0"
                    style={{ fontSize: "clamp(9px,0.9vw,11px)" }}
                  >
                    {cfg.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isMobile &&
          CUENCAS.map((c, i) => {
            const cfg = LEVELS[c.level];
            return (
              <div
                key={c.id}
                data-map-card={i}
                className="absolute z-30 pointer-events-none"
                style={{
                  top: "clamp(100px,13vw,160px)",
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
                      style={{
                        width: 8,
                        height: 8,
                        background: cfg.color,
                        boxShadow: `0 0 8px ${cfg.color}`,
                      }}
                    />
                    <span
                      className="font-extrabold tracking-widest uppercase"
                      style={{
                        color: cfg.color,
                        fontSize: "clamp(9px,0.9vw,10px)",
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p
                    className="text-[#cfd8dc] font-semibold m-0 mb-[3px]"
                    style={{ fontSize: "clamp(10px,1vw,12px)" }}
                  >
                    {c.name}
                  </p>
                  <p
                    className="text-white font-black m-0 mb-[3px] leading-none"
                    style={{ fontSize: "clamp(16px,2vw,22px)" }}
                  >
                    {c.contaminant}:{" "}
                    <span style={{ color: cfg.color }}>{c.value}</span>
                  </p>
                  <p
                    className="text-[#90A4AE] m-0 mb-[10px]"
                    style={{ fontSize: "clamp(10px,1vw,11px)" }}
                  >
                    Excede lmite:{" "}
                    <strong className="text-white">{c.excede}</strong>
                  </p>
                  <div className="flex items-center gap-[3px]">
                    {CUENCAS.map((_, j) => (
                      <div
                        key={j}
                        className="rounded-[2px]"
                        style={{
                          height: 3,
                          width: j === i ? 18 : 4,
                          background:
                            j <= i
                              ? cfg.color + (j === i ? "" : "66")
                              : "rgba(255,255,255,0.12)",
                          transition: "all 0.35s",
                        }}
                      />
                    ))}
                    <span
                      className="text-[#546E7A] ml-[5px]"
                      style={{ fontSize: 10 }}
                    >
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
            top: isMobile ? 60 : 80,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          <h2
            className="text-white font-extrabold tracking-widest uppercase m-0"
            style={{
              fontSize: isMobile
                ? "clamp(11px,3.5vw,14px)"
                : "clamp(13px,2vw,20px)",
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}
          >
            CONCENTRACIÓN DE METALES POR CUENCA
          </h2>
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

// ── Standalone mode (original scroll-driven) ──
const MapaStandalone = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const imgDesktopRef = useRef<HTMLImageElement>(null);
  const imgMobileRef = useRef<HTMLImageElement>(null);

  const [activeIdx, setActiveIdx] = useState(-1);
  const [zoom, setZoom] = useState({ scale: 1, tx: 0, ty: 0 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BP : false,
  );

  // ── Editor dev (coordenadas): cambiar DEV_EDITOR a true para activarlo ──
  const DEV_EDITOR = false;
  const [showEditor, setShowEditor] = useState(false);

  const [zoomD, setZoomD] = useState<ZoomTargets>(() => ({ ...ZOOM_DESKTOP }));
  const [dotsD, setDotsD] = useState<DotPositions>(() => ({ ...DOTS_DESKTOP }));
  const [zoomM, setZoomM] = useState<ZoomTargets>(() => ({ ...ZOOM_MOBILE }));
  const [dotsM, setDotsM] = useState<DotPositions>(() => ({ ...DOTS_MOBILE }));

  const zoomTargets = isMobile ? zoomM : zoomD;
  const dotPositions = isMobile ? dotsM : dotsD;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const mapRectD = useMapRect(imgDesktopRef, DESKTOP_RATIO);
  const mapRectM = useMapRect(imgMobileRef, MOBILE_RATIO);
  const mapRect = isMobile ? mapRectM : mapRectD;

  const activeId: CuencaId | null =
    activeIdx >= 0 ? CUENCAS[activeIdx].id : null;

  const handleZoom = (id: CuencaId, axis: "x" | "y", val: number) => {
    const c = clampT(val);
    if (isMobile) setZoomM((p) => ({ ...p, [id]: { ...p[id], [axis]: c } }));
    else setZoomD((p) => ({ ...p, [id]: { ...p[id], [axis]: c } }));
    if (id === activeId)
      setZoom((p) => ({ ...p, [axis === "x" ? "tx" : "ty"]: c }));
  };
  const handleDot = (id: CuencaId, axis: "x" | "y", val: number) => {
    const c = clampDot(val);
    if (isMobile) setDotsM((p) => ({ ...p, [id]: { ...p[id], [axis]: c } }));
    else setDotsD((p) => ({ ...p, [id]: { ...p[id], [axis]: c } }));
  };

  useEffect(() => {
    const SCREENS = 9;
    // Throttle con rAF + memo del último estado, para no leer layout ni
    // disparar setState (setZoom crea objeto nuevo → re-render) en cada
    // evento de scroll, solo cuando realmente cambia el valor.
    let ticking = false;
    let raf = 0;
    const last = { idx: -2, scale: -1, tx: NaN, ty: NaN };
    const compute = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -top / (height - window.innerHeight)),
      );
      // Cross-dissolve de entrada: la capa aparece (opacity 0→1) por encima
      // del último frame del video que queda quieto debajo. Sin negro.
      const FADE = 0.07;
      const op = progress >= FADE ? 1 : progress / FADE;
      if (fadeRef.current)
        fadeRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
      const idx = Math.floor(progress * SCREENS) - 1;
      if (idx < 0) {
        if (last.idx !== -1) {
          setActiveIdx(-1);
          setZoom({ scale: 1, tx: 0, ty: 0 });
          last.idx = -1;
          last.scale = 1;
          last.tx = 0;
          last.ty = 0;
        }
        return;
      }
      const ci = Math.min(idx, CUENCAS.length - 1);
      const targets = window.innerWidth < MOBILE_BP ? zoomM : zoomD;
      const t = targets[CUENCAS[ci].id];
      const tx = clampT(t.x);
      const ty = clampT(t.y);
      if (ci !== last.idx) {
        setActiveIdx(ci);
        last.idx = ci;
      }
      if (last.scale !== SCALE || last.tx !== tx || last.ty !== ty) {
        setZoom({ scale: SCALE, tx, ty });
        last.scale = SCALE;
        last.tx = tx;
        last.ty = ty;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [zoomD, zoomM]);

  const active = activeIdx >= 0 ? CUENCAS[activeIdx] : null;
  const activeCfg = active ? LEVELS[active.level] : null;

  const imgTransform = `scale(${zoom.scale}) translate(${zoom.tx}%,${zoom.ty}%)`;
  const imgTransition = "transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)";

  // Tamaños responsivos del dot/label
  const dotSize = isMobile ? 8 : 14;
  const ringSize = isMobile ? 18 : 30;
  const labelSize = isMobile ? "clamp(6px,2.2vw,8px)" : "clamp(9px,1.1vw,12px)";

  // Progreso (0–1) para barra superior
  const progressPct = active ? ((activeIdx + 1) / CUENCAS.length) * 100 : 0;

  return (
    <div
      id="mapatiti"
      ref={sectionRef}
      style={{ position: "relative", height: "960vh", marginTop: "-60vh" }}
    >
      <div
        ref={fadeRef}
        data-map-section
        data-start={0.48}
        data-images={8}
        data-snap={160}
        data-transition={60}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#151B1B",
          opacity: 0,
        }}
      >
        {/* ── Barra de progreso (top) ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 2,
            zIndex: 40,
            width: `${progressPct}%`,
            background: activeCfg ? activeCfg.color : "transparent",
            transition: "width 0.6s ease, background-color 0.5s ease",
            boxShadow: activeCfg ? `0 0 8px ${activeCfg.color}` : "none",
          }}
        />

        {/* ── Imagen desktop ── */}
        <img
          ref={imgDesktopRef}
          src="/mapa_titicaca.png"
          alt="Mapa Lago Titicaca desktop"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transform: imgTransform,
            transition: imgTransition,
            transformOrigin: "center center",
            userSelect: "none",
            willChange: "transform",
            display: isMobile ? "none" : "block",
          }}
        />

        {/* ── Imagen mobile ── */}
        <img
          ref={imgMobileRef}
          src="/mapa_titicaca_mobile.png"
          alt="Mapa Lago Titicaca móvil"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: imgTransform,
            transition: imgTransition,
            transformOrigin: "center center",
            userSelect: "none",
            willChange: "transform",
            display: isMobile ? "block" : "none",
          }}
        />

        {/* ── Mobile: frame pre-renderizado de la cuenca activa ──
             El zoom de la imagen base sigue animando debajo; una vez hecho el
             zoom, la imagen de la cuenca aparece encima (cross-fade). ── */}
        {isMobile &&
          CUENCAS.map((c, i) => (
            <img
              key={c.id}
              src={CUENCA_IMAGES[c.id]}
              alt={c.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                background: "#21292C", // = fondo del frame: las franjas del letterbox se funden, full-screen sin recortar
                opacity: activeIdx === i ? 1 : 0,
                transition: "opacity 0.55s ease",
                transitionDelay: activeIdx === i ? "0.3s" : "0s",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 5,
              }}
            />
          ))}

        {/* ── Overlay dots (siguen el zoom de la imagen) — solo desktop ── */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: mapRect.left,
              top: mapRect.top,
              width: mapRect.width,
              height: mapRect.height,
              pointerEvents: "none",
              transform: imgTransform,
              transition: imgTransition,
              transformOrigin: "center center",
            }}
          >
            {CUENCAS.map((c, i) => {
              const cfg = LEVELS[c.level];
              const isActive = activeIdx === i;
              const dot = dotPositions[c.id];
              return (
                <div
                  key={c.id}
                  data-map-cuenca={i}
                  style={{
                    position: "absolute",
                    left: dot.x + "%",
                    top: dot.y + "%",
                    transform: "translate(-50%,-50%)",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.45s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: isMobile ? 2 : 4,
                  }}
                >
                  {/* Anillo pulsante */}
                  <div
                    style={{
                      position: "absolute",
                      width: ringSize,
                      height: ringSize,
                      borderRadius: "50%",
                      border: `${isMobile ? 1 : 1.5}px solid ${cfg.color}`,
                      animation: isActive
                        ? "ringPulse 1.6s ease-out infinite"
                        : "none",
                      opacity: 0.7,
                    }}
                  />
                  {/* Dot */}
                  <div
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: "50%",
                      background: cfg.color,
                      flexShrink: 0,
                      boxShadow: `0 0 0 ${isMobile ? 2 : 4}px ${cfg.color}33, 0 0 ${isMobile ? 6 : 14}px ${cfg.color}`,
                    }}
                  />
                  {/* Nombre cuenca */}
                  <span
                    style={{
                      fontSize: labelSize,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "0.04em",
                      textShadow:
                        "0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                      marginTop: isMobile ? 1 : 2,
                    }}
                  >
                    {c.shortName}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Viñeta radial */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center,transparent 40%,rgba(13,21,23,0.6) 100%)",
          }}
        />

        {/* ── Leyenda — solo desktop (en mobile va incrustada en cada frame) ── */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              bottom: "clamp(16px,3vw,32px)",
              right: "clamp(12px,2vw,32px)",
              zIndex: 30,
              background: "rgba(18,24,27,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: isMobile
                ? "8px 10px"
                : "clamp(10px,1.5vw,18px) clamp(12px,1.8vw,22px)",
              backdropFilter: "blur(14px)",
              minWidth: isMobile ? "auto" : "clamp(160px,18vw,220px)",
            }}
          >
            <p
              style={{
                color: "#90A4AE",
                fontSize: isMobile ? 8 : "clamp(9px,1vw,10px)",
                letterSpacing: "0.14em",
                fontWeight: 700,
                margin: "0 0 8px",
                textTransform: "uppercase",
              }}
            >
              Leyenda
            </p>
            {Object.entries(LEVELS).map(([key, cfg]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: isMobile ? 6 : 10,
                  marginBottom: isMobile ? 5 : 8,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 8 : 12,
                    height: isMobile ? 8 : 12,
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 2,
                    background: cfg.color,
                    boxShadow: `0 0 6px ${cfg.color}`,
                  }}
                />
                <div>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: isMobile ? 9 : "clamp(10px,1.1vw,12px)",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {cfg.label}
                  </p>
                  {!isMobile && (
                    <p
                      style={{
                        color: "#78909C",
                        fontSize: "clamp(9px,0.9vw,11px)",
                        margin: "1px 0 0",
                      }}
                    >
                      {cfg.sub}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Card detalle cuenca activa — solo desktop (en mobile va en el frame) ── */}
        {!isMobile && (
          <div
            data-map-card={activeIdx}
            style={{
              position: "absolute",
              top: "clamp(100px,13vw,160px)",
              left: "clamp(12px,2vw,28px)",
              zIndex: 30,
              width: isMobile
                ? "clamp(170px,55vw,210px)"
                : "clamp(200px,22vw,260px)",
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s, transform 0.4s",
              pointerEvents: "none",
            }}
          >
            {active && activeCfg && (
              <div
                style={{
                  background: "rgba(13,21,23,0.96)",
                  border: `1.5px solid ${activeCfg.color}`,
                  borderRadius: 12,
                  padding: isMobile
                    ? "10px 12px"
                    : "clamp(10px,1.5vw,14px) clamp(12px,1.8vw,18px)",
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${activeCfg.color}22`,
                }}
              >
                {/* Badge nivel */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: isMobile ? 5 : 8,
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? 6 : 8,
                      height: isMobile ? 6 : 8,
                      borderRadius: "50%",
                      background: activeCfg.color,
                      boxShadow: `0 0 8px ${activeCfg.color}`,
                    }}
                  />
                  <span
                    style={{
                      color: activeCfg.color,
                      fontSize: isMobile ? 8 : "clamp(9px,0.9vw,10px)",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {activeCfg.label}
                  </span>
                </div>
                {/* Nombre cuenca */}
                <p
                  style={{
                    color: "#cfd8dc",
                    fontSize: isMobile ? 9 : "clamp(10px,1vw,12px)",
                    fontWeight: 600,
                    margin: "0 0 3px",
                  }}
                >
                  {active.name}
                </p>
                {/* Valor principal */}
                <p
                  style={{
                    color: "#fff",
                    fontSize: isMobile
                      ? "clamp(13px,4vw,15px)"
                      : "clamp(16px,2vw,22px)",
                    fontWeight: 900,
                    margin: "0 0 3px",
                    lineHeight: 1,
                  }}
                >
                  {active.contaminant}:{" "}
                  <span style={{ color: activeCfg.color }}>{active.value}</span>
                </p>
                {/* Excedencia */}
                <p
                  style={{
                    color: "#90A4AE",
                    fontSize: isMobile ? 8 : "clamp(10px,1vw,11px)",
                    margin: "0 0 10px",
                  }}
                >
                  Excede límite:{" "}
                  <strong style={{ color: "#fff" }}>{active.excede}</strong>
                </p>
                {/* Indicador de progreso (barras) */}
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  {CUENCAS.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: 3,
                        borderRadius: 2,
                        width:
                          i === activeIdx
                            ? isMobile
                              ? 14
                              : 18
                            : isMobile
                              ? 3
                              : 4,
                        background:
                          i === activeIdx
                            ? activeCfg.color
                            : i < activeIdx
                              ? activeCfg.color + "66"
                              : "rgba(255,255,255,0.12)",
                        transition: "all 0.35s",
                      }}
                    />
                  ))}
                  <span
                    style={{
                      color: "#546E7A",
                      fontSize: isMobile ? 8 : 10,
                      marginLeft: 5,
                    }}
                  >
                    {activeIdx + 1}/{CUENCAS.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Título — solo en la primera imagen; desaparece al hacer zoom ── */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 60 : 80,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 30,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            opacity: active ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: isMobile
                ? "clamp(11px,3.5vw,14px)"
                : "clamp(13px,2vw,20px)",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}
          >
            CONCENTRACIÓN DE METALES POR CUENCA
          </h2>
        </div>

        {/* ── Botón abrir editor (dev) — oculto en desktop y móvil ── */}
        {DEV_EDITOR && !showEditor && (
          <button
            onClick={() => setShowEditor(true)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 40,
              background: "rgba(10,16,20,0.85)",
              border: `1px solid ${isMobile ? "#7B61FF55" : "#E91E8C55"}`,
              color: isMobile ? "#7B61FF" : "#E91E8C",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 9,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              backdropFilter: "blur(10px)",
            }}
          >
            {isMobile ? "📱" : "🖥"} Editor
          </button>
        )}
      </div>

      {/* ── Panel editor ── */}
      {showEditor && (
        <EditorPanel
          device={isMobile ? "mobile" : "desktop"}
          accentColor={isMobile ? "#7B61FF" : "#E91E8C"}
          zoomTargets={zoomTargets}
          dotPositions={dotPositions}
          activeId={activeId}
          onZoomChange={handleZoom}
          onDotChange={handleDot}
          onClose={() => setShowEditor(false)}
        />
      )}

      <style>{`
        @keyframes nudge {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(7px); }
        }
        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
