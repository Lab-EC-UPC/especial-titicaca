import { useState, useEffect, useRef } from "react";
import { lenisScrollTo } from "../hooks/useSmoothScroll";

const SECTIONS = [
  { id: "juliaca", label: "Juliaca", short: "01" },
  { id: "florafauna", label: "floraFauna", short: "02" },
  { id: "capachica", label: "capachica", short: "03" },
  { id: "denuncias", label: "denuncias", short: "04" },
];

/*
  COORDENADAS DE NAVEGACIÓN
  Imagen base: 280 x 200 px (ancho x alto)
  
  Ajusta estos valores según donde quieras cada punto.
  Para encontrar coordenadas exactas, usa el componente
  CoordFinder que está al final de este archivo.
  
  x = posición horizontal (0=izquierda, 280=derecha)
  y = posición vertical   (0=arriba,   200=abajo)
*/

const NAV_POINTS = [
  { x: 42, y: 39 }, // 01 Inicio
  { x: 192, y: 76 }, // 02 Juliaca
  { x: 172, y: 110 }, // 03 FloraFauna
  { x: 127, y: 121 }, // 04 Capachica
];

// URL de la imagen del lago — pon aquí la ruta a tu imagen
// Opción A: imagen local en /public/titicaca.png  → "/titicaca.png"
// Opción B: imagen en /src/assets/               → importarla arriba
// Opción C: URL externa (la dejamos como placeholder)
const LAKE_IMAGE_URL = "/titicaca.png";

// Dimensiones del mapa (deben coincidir con tu imagen)
const MAP_W = 280;
const MAP_H = 200;

const C = {
  agua: "#0E3A5C",
  aguaMedia: "#1A5580",
  aguaClara: "#2878A8",
  reflejo: "#3E9AC4",
  shimmer: "#6CC0DE",
  profundo: "#061E30",
  noche: "#040F1A",
  tierra: "#6B4020",
  totora: "#C49028",
  totoraPale: "#E0B040",
  nieve: "#EEF6FB",
  cielo: "#A8D4EE",
  activo: "#FFD060",
};

/* COMPONENTE PRINCIPAL*/
export function StickyMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const rippleRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      SECTIONS.forEach((sec, i) => {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= mid) idx = i;
      });
      setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const triggerRipple = (x: number, y: number) => {
    const id = rippleRef.current++;
    setRipple({ x, y, id });
    setTimeout(() => setRipple(null), 1000);
  };

  const goTo = (id: string, x: number, y: number) => {
    triggerRipple(x, y);
    setTimeout(() => {
      lenisScrollTo(`#${id}`);
      if (isMobile) setOpen(false);
    }, 180);
  };

  // En móvil el menú no se muestra (solo desktop).
  if (isMobile) return null;

  return (
    <DesktopMenu
      open={open}
      setOpen={setOpen}
      active={active}
      hovered={hovered}
      setHovered={setHovered}
      ripple={ripple}
      goTo={goTo}
      triggerRipple={triggerRipple}
    />
  );
}

