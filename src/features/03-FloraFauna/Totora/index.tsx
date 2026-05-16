import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronsRightLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

import MitadTotoraSana from "../../../assets/mitad-totora-sana.png";
import MitadTotoraPodrida from "../../../assets/mitad-totora-podrida.png";
import TotoraSana from "../../../assets/totora-sana.png";
import TotoraPodrida from "../../../assets/totora-podrida.png";
import Fondo from "../../../assets/fondo.png";

import { sanaCards, enfermaCards } from "./constants";

export const TotoraSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sanaHalfRef = useRef<HTMLImageElement>(null);

  const [sliderX, setSliderX] = useState(0);
  const [joinPct, setJoinPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartClientX = useRef(0);
  const dragStartSlider = useRef(0);

  const measureJoin = useCallback(() => {
    if (sanaHalfRef.current && containerRef.current) {
      setJoinPct((sanaHalfRef.current.offsetWidth / containerRef.current.offsetWidth) * 100);
    }
  }, []);

  const startDrag = useCallback((clientX: number) => {
    setIsDragging(true);
    dragStartClientX.current = clientX;
    dragStartSlider.current = sliderX;
  }, [sliderX]);

  useEffect(() => {
    window.addEventListener("resize", measureJoin);
    return () => window.removeEventListener("resize", measureJoin);
  }, [measureJoin]);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const containerW = container.offsetWidth;
      const delta = clientX - dragStartClientX.current;
      const next = Math.max(-1, Math.min(1, dragStartSlider.current + (delta / containerW) * 2));
      setSliderX(next);
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const onEnd = () => setIsDragging(false);

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
  const sanaVisible = sliderX > 0.15;
  const enfermaVisible = sliderX < -0.15;
  const labelsOpacity = Math.max(0, 1 - Math.abs(sliderX) * 3.5);

  const SliderIcon =
    sliderX > 0.15 ? ChevronsRight :
    sliderX < -0.15 ? ChevronsLeft :
    ChevronsRightLeft;

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: "100vh" }}>
      <div className="w-full overflow-hidden" style={{ height: "100vh" }}>

        <img src={Fondo} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", userSelect: "none", pointerEvents: "none" }} />

        {/* Cards sana (izquierda) */}
        <div style={{ position: "absolute", top: 0, left: "12%", bottom: 0, zIndex: 30, pointerEvents: "none" }}>
          {sanaCards.map((card, i) => (
            <div key={i} style={{ position: "absolute", top: card.top, left: 0, width: "clamp(120px, 13vw, 170px)", background: "rgba(45,60,70,0.78)", backdropFilter: "blur(6px)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "clamp(11px, 1vw, 13px)", fontWeight: 500, lineHeight: 1.4, opacity: sanaVisible ? 1 : 0, transform: sanaVisible ? "translateX(0)" : "translateX(-18px)", transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s` }}>
              {card.text}
            </div>
          ))}
        </div>

        {/* Cards enferma (derecha) */}
        <div style={{ position: "absolute", top: 0, right: "12%", bottom: 0, zIndex: 30, pointerEvents: "none" }}>
          {enfermaCards.map((card, i) => (
            <div key={i} style={{ position: "absolute", top: card.top, right: 0, width: "clamp(120px, 13vw, 170px)", background: "rgba(45,60,70,0.78)", backdropFilter: "blur(6px)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "clamp(11px, 1vw, 13px)", fontWeight: 500, lineHeight: 1.4, opacity: enfermaVisible ? 1 : 0, transform: enfermaVisible ? "translateX(0)" : "translateX(18px)", transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s` }}>
              {card.text}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="absolute z-20" style={{ top: "55%", right: "calc(50% + 130px)", transform: "translateY(-50%)", opacity: labelsOpacity, transition: "opacity 0.2s ease" }}>
          <span className="font-bold" style={{ fontSize: "clamp(14px, 1.5vw, 20px)", color: "#fff", letterSpacing: "1px" }}>Totora sana</span>
        </div>
        <div className="absolute z-20" style={{ top: "55%", left: "calc(50% + 130px)", transform: "translateY(-50%)", opacity: labelsOpacity, transition: "opacity 0.2s ease" }}>
          <span className="font-bold" style={{ fontSize: "clamp(14px, 1.5vw, 20px)", color: "#fff", letterSpacing: "1px" }}>Totora enferma</span>
        </div>

        {/* Planta */}
        <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-30vh", transform: "translateX(-50%)", zIndex: 10 }}>
          {/* Animación suave de brisa */}
          <motion.div
            animate={isDragging ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
            transition={isDragging
              ? { duration: 0.2 }
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }
            style={{ transformOrigin: "bottom center" }}
          >
            <div ref={containerRef} style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>

              {/* Mitades (estado inicial) */}
              <div style={{ display: "flex", alignItems: "flex-start", opacity: halfOpacity, transition: "opacity 0.15s linear" }}>
                <img ref={sanaHalfRef} src={MitadTotoraSana} alt="Totora sana" draggable={false} onLoad={measureJoin} style={{ height: "80vh", width: "auto", display: "block", userSelect: "none", pointerEvents: "none", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.12))" }} />
                <img src={MitadTotoraPodrida} alt="Totora deteriorada" draggable={false} style={{ height: "80vh", width: "auto", display: "block", userSelect: "none", pointerEvents: "none", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.12))" }} />
              </div>

              {/* Totora sana completa */}
              <img src={TotoraSana} alt="Totora sana completa" draggable={false} style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", height: "80vh", width: "auto", display: "block", userSelect: "none", pointerEvents: "none", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.12))", clipPath: fullSanaClip, opacity: sliderX > 0 ? 1 : 0, zIndex: 5 }} />

              {/* Totora enferma completa */}
              <img src={TotoraPodrida} alt="Totora enferma completa" draggable={false} style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", height: "80vh", width: "auto", display: "block", userSelect: "none", pointerEvents: "none", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.12))", clipPath: fullEnfermaClip, opacity: sliderX < 0 ? 1 : 0, zIndex: 5 }} />

              {/* Línea */}
              <div style={{ position: "absolute", left: lineLeft, top: 0, bottom: 0, width: "4px", background: "rgba(255,255,255,0.9)", transform: "translateX(-50%)", zIndex: 20, pointerEvents: "none" }} />

              {/* Círculo draggable */}
              <div
                onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
                onTouchStart={(e) => startDrag(e.touches[0].clientX)}
                style={{ position: "absolute", left: lineLeft, top: "48%", transform: "translate(-50%, -50%)", width: "42px", height: "42px", borderRadius: "50%", background: "rgba(190,205,215,0.9)", border: "2px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 21, cursor: isDragging ? "grabbing" : "grab", userSelect: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                <SliderIcon size={20} color="#2D3748" strokeWidth={2.5} />
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default TotoraSection;
