import { useState, useEffect, useRef } from "react";

// ─── IMÁGENES MOBILE POR CUENCA (frames pre-renderizados) ─────────────────────
import imgAzangaro   from "./assets/cuenca_mobile_azangaro_1.png";
import imgLagunillas from "./assets/cuenca_mobile_lagunillas_2.png";
import imgPucara     from "./assets/cuenca_mobile_pucara_3.png";
import imgIlave      from "./assets/cuenca_mobile_ilave_4.png";
import imgIllpa      from "./assets/cuenca_mobile_illpa_5.png";
import imgSuches     from "./assets/cuenca_mobile_suches_6.png";
import imgRamis      from "./assets/cuenca_mobile_ramis_7.png";
import imgHuancane   from "./assets/cuenca_mobile_huancane_8.png";

// ─── PALETA ───────────────────────────────────────────────────────────────────
const LEVELS = {
  critical: { color: "#E91E8C", label: "CRÍTICO",        sub: "Relaves mineros, drenaje ácido" },
  high:     { color: "#F06292", label: "ALTO",            sub: "Daño bacteriológico" },
  moderate: { color: "#CE93D8", label: "MODERADO",        sub: "Excedencias menores de uso urbano" },
  sin:      { color: "#90A4AE", label: "SIN EXCEDENCIAS", sub: "No se registran excedencias" },
} as const;

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const SCALE        = 2.2;
const MAX_T        = parseFloat(((1 - 1 / SCALE) / 2 * 100).toFixed(1)); // 27.3
const clampT       = (v: number) => Math.max(-MAX_T, Math.min(MAX_T, v));
const clampDot     = (v: number) => Math.max(0, Math.min(100, v));
const DESKTOP_RATIO = 1920 / 1080;
const MOBILE_RATIO  = 412 / 917;
const MOBILE_BP     = 768;