/* MAPA — imagen real + puntos SVG encima*/
function LakeMap({
  active,
  hovered,
  setHovered,
  ripple,
  goTo,
  scale = 1,
}: {
  active: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  ripple: { x: number; y: number; id: number } | null;
  goTo: (id: string, x: number, y: number) => void;
  scale?: number;
}) {
  const W = MAP_W * scale;
  const H = MAP_H * scale;

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      {/* ── Imagen del lago como fondo ── */}
      <img
        src={LAKE_IMAGE_URL}
        alt="Lago Titicaca"
        style={{
          width: W,
          height: H,
          objectFit: "cover",
          borderRadius: "8px",
          display: "block",
          filter: "saturate(1.2) brightness(0.85)",
        }}
      />

      {/* ── SVG overlay encima de la imagen ── */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="ptGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ptGlowStrong">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ripple de click */}
        {ripple && (
          <>
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r="3"
              fill="none"
              stroke={C.shimmer}
              strokeWidth="1.5"
              opacity="0.95"
            >
              <animate
                attributeName="r"
                from="3"
                to="28"
                dur="1s"
                fill="freeze"
              />
              <animate
                attributeName="opacity"
                from="0.95"
                to="0"
                dur="1s"
                fill="freeze"
              />
            </circle>
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r="3"
              fill="none"
              stroke={C.totoraPale}
              strokeWidth="0.8"
              opacity="0.7"
            >
              <animate
                attributeName="r"
                from="3"
                to="17"
                dur="0.65s"
                fill="freeze"
              />
              <animate
                attributeName="opacity"
                from="0.7"
                to="0"
                dur="0.65s"
                fill="freeze"
              />
            </circle>
          </>
        )}

        {/* Puntos de navegación */}
        {SECTIONS.map((sec, i) => {
          const p = NAV_POINTS[i];
          const isActive = active === i;
          const isHov = hovered === i;
          const r = isActive ? 7 : isHov ? 6 : 5;

          return (
            <g
              key={sec.id}
              style={{ cursor: "pointer", pointerEvents: "all" }}
              onClick={() => goTo(sec.id, p.x, p.y)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Ondas si activo */}
              {isActive && (
                <>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="20"
                    fill="none"
                    stroke={C.activo}
                    strokeWidth="0.5"
                    opacity="0.2"
                  >
                    <animate
                      attributeName="r"
                      values="8;22;8"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.25;0;0.25"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="13"
                    fill="none"
                    stroke={C.activo}
                    strokeWidth="0.9"
                    opacity="0.35"
                  >
                    <animate
                      attributeName="r"
                      values="6;15;6"
                      dur="2.8s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.35;0;0.35"
                      dur="2.8s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* Sombra */}
              <circle
                cx={p.x + 1}
                cy={p.y + 2}
                r={r + 1}
                fill={C.noche}
                opacity="0.45"
              />

              {/* Punto */}
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={
                  isActive
                    ? C.activo
                    : isHov
                      ? C.totoraPale
                      : "rgba(238,246,251,0.92)"
                }
                filter={
                  isActive
                    ? "url(#ptGlowStrong)"
                    : isHov
                      ? "url(#ptGlow)"
                      : "none"
                }
              >
                {isActive && (
                  <animate
                    attributeName="r"
                    values={`${r};${r + 1.5};${r}`}
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Núcleo */}
              {(isActive || isHov) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 2.8 : 2.2}
                  fill={isActive ? C.profundo : C.agua}
                  opacity="0.95"
                />
              )}

              {/* Número */}
              <text
                x={p.x}
                y={p.y - r - 3}
                fontSize={isActive || isHov ? "6" : "5"}
                fill={isActive ? C.totoraPale : C.nieve}
                textAnchor="middle"
                opacity={isActive ? 1 : isHov ? 0.95 : 0.7}
                style={{ textShadow: "0 1px 3px #000" }}
              >
                {sec.short}
              </text>

              {/* Tooltip */}
              {(isHov || isActive) &&
                (() => {
                  const bw = sec.label.length * 4.8 + 12;
                  const bx = p.x - bw / 2;
                  const by = p.y + r + 3;
                  return (
                    <g>
                      <rect
                        x={bx}
                        y={by}
                        width={bw}
                        height="13"
                        rx="3"
                        fill={isActive ? C.totora : "rgba(4,15,26,0.92)"}
                        opacity={0.96}
                      />
                      <text
                        x={p.x}
                        y={by + 9}
                        fontSize="5.8"
                        fill={isActive ? C.noche : C.nieve}
                        textAnchor="middle"
                        fontWeight={isActive ? "bold" : "normal"}
                      >
                        {sec.label}
                      </text>
                    </g>
                  );
                })()}
            </g>
          );
        })}

        {/* Rosa de los vientos */}
        <g transform={`translate(${MAP_W - 18}, ${MAP_H - 18})`} opacity="0.7">
          <line
            x1="0"
            y1="-8"
            x2="0"
            y2="8"
            stroke={C.nieve}
            strokeWidth="0.8"
          />
          <line
            x1="-8"
            y1="0"
            x2="8"
            y2="0"
            stroke={C.nieve}
            strokeWidth="0.8"
          />
          <polygon points="0,-8 -2,-4 2,-4" fill={C.totoraPale} />
          <text
            x="0"
            y="-10"
            fontSize="5"
            fill={C.totoraPale}
            textAnchor="middle"
          >
            N
          </text>
        </g>
      </svg>
    </div>
  );
}

