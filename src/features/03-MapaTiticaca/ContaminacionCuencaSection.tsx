import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 8;
const MOBILE_BREAKPOINT = 768;

export const ContaminacionCuencaSection = ({ start }: { start?: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const isStandalone = start === undefined;
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isStandalone) return;
    // Throttle con rAF: a lo sumo una lectura de layout (getBoundingClientRect)
    // por frame, en vez de un reflow síncrono por cada evento de scroll.
    let ticking = false;
    let raf = 0;
    const compute = () => {
      ticking = false;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScrollable);
      // Cross-dissolve de entrada: la capa aparece (opacity 0→1) sobre el último
      // frame del video que queda quieto debajo. Sin negro.
      const FADE = 0.075;
      const op = progress >= FADE ? 1 : progress / FADE;
      if (fadeRef.current)
        fadeRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
      const frame = Math.min(Math.floor(progress * TOTAL_FRAMES) + 1, TOTAL_FRAMES);
      setCurrentFrame(frame); // React descarta el update si el frame no cambió
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    compute(); // Calcular al montar
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isStandalone]);

  // Pre-decodificar los frames para que el cambio de opacidad no produzca un
  // tirón al decodificar un PNG grande justo cuando se vuelve visible.
  useEffect(() => {
    for (let frame = 1; frame <= TOTAL_FRAMES; frame++) {
      const img = new Image();
      img.src = getImageSrc(frame);
      img.decode?.().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const getImageSrc = (frame: number) =>
    isMobile
      ? `/images/cuencasmobil${frame}.png`
      : `/images/cuencas${frame}.png`;

  if (!isStandalone) {
    return (
      <div
        data-vertimientos-section
        data-start={start}
        data-images={TOTAL_FRAMES}
        data-snap={140}
        data-transition={50}
        className="absolute inset-0 z-20 opacity-0 pointer-events-none"
        style={{ background: "#151B1B" }}
      >
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
          <img
            key={`${isMobile ? "mob" : "desk"}-${frame}`}
            src={getImageSrc(frame)}
            alt={`Vertimientos — frame ${frame} de ${TOTAL_FRAMES}`}
            data-vertimientos-frame={frame}
            className="absolute inset-0 w-full h-full object-contain select-none transition-opacity duration-500"
            style={{ opacity: 0 }}
            draggable={false}
          />
        ))}

        <div
          data-vertimientos-title
          className="absolute top-[6%] md:top-[8%] left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none w-full px-4"
          style={{ opacity: 0 }}
        >
          <h2
            className="text-white uppercase tracking-[0.18em] md:tracking-[0.22em] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
          >
            El rastro de los vertimientos
          </h2>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
            <div
              key={frame}
              data-vertimientos-dot={frame}
              className="rounded-full transition-all duration-300"
              style={{
                width: 8,
                height: 8,
                background: "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id="cuencas"
      ref={sectionRef}
      style={{ height: `${TOTAL_FRAMES * 100 + 60}vh`, marginTop: "-60vh" }}
    >
      <div
        ref={fadeRef}
        data-vertimientos-section
        data-start={start ?? 0.67}
        data-images={TOTAL_FRAMES}
        data-snap={140}
        data-transition={50}
        className="sticky top-0 w-full h-screen bg-[#151B1B] overflow-hidden"
        style={{ opacity: 0 }}
      >
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
          <img
            key={`${isMobile ? "mob" : "desk"}-${frame}`}
            src={getImageSrc(frame)}
            alt={`Lago Titicaca — cuenca ${frame} de ${TOTAL_FRAMES}`}
            data-vertimientos-frame={frame}
            loading="eager"
            draggable={false}
            className={[
              "absolute inset-0 w-full h-full object-contain select-none",
              "transition-opacity duration-500",
              frame === currentFrame ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        ))}

        <div
          data-vertimientos-title
          className={`absolute top-[6%] md:top-[8%] left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none w-full px-4 transition-opacity duration-500 ${currentFrame === 1 ? "opacity-100" : "opacity-0"}`}
        >
          <h2
            className="text-white uppercase tracking-[0.18em] md:tracking-[0.22em] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
          >
            El rastro de los vertimientos
          </h2>
        </div>

        {/*Indicador*/}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((frame) => (
            <div
              key={frame}
              data-vertimientos-dot={frame}
              aria-hidden
              className={[
                "rounded-full transition-all duration-300",
                frame === currentFrame
                  ? "w-2.5 h-2.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                  : frame < currentFrame
                  ? "w-2 h-2 bg-white/50"
                  : "w-2 h-2 bg-white/20",
              ].join(" ")}
            />
          ))}
        </div>

        {/*Hint de scroll*/}
        <div
          aria-hidden
          className={[
            "absolute bottom-20 left-1/2 -translate-x-1/2 z-10",
            "flex flex-col items-center gap-2 pointer-events-none",
            "transition-opacity duration-700",
            currentFrame === 1 ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <span className="text-white/40 text-[10px] md:text-xs tracking-[0.4em] uppercase font-light">
            Scroll
          </span>
          {/* Flecha animada */}
          <svg
            className="w-4 h-4 text-white/40 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