// ─── TIPOS ────────────────────────────────────────────────────────────────────
type LevelKey   = keyof typeof LEVELS;
type CuencaId   = "azangaro"|"lagunillas"|"pucara"|"ilave"|"illpa"|"suches"|"ramis"|"huancane";
interface XY          { x: number; y: number; }
type ZoomTargets   = Record<CuencaId, XY>;
type DotPositions  = Record<CuencaId, XY>;
interface Cuenca {
  id: CuencaId; name: string; shortName: string;
  contaminant: string; value: string; excede: string; level: LevelKey;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CUENCAS: Cuenca[] = [
  { id:"azangaro",   name:"Cuenca Azángaro",   shortName:"Azángaro",  contaminant:"Mercurio", value:"2.15 mg/L",   excede:"2153 veces", level:"critical" },
  { id:"lagunillas", name:"Cuenca Lagunillas",  shortName:"Lagunillas",contaminant:"Hierro",   value:"2.67 mg/L",   excede:"0.6 veces",  level:"sin"      },
  { id:"pucara",     name:"Cuenca Pucará",      shortName:"Pucará",    contaminant:"Hierro",   value:"128.07 mg/L", excede:"25.6 veces", level:"high"     },
  { id:"ilave",      name:"Cuenca Ilave",       shortName:"Ilave",     contaminant:"Arsénico", value:"0.03 mg/L",   excede:"3.4 veces",  level:"moderate" },
  { id:"illpa",      name:"Cuenca Illpa",       shortName:"Illpa",     contaminant:"Aluminio", value:"13.13 mg/L",  excede:"2.6 veces",  level:"moderate" },
  { id:"suches",     name:"Cuencas Suches",     shortName:"Suches",    contaminant:"Aluminio", value:"40.28 mg/L",  excede:"5.0 veces",  level:"high"     },
  { id:"ramis",      name:"Intercuenca Ramis",  shortName:"Ramis",     contaminant:"Hierro",   value:"178.05 mg/L", excede:"35.6 veces", level:"critical" },
  { id:"huancane",   name:"Cuenca Huancané",    shortName:"Huancané",  contaminant:"Cobre",    value:"3.00 mg/L",   excede:"15 veces",   level:"high"     },
];

// ─── COORDENADAS DESKTOP ──────────────────────────────────────────────────────
const ZOOM_DESKTOP: ZoomTargets = {
  azangaro:   { x: 21.2, y:  27.2 },
  lagunillas: { x: 21.7, y: -15.3 },
  pucara:     { x: 21.7, y:  27.2 },
  ilave:      { x: 11.2, y: -27.3 },
  illpa:      { x: 19.7, y:  11.2 },
  suches:     { x:  3.2, y:  27.2 },
  ramis:      { x: 18.7, y:  24.2 },
  huancane:   { x:  2.7, y:  27.2 },
};
const DOTS_DESKTOP: DotPositions = {
  azangaro:   { x: 30.5, y:  8.5 },
  lagunillas: { x: 30.5, y: 57.0 },
  pucara:     { x: 25.5, y: 11.5 },
  ilave:      { x: 41.5, y: 81.5 },
  illpa:      { x: 26.5, y: 41.5 },
  suches:     { x: 45.5, y:  7.0 },
  ramis:      { x: 35.5, y: 24.0 },
  huancane:   { x: 47.0, y: 12.5 },
};

// ─── COORDENADAS MOBILE ───────────────────────────────────────────────────────
const ZOOM_MOBILE: ZoomTargets = {
  azangaro:   { x: 27.2, y:  7.7 },
  lagunillas: { x: 22.7, y: -8.8 },
  pucara:     { x: 23.2, y: 13.2 },
  ilave:      { x: 11.2, y: -9.3 },
  illpa:      { x: 20.7, y:  5.2 },
  suches:     { x:  6.2, y: 11.7 },
  ramis:      { x: 19.2, y:  8.7 },
  huancane:   { x:  4.2, y: 10.7 },
};
const DOTS_MOBILE: DotPositions = {
  azangaro:   { x: 19.0, y: 27.5 },
  lagunillas: { x: 20.5, y: 54.5 },
  pucara:     { x:  9.0, y: 29.0 },
  ilave:      { x: 45.0, y: 85.5 },
  illpa:      { x: 26.0, y: 43.0 },
  suches:     { x: 45.0, y: 13.5 },
  ramis:      { x: 34.0, y: 29.5 },
  huancane:   { x: 47.0, y: 20.0 },
};

// ─── IMAGEN PRE-RENDERIZADA POR CUENCA (solo mobile) ──────────────────────────
// Cada frame ya contiene el mapa con el zoom hecho + punto + nombre + pop-up + leyenda.
const CUENCA_IMAGES: Record<CuencaId, string> = {
  azangaro:   imgAzangaro,
  lagunillas: imgLagunillas,
  pucara:     imgPucara,
  ilave:      imgIlave,
  illpa:      imgIllpa,
  suches:     imgSuches,
  ramis:      imgRamis,
  huancane:   imgHuancane,
};

// ─── HOOK: área real de la imagen (objectFit:contain) ─────────────────────────
function useMapRect(imgRef: React.RefObject<HTMLImageElement | null>, imgRatio: number) {
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  useEffect(() => {
    const compute = () => {
      const el = imgRef.current; if (!el) return;
      const cw = el.clientWidth, ch = el.clientHeight;
      let w: number, h: number;
      if (imgRatio > cw / ch) { w = cw; h = cw / imgRatio; }
      else                     { h = ch; w = ch * imgRatio; }
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
  device, accentColor, zoomTargets, dotPositions, activeId,
  onZoomChange, onDotChange, onClose,
}: {
  device: "desktop" | "mobile"; accentColor: string;
  zoomTargets: ZoomTargets; dotPositions: DotPositions; activeId: CuencaId | null;
  onZoomChange: (id: CuencaId, axis: "x" | "y", val: number) => void;
  onDotChange:  (id: CuencaId, axis: "x" | "y", val: number) => void;
  onClose: () => void;
}) => {
  const [tab, setTab]               = useState<EditorTab>("dots");
  const [selectedId, setSelectedId] = useState<CuencaId | null>(activeId);
  useEffect(() => { if (activeId) setSelectedId(activeId); }, [activeId]);

  const cuenca  = selectedId ? CUENCAS.find(c => c.id === selectedId)! : null;
  const cfg     = cuenca ? LEVELS[cuenca.level] : null;
  const zTarget = selectedId ? zoomTargets[selectedId]  : null;
  const dTarget = selectedId ? dotPositions[selectedId] : null;

  return (
    <div style={{
      position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
      zIndex:200, background:"rgba(10,16,20,0.98)",
      border:"1px solid "+accentColor+"55", borderRadius:14, padding:"14px 18px",
      backdropFilter:"blur(20px)", boxShadow:"0 12px 48px rgba(0,0,0,0.8)",
      width:"min(620px,96vw)", fontFamily:"monospace",
    }}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{background:accentColor+"22",border:"1px solid "+accentColor+"55",color:accentColor,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,letterSpacing:"0.12em",textTransform:"uppercase"}}>
            {device === "desktop" ? "🖥 Desktop" : "📱 Mobile"}
          </span>
          {(["zoom","dots"] as EditorTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{background:tab===t?accentColor:"rgba(255,255,255,0.06)",border:"1px solid "+(tab===t?accentColor:"rgba(255,255,255,0.1)"),color:"#fff",borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              {t === "zoom" ? "⊕ Zoom" : "● Puntos"}
            </button>
          ))}
          <span style={{color:"#546E7A",fontSize:10}}>límite {tab==="zoom"?"±"+MAX_T+"%":"0–100%"}</span>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#546E7A",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
      </div>

      {/* Selector cuencas */}
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        {CUENCAS.map(c => {
          const lc = LEVELS[c.level], sel = selectedId === c.id;
          return (
            <button key={c.id} onClick={() => setSelectedId(c.id)} style={{background:sel?lc.color:"rgba(255,255,255,0.05)",border:"1px solid "+(sel?lc.color:"rgba(255,255,255,0.1)"),color:sel?"#fff":"#8FA0AB",borderRadius:6,padding:"3px 9px",fontSize:11,cursor:"pointer",fontWeight:sel?700:400,whiteSpace:"nowrap"}}>
              {c.shortName}
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      {selectedId && cuenca && cfg ? (
        <>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {(["x","y"] as const).map(axis => {
              const isZoom = tab === "zoom";
              const val    = isZoom ? (zTarget?.[axis] ?? 0) : (dTarget?.[axis] ?? 0);
              const min    = isZoom ? -MAX_T : 0;
              const max    = isZoom ?  MAX_T : 100;
              return (
                <div key={axis} style={{flex:"1 1 210px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"#8FA0AB",fontSize:11}}>
                      {axis==="x" ? (isZoom?"Zoom X (izq←→der)":"Punto X (izq←→der)") : (isZoom?"Zoom Y (↑arr→aba↓)":"Punto Y (↑arr→aba↓)")}
                    </span>
                    <span style={{color:cfg.color,fontSize:13,fontWeight:900}}>{val.toFixed(1)}%</span>
                  </div>
                  <input type="range" min={min} max={max} step={0.5} value={val}
                    onChange={e => { const v = parseFloat(e.target.value); isZoom ? onZoomChange(selectedId,axis,v) : onDotChange(selectedId,axis,v); }}
                    style={{width:"100%",accentColor:cfg.color,height:6,cursor:"pointer"}}
                  />
                </div>
              );
            })}
          </div>
          {/* Output */}
          <div style={{marginTop:10,background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{color:"#546E7A",fontSize:10,display:"block",marginBottom:3}}>
              Copia → {tab==="zoom"?"ZOOM_":"DOTS_"}{device==="desktop"?"DESKTOP":"MOBILE"}
            </span>
            <code style={{color:accentColor,fontSize:11,wordBreak:"break-all"}}>
              {tab==="zoom" && zTarget && `${selectedId}: { x: ${zTarget.x.toFixed(1)}, y: ${zTarget.y.toFixed(1)} }`}
              {tab==="dots" && dTarget && `${selectedId}: { x: ${dTarget.x.toFixed(1)}, y: ${dTarget.y.toFixed(1)} }`}
            </code>
          </div>
        </>
      ) : (
        <p style={{color:"#546E7A",fontSize:12,margin:0,textAlign:"center"}}>Haz scroll o selecciona una cuenca</p>
      )}

      <details style={{marginTop:10}}>
        <summary style={{color:"#546E7A",fontSize:10,cursor:"pointer",userSelect:"none"}}>Ver todos los valores ({tab})</summary>
        <pre style={{marginTop:6,color:"#8FA0AB",fontSize:10,background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"8px 10px",overflow:"auto",maxHeight:150}}>
          {tab === "zoom"
            ? CUENCAS.map(c => "  "+c.id.padEnd(12)+": { x:"+String(zoomTargets[c.id].x.toFixed(1)).padStart(6)+", y:"+String(zoomTargets[c.id].y.toFixed(1)).padStart(6)+" },").join("\n")
            : CUENCAS.map(c => "  "+c.id.padEnd(12)+": { x:"+String(dotPositions[c.id].x.toFixed(1)).padStart(6)+", y:"+String(dotPositions[c.id].y.toFixed(1)).padStart(6)+" },").join("\n")
          }
        </pre>
      </details>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export const MapaTiticacaSection = () => {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const imgDesktopRef = useRef<HTMLImageElement>(null);
  const imgMobileRef  = useRef<HTMLImageElement>(null);

  const [activeIdx, setActiveIdx] = useState(-1);
  const [zoom, setZoom]           = useState({ scale: 1, tx: 0, ty: 0 });
  const [isMobile, setIsMobile]   = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BP : false
  );

  // ── Editor: cambiar a true para activar en desarrollo ──
  const [showEditor, setShowEditor] = useState(false);

  const [zoomD, setZoomD] = useState<ZoomTargets>(() => ({ ...ZOOM_DESKTOP }));
  const [dotsD, setDotsD] = useState<DotPositions>(() => ({ ...DOTS_DESKTOP }));
  const [zoomM, setZoomM] = useState<ZoomTargets>(() => ({ ...ZOOM_MOBILE }));
  const [dotsM, setDotsM] = useState<DotPositions>(() => ({ ...DOTS_MOBILE }));

  const zoomTargets  = isMobile ? zoomM : zoomD;
  const dotPositions = isMobile ? dotsM : dotsD;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const mapRectD = useMapRect(imgDesktopRef, DESKTOP_RATIO);
  const mapRectM = useMapRect(imgMobileRef,  MOBILE_RATIO);
  const mapRect  = isMobile ? mapRectM : mapRectD;

  const activeId: CuencaId | null = activeIdx >= 0 ? CUENCAS[activeIdx].id : null;

  const handleZoom = (id: CuencaId, axis: "x" | "y", val: number) => {
    const c = clampT(val);
    if (isMobile) setZoomM(p => ({ ...p, [id]: { ...p[id], [axis]: c } }));
    else          setZoomD(p => ({ ...p, [id]: { ...p[id], [axis]: c } }));
    if (id === activeId) setZoom(p => ({ ...p, [axis === "x" ? "tx" : "ty"]: c }));
  };
  const handleDot = (id: CuencaId, axis: "x" | "y", val: number) => {
    const c = clampDot(val);
    if (isMobile) setDotsM(p => ({ ...p, [id]: { ...p[id], [axis]: c } }));
    else          setDotsD(p => ({ ...p, [id]: { ...p[id], [axis]: c } }));
  };

  useEffect(() => {
    const SCREENS = 9;
    const onScroll = () => {
      const el = sectionRef.current; if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / (height - window.innerHeight)));
      const idx      = Math.floor(progress * SCREENS) - 1;
      if (idx < 0) { setActiveIdx(-1); setZoom({ scale: 1, tx: 0, ty: 0 }); return; }
      const ci      = Math.min(idx, CUENCAS.length - 1);
      const targets = window.innerWidth < MOBILE_BP ? zoomM : zoomD;
      const t       = targets[CUENCAS[ci].id];
      setActiveIdx(ci);
      setZoom({ scale: SCALE, tx: clampT(t.x), ty: clampT(t.y) });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [zoomD, zoomM]);

  const active    = activeIdx >= 0 ? CUENCAS[activeIdx] : null;
  const activeCfg = active ? LEVELS[active.level] : null;

  const imgTransform  = `scale(${zoom.scale}) translate(${zoom.tx}%,${zoom.ty}%)`;
  const imgTransition = "transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)";

  // Tamaños responsivos del dot/label
  const dotSize    = isMobile ? 8  : 14;
  const ringSize   = isMobile ? 18 : 30;
  const labelSize  = isMobile ? "clamp(6px,2.2vw,8px)" : "clamp(9px,1.1vw,12px)";

  // Progreso (0–1) para barra superior
  const progressPct = active ? ((activeIdx + 1) / CUENCAS.length) * 100 : 0;

  return (
    <div id="mapatiti" ref={sectionRef} style={{ position: "relative", height: "900vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#151B1B" }}>

        {/* ── Barra de progreso (top) ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, height: 2, zIndex: 40,
          width: `${progressPct}%`,
          background: activeCfg ? activeCfg.color : "transparent",
          transition: "width 0.6s ease, background-color 0.5s ease",
          boxShadow: activeCfg ? `0 0 8px ${activeCfg.color}` : "none",
        }} />

        {/* ── Imagen desktop ── */}
        <img
          ref={imgDesktopRef}
          src="/mapa_titicaca.png"
          alt="Mapa Lago Titicaca desktop"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "center",
            transform: imgTransform, transition: imgTransition,
            transformOrigin: "center center", userSelect: "none",
            willChange: "transform", display: isMobile ? "none" : "block",
          }}
        />

        {/* ── Imagen mobile ── */}
        <img
          ref={imgMobileRef}
          src="/mapa_titicaca_mobile.png"
          alt="Mapa Lago Titicaca móvil"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            transform: imgTransform, transition: imgTransition,
            transformOrigin: "center center", userSelect: "none",
            willChange: "transform", display: isMobile ? "block" : "none",
          }}
        />

        {/* ── Mobile: frame pre-renderizado de la cuenca activa ──
             El zoom de la imagen base sigue animando debajo; una vez hecho el
             zoom, la imagen de la cuenca aparece encima (cross-fade). ── */}
        {isMobile && CUENCAS.map((c, i) => (
          <img
            key={c.id}
            src={CUENCA_IMAGES[c.id]}
            alt={c.name}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "center",
              background: "#21292C", // = fondo del frame: las franjas del letterbox se funden, full-screen sin recortar
              opacity: activeIdx === i ? 1 : 0,
              transition: "opacity 0.55s ease",
              transitionDelay: activeIdx === i ? "0.3s" : "0s",
              pointerEvents: "none", userSelect: "none", zIndex: 5,
            }}
          />
        ))}

        {/* ── Overlay dots (siguen el zoom de la imagen) — solo desktop ── */}
        {!isMobile && (
        <div style={{
          position: "absolute",
          left: mapRect.left, top: mapRect.top,
          width: mapRect.width, height: mapRect.height,
          pointerEvents: "none",
          transform: imgTransform,
          transition: imgTransition,
          transformOrigin: "center center",
        }}>
          {CUENCAS.map((c, i) => {
            const cfg      = LEVELS[c.level];
            const isActive = activeIdx === i;
            const dot      = dotPositions[c.id];
            return (
              <div key={c.id} style={{
                position: "absolute",
                left: dot.x + "%", top: dot.y + "%",
                transform: "translate(-50%,-50%)",
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.45s ease",
                display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 2 : 4,
              }}>
                {/* Anillo pulsante */}
                <div style={{
                  position: "absolute",
                  width: ringSize, height: ringSize, borderRadius: "50%",
                  border: `${isMobile ? 1 : 1.5}px solid ${cfg.color}`,
                  animation: isActive ? "ringPulse 1.6s ease-out infinite" : "none",
                  opacity: 0.7,
                }} />
                {/* Dot */}
                <div style={{
                  width: dotSize, height: dotSize, borderRadius: "50%",
                  background: cfg.color, flexShrink: 0,
                  boxShadow: `0 0 0 ${isMobile ? 2 : 4}px ${cfg.color}33, 0 0 ${isMobile ? 6 : 14}px ${cfg.color}`,
                }} />
                {/* Nombre cuenca */}
                <span style={{
                  fontFamily: "'Citizen OT', 'CitizenOT', serif",
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.04em",
                  textShadow: "0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  marginTop: isMobile ? 1 : 2,
                }}>
                  {c.shortName}
                </span>
              </div>
            );
          })}
        </div>
        )}

        {/* Viñeta radial */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center,transparent 40%,rgba(13,21,23,0.6) 100%)",
        }} />

        {/* ── Leyenda — solo desktop (en mobile va incrustada en cada frame) ── */}
        {!isMobile && (
        <div style={{
          position: "absolute",
          bottom: "clamp(16px,3vw,32px)",
          right:  "clamp(12px,2vw,32px)",
          zIndex: 30,
          background: "rgba(18,24,27,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          padding: isMobile
            ? "8px 10px"
            : "clamp(10px,1.5vw,18px) clamp(12px,1.8vw,22px)",
          backdropFilter: "blur(14px)",
          minWidth: isMobile ? "auto" : "clamp(160px,18vw,220px)",
        }}>
          <p style={{ color:"#90A4AE", fontSize: isMobile ? 8 : "clamp(9px,1vw,10px)", letterSpacing:"0.14em", fontWeight:700, margin:"0 0 8px", textTransform:"uppercase" }}>
            Leyenda
          </p>
          {Object.entries(LEVELS).map(([key, cfg]) => (
            <div key={key} style={{ display:"flex", alignItems:"flex-start", gap: isMobile ? 6 : 10, marginBottom: isMobile ? 5 : 8 }}>
              <div style={{ width: isMobile ? 8 : 12, height: isMobile ? 8 : 12, borderRadius:"50%", flexShrink:0, marginTop:2, background:cfg.color, boxShadow:`0 0 6px ${cfg.color}` }} />
              <div>
                <p style={{ color:"#fff", fontSize: isMobile ? 9 : "clamp(10px,1.1vw,12px)", fontWeight:700, margin:0 }}>
                  {cfg.label}
                </p>
                {!isMobile && (
                  <p style={{ color:"#78909C", fontSize:"clamp(9px,0.9vw,11px)", margin:"1px 0 0" }}>{cfg.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ── Card detalle cuenca activa — solo desktop (en mobile va en el frame) ── */}
        {!isMobile && (
        <div style={{
          position: "absolute",
          bottom: "clamp(16px,3vw,28px)",
          left:   "clamp(12px,2vw,28px)",
          zIndex: 30,
          width: isMobile ? "clamp(170px,55vw,210px)" : "clamp(200px,22vw,260px)",
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.4s, transform 0.4s",
          pointerEvents: "none",
        }}>
          {active && activeCfg && (
            <div style={{
              background: "rgba(13,21,23,0.96)",
              border: `1.5px solid ${activeCfg.color}`,
              borderRadius: 12,
              padding: isMobile ? "10px 12px" : "clamp(10px,1.5vw,14px) clamp(12px,1.8vw,18px)",
              backdropFilter: "blur(16px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${activeCfg.color}22`,
            }}>
              {/* Badge nivel */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: isMobile ? 5 : 8 }}>
                <div style={{ width: isMobile ? 6 : 8, height: isMobile ? 6 : 8, borderRadius:"50%", background:activeCfg.color, boxShadow:`0 0 8px ${activeCfg.color}` }} />
                <span style={{ color:activeCfg.color, fontSize: isMobile ? 8 : "clamp(9px,0.9vw,10px)", fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                  {activeCfg.label}
                </span>
              </div>
              {/* Nombre cuenca */}
              <p style={{ color:"#cfd8dc", fontSize: isMobile ? 9 : "clamp(10px,1vw,12px)", fontWeight:600, margin:"0 0 3px" }}>
                {active.name}
              </p>
              {/* Valor principal */}
              <p style={{ color:"#fff", fontSize: isMobile ? "clamp(13px,4vw,15px)" : "clamp(16px,2vw,22px)", fontWeight:900, margin:"0 0 3px", lineHeight:1 }}>
                {active.contaminant}:{" "}
                <span style={{ color: activeCfg.color }}>{active.value}</span>
              </p>
              {/* Excedencia */}
              <p style={{ color:"#90A4AE", fontSize: isMobile ? 8 : "clamp(10px,1vw,11px)", margin:"0 0 10px" }}>
                Excede límite: <strong style={{ color: "#fff" }}>{active.excede}</strong>
              </p>
              {/* Indicador de progreso (barras) */}
              <div style={{ display:"flex", gap:3, alignItems:"center" }}>
                {CUENCAS.map((_, i) => (
                  <div key={i} style={{
                    height: 3, borderRadius: 2,
                    width:  i === activeIdx ? (isMobile ? 14 : 18) : (isMobile ? 3 : 4),
                    background: i === activeIdx ? activeCfg.color : i < activeIdx ? activeCfg.color+"66" : "rgba(255,255,255,0.12)",
                    transition: "all 0.35s",
                  }} />
                ))}
                <span style={{ color:"#546E7A", fontSize: isMobile ? 8 : 10, marginLeft: 5 }}>
                  {activeIdx + 1}/{CUENCAS.length}
                </span>
              </div>
            </div>
          )}
        </div>
        )}

        {/* ── Título ── */}
        <div style={{
          position: "absolute", top: isMobile ? 16 : 20,
          left: "50%", transform: "translateX(-50%)",
          textAlign: "center", zIndex: 30, pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          <h2 style={{
            fontFamily: "'Citizen OT', 'CitizenOT', serif",
            color: "#fff",
            fontSize: isMobile ? "clamp(11px,3.5vw,14px)" : "clamp(13px,2vw,20px)",
            fontWeight: 800, letterSpacing: "0.15em",
            textTransform: "uppercase", margin: 0,
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}>
            Cuenca del Lago Titicaca
          </h2>
          <p style={{
            color: "#546E7A",
            fontSize: isMobile ? "clamp(8px,2.2vw,10px)" : "clamp(9px,1vw,11px)",
            margin: "3px 0 0", letterSpacing: "0.08em",
            fontFamily: "'Citizen OT', 'CitizenOT', serif",
          }}>
            Monitoreo de contaminantes · 8 cuencas hidrográficas
          </p>
        </div>

        {/* ── Scroll hint (solo al inicio) ── */}
        {!active && (
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            textAlign: "center", zIndex: 30, animation: "nudge 2s ease-in-out infinite",
          }}>
            <p style={{ color:"#546E7A", fontSize:"clamp(8px,1vw,11px)", letterSpacing:"0.12em", margin:"0 0 6px", fontFamily:"'Citizen OT','CitizenOT',serif" }}>
              SCROLL PARA EXPLORAR
            </p>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v14M3 10l6 6 6-6" stroke="#546E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {/* ── Botón abrir editor (dev) — oculto en desktop y móvil ── */}
        {false && !showEditor && (
          <button
            onClick={() => setShowEditor(true)}
            style={{
              position:"absolute", top:16, right:16, zIndex:40,
              background:"rgba(10,16,20,0.85)",
              border:`1px solid ${isMobile ? "#7B61FF55" : "#E91E8C55"}`,
              color: isMobile ? "#7B61FF" : "#E91E8C",
              borderRadius:8, padding:"5px 10px",
              fontSize:9, fontWeight:700, cursor:"pointer",
              letterSpacing:"0.1em", textTransform:"uppercase",
              backdropFilter:"blur(10px)",
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