/* DESKTOP */
function DesktopMenu({
  open,
  setOpen,
  active,
  hovered,
  setHovered,
  ripple,
  goTo,
  triggerRipple,
}: any) {
  return (
    <>
      <style>{`
        @keyframes td-emerge {
          from { opacity:0; transform:translateY(-50%) translateX(18px) scale(0.94); }
          to   { opacity:1; transform:translateY(-50%) translateX(0) scale(1); }
        }
        @keyframes td-pulse {
          0%,100% { box-shadow:0 4px 20px rgba(5,18,36,0.8),0 0 0 0   rgba(196,144,40,0.5); }
          50%     { box-shadow:0 4px 20px rgba(5,18,36,0.8),0 0 0 7px rgba(196,144,40,0);   }
        }
      `}</style>

      {/* Botón */}
      <button
        onClick={() => {
          triggerRipple(20, 20);
          setOpen((v: boolean) => !v);
        }}
        title="Explorar Lago Titicaca"
        style={{
          position: "fixed",
          top: "50%",
          right: "52px",
          transform: "translateY(-50%)",
          zIndex: 2147483647,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: open
            ? `linear-gradient(135deg,${C.noche},${C.agua})`
            : `linear-gradient(135deg,${C.aguaMedia},${C.profundo})`,
          border: `2px solid ${open ? C.totora : C.reflejo}80`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          overflow: "hidden",
          animation: open ? "none" : "td-pulse 3s ease-in-out infinite",
          transition: "background 0.3s, border 0.3s",
        }}
      >
        {open ? (
          <span
            style={{ color: C.totoraPale, fontSize: "19px", lineHeight: 1 }}
          >
            ✕
          </span>
        ) : (
          <img
            src={LAKE_IMAGE_URL}
            alt="lago"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "cover",
              borderRadius: "50%",
              filter: "saturate(1.3) brightness(0.9)",
            }}
          />
        )}
      </button>

      {/* Label activo */}
      {!open && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: "110px",
            transform: "translateY(-50%)",
            zIndex: 2147483646,
            background: `${C.noche}E0`,
            border: `1px solid ${C.totora}55`,
            borderRadius: "8px 3px 8px 3px",
            padding: "4px 12px",
            pointerEvents: "none",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              color: C.totoraPale,
              fontSize: "8px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            {SECTIONS[active].short}
          </div>
          <div
            style={{
              color: C.nieve,
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >
            {SECTIONS[active].label}
          </div>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: "112px",
            transform: "translateY(-50%)",
            zIndex: 2147483646,
            animation: "td-emerge 0.4s cubic-bezier(0.34,1.1,0.64,1) forwards",
            background: "#2E343C",
            borderRadius: "16px 4px 16px 4px",
            border: `1px solid ${C.aguaMedia}55`,
            boxShadow: `0 32px 80px rgba(4,12,24,0.95),inset 0 1px 0 ${C.reflejo}18`,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px 10px",
              borderBottom: `1px solid ${C.aguaMedia}35`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: C.totoraPale,
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                }}
              >
                3.812 m.s.n.m.
              </div>
              <div
                style={{
                  color: C.nieve,
                  fontSize: "16px",
                  fontStyle: "italic",
                }}
              >
                Lago Titicaca
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: C.cielo,
                  fontSize: "8px",
                  opacity: 0.65,
                }}
              >
                Perú · Bolivia
              </div>
              <div
                style={{
                  color: C.totora,
                  fontSize: "8px",
                  opacity: 0.75,
                }}
              >
                8.372 km²
              </div>
            </div>
          </div>

          {/* Mapa con imagen */}
          <div
            style={{
              padding: "10px 14px 8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LakeMap
              active={active}
              hovered={hovered}
              setHovered={setHovered}
              ripple={ripple}
              goTo={goTo}
              scale={1}
            />
          </div>

        </div>
      )}
    </>
  );
}

/* MOBILE — desactivado por el momento (el menú solo se muestra en desktop) */
/*
function MobileMenu({
  open,
  setOpen,
  active,
  hovered,
  setHovered,
  ripple,
  goTo,
  triggerRipple,
}: any) {
  return (
    <>
      <style>{`
        @keyframes mob-rise {
          from { opacity:0; transform:translateX(-50%) translateY(30px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0);    }
        }
      `}</style>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483645,
            background: "rgba(4,12,24,0.88)",
            backdropFilter: "blur(6px)",
          }}
        />
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "82px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2147483646,
            animation: "mob-rise 0.4s cubic-bezier(0.34,1.1,0.64,1) forwards",
            background: `linear-gradient(160deg,${C.noche},#0c2236)`,
            borderRadius: "16px",
            border: `1px solid ${C.aguaMedia}55`,
            boxShadow: `0 -12px 60px rgba(4,12,24,0.9)`,
            overflow: "hidden",
            width: "min(92vw, 340px)",
          }}
        >
          <div
            style={{
              height: "3px",
              background: `repeating-linear-gradient(90deg,${C.tierra} 0,${C.tierra} 8px,${C.totora} 8px,${C.totora} 16px,${C.aguaMedia} 16px,${C.aguaMedia} 24px,${C.totora} 24px,${C.totora} 32px)`,
            }}
          />
          <div
            style={{
              padding: "10px 16px 6px",
              borderBottom: `1px solid ${C.aguaMedia}30`,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: C.nieve,
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              Lago Titicaca
            </div>
            <div
              style={{
                color: C.totora,
                fontSize: "9px",
                opacity: 0.7,
                alignSelf: "center",
              }}
            >
              3.812 m.s.n.m.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 14px 8px",
            }}
          >
            <LakeMap
              active={active}
              hovered={hovered}
              setHovered={setHovered}
              ripple={ripple}
              goTo={goTo}
              scale={0.88}
            />
          </div>
          <div
            style={{
              height: "3px",
              background: `repeating-linear-gradient(90deg,${C.aguaMedia} 0,${C.aguaMedia} 8px,${C.totora} 8px,${C.totora} 16px,${C.tierra} 16px,${C.tierra} 24px,${C.totora} 24px,${C.totora} 32px)`,
            }}
          />
        </div>
      )}

      <button
        onClick={() => {
          triggerRipple(20, 20);
          setOpen((v: boolean) => !v);
        }}
        style={{
          position: "fixed",
          bottom: "18px",
          right: "18px",
          zIndex: 2147483647,
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: `linear-gradient(135deg,${C.aguaMedia},${C.profundo})`,
          border: `2px solid ${C.reflejo}70`,
          boxShadow: `0 6px 28px rgba(4,12,24,0.8)`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {open ? (
          <span style={{ color: C.totoraPale, fontSize: "20px" }}>✕</span>
        ) : (
          <img
            src={LAKE_IMAGE_URL}
            alt="lago"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
              filter: "saturate(1.3) brightness(0.9)",
            }}
          />
        )}
      </button>
    </>
  );
}
*/
