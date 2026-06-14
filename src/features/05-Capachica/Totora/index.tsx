import { useEffect, useRef, useState, useCallback } from "react";
import { motion, animate } from "motion/react";
import { ChevronsRightLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

import MitadTotoraSana from "../assets/mitad-totora-sana.png";
import MitadTotoraPodrida from "../assets/mitad-totora-podrida.png";
import TotoraSana from "../assets/totora-sana.png";
import TotoraPodrida from "../assets/totora-podrida.png";

import { sanaCards, enfermaCards } from "./constants";
import { InfoCard } from "./InfoCard";

const PLANT_HEIGHT = "clamp(380px, 80vh, 900px)";
const PLANT_SHADOW = "drop-shadow(0 0 2px rgba(0,0,0,0.12))";
const REVEAL_THRESHOLD = 0.15;

const plantImageStyle = {
  height: PLANT_HEIGHT,
  width: "auto",
  display: "block",
  userSelect: "none",
  pointerEvents: "none",
  filter: PLANT_SHADOW,
} as const;

const fullPlantStyle = {
  ...plantImageStyle,
  position: "absolute",
  left: "50%",
  top: 0,
  transform: "translateX(-50%)",
  zIndex: 5,
} as const;

export const TotoraSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sanaHalfRef = useRef<HTMLImageElement>(null);
  const enfermaHalfRef = useRef<HTMLImageElement>(null);

  const [sliderX, setSliderX] = useState(0);
  const [joinPct, setJoinPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartClientX = useRef(0);
  const dragStartSlider = useRef(0);
  const latestSliderRef = useRef(0);
  const snapAnimRef = useRef<{ stop: () => void } | null>(null);

  const measureJoin = useCallback(() => {
    const sana = sanaHalfRef.current;
    const enferma = enfermaHalfRef.current;
    const container = containerRef.current;
    if (!sana || !enferma || !container) return;
    // Esperar a que AMBAS mitades tengan ancho real: un <img> con width:auto
    // mide 0 hasta que carga, lo que en producción (carga asíncrona) daría una
    // costura desfasada (~100%) y movería la barra/handle.
    if (!sana.offsetWidth || !enferma.offsetWidth || !container.offsetWidth) return;
    setJoinPct((sana.offsetWidth / container.offsetWidth) * 100);
  }, []);

  const startDrag = useCallback((clientX: number) => {
    snapAnimRef.current?.stop();
    setIsDragging(true);
    dragStartClientX.current = clientX;
    dragStartSlider.current = sliderX;
    latestSliderRef.current = sliderX;
  }, [sliderX]);

  useEffect(() => {
    measureJoin();
    window.addEventListener("resize", measureJoin);
    return () => window.removeEventListener("resize", measureJoin);
  }, [measureJoin]);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const delta = clientX - dragStartClientX.current;
      const next = Math.max(-1, Math.min(1, dragStartSlider.current + (delta / container.offsetWidth) * 2));
      setSliderX(next);
      latestSliderRef.current = next;
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const onEnd = () => {
      setIsDragging(false);
      const current = latestSliderRef.current;
      const target = Math.abs(current) > REVEAL_THRESHOLD ? Math.sign(current) : 0;
      if (current === target) return;
      snapAnimRef.current = animate(current, target, {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        onUpdate: (v) => {
          setSliderX(v);
          latestSliderRef.current = v;
        },
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging]);

  const lineLeft = `${joinPct + sliderX * 45}%`;
  const halfOpacity = Math.max(0, 1 - Math.abs(sliderX) * 2);
  const fullSanaClip = `inset(0 ${Math.max(0, 1 - sliderX) * 100}% 0 0)`;
  const fullEnfermaClip = `inset(0 0 0 ${Math.max(0, 1 + sliderX) * 100}%)`;
  const sanaVisible = sliderX > REVEAL_THRESHOLD;
  const enfermaVisible = sliderX < -REVEAL_THRESHOLD;
  const labelsOpacity = Math.max(0, 1 - Math.abs(sliderX) * 3.5);

  const SliderIcon =
    sliderX > REVEAL_THRESHOLD ? ChevronsRight :
    sliderX < -REVEAL_THRESHOLD ? ChevronsLeft :
    ChevronsRightLeft;

  return (
    <section className="relative w-full" style={{ height: "100vh" }}>
      <div className="w-full overflow-hidden" style={{ height: "100vh" }}>

        <div
          className="absolute z-30 w-full text-center"
          style={{ top: "clamp(60px, 12vh, 120px)", left: 0, pointerEvents: "none" }}
        >
          <p
            className="uppercase text-white font-semibold"
            style={{
              fontSize: "clamp(11px, 1.2vw, 15px)",
              letterSpacing: "clamp(2px, 0.4vw, 5px)",
            }}
          >
            EL DETERIORO DE LA TOTORA
          </p>
        </div>

        {/* Indicación de arrastre (se desvanece al interactuar) */}
        <div
          className="absolute z-30 w-full text-center"
          style={{
            bottom: "clamp(36px, 8vh, 90px)",
            left: 0,
            pointerEvents: "none",
            opacity: labelsOpacity,
            transition: "opacity 0.2s ease",
          }}
        >
          <p
            className="uppercase text-white/75 font-light"
            style={{
              fontSize: "clamp(9px, 1vw, 13px)",
              letterSpacing: "clamp(1px, 0.3vw, 3px)",
            }}
          >
            Desliza hacia la izquierda o derecha para más información
          </p>
        </div>

        <div style={{ position: "absolute", top: 0, left: "clamp(20px, 16vw, 26%)", bottom: 0, zIndex: 30, pointerEvents: "none" }}>
          {sanaCards.map((card, i) => (
            <InfoCard key={i} text={card.text} top={card.top} side="left" visible={sanaVisible} delay={i * 0.1} />
          ))}
        </div>

        <div style={{ position: "absolute", top: 0, right: "clamp(20px, 16vw, 26%)", bottom: 0, zIndex: 30, pointerEvents: "none" }}>
          {enfermaCards.map((card, i) => (
            <InfoCard key={i} text={card.text} top={card.top} side="right" visible={enfermaVisible} delay={i * 0.1} />
          ))}
        </div>

        <div className="absolute z-20" style={{ top: "55%", right: "calc(50% + clamp(70px, 12vw, 130px))", transform: "translateY(-50%)", opacity: labelsOpacity, transition: "opacity 0.2s ease" }}>
          <span className="font-bold" style={{ fontSize: "clamp(11px, 1.5vw, 20px)", color: "#fff", letterSpacing: "1px" }}>Totora sana</span>
        </div>
        <div className="absolute z-20" style={{ top: "55%", left: "calc(50% + clamp(70px, 12vw, 130px))", transform: "translateY(-50%)", opacity: labelsOpacity, transition: "opacity 0.2s ease" }}>
          <span className="font-bold" style={{ fontSize: "clamp(11px, 1.5vw, 20px)", color: "#fff", letterSpacing: "1px" }}>Totora enferma</span>
        </div>

        <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-30vh", transform: "translateX(-50%)", zIndex: 10 }}>
          <motion.div
            animate={isDragging ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
            transition={isDragging ? { duration: 0.2 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "bottom center" }}
          >
            <div ref={containerRef} style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>

              <div style={{ display: "flex", alignItems: "flex-start", opacity: halfOpacity, transition: "opacity 0.15s linear" }}>
                <img ref={sanaHalfRef}    src={MitadTotoraSana}    alt="Totora sana"         draggable={false} onLoad={measureJoin} style={plantImageStyle} />
                <img ref={enfermaHalfRef} src={MitadTotoraPodrida} alt="Totora deteriorada" draggable={false} onLoad={measureJoin} style={plantImageStyle} />
              </div>

              <img src={TotoraSana}    alt="Totora sana completa"    draggable={false} style={{ ...fullPlantStyle, clipPath: fullSanaClip,    opacity: sliderX > 0 ? 1 : 0 }} />
              <img src={TotoraPodrida} alt="Totora enferma completa" draggable={false} style={{ ...fullPlantStyle, clipPath: fullEnfermaClip, opacity: sliderX < 0 ? 1 : 0 }} />

              <div style={{ position: "absolute", left: lineLeft, top: 0, bottom: 0, width: "4px", background: "rgba(255,255,255,0.9)", transform: "translateX(-50%)", zIndex: 20, pointerEvents: "none" }} />

              <div
                onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
                onTouchStart={(e) => startDrag(e.touches[0].clientX)}
                style={{
                  position: "absolute",
                  left: lineLeft,
                  top: "48%",
                  transform: "translate(-50%, -50%)",
                  width: "clamp(34px, 4.5vw, 48px)",
                  height: "clamp(34px, 4.5vw, 48px)",
                  borderRadius: "50%",
                  background: "#C83C6E",
                  border: "2px solid rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 21,
                  cursor: isDragging ? "grabbing" : "grab",
                  userSelect: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <SliderIcon size={18} color="#ffffff" strokeWidth={2.5} />
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default TotoraSection;
