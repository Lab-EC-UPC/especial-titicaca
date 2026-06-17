import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Secuencia de imágenes controlada por scroll, dibujada en <canvas>.
 *
 * Es la técnica de los scrollytelling de gama alta (NatGeo "Into the Amazon",
 * Apple AirPods): en vez de hacer *scrub* de un <video> con `currentTime`
 * —que en móvil muestra negro al hacer seek a un keyframe no descargado—,
 * pre-exportamos los fotogramas y en cada tick de scroll pintamos el frame más
 * cercano. No hay decode-seek → scrub "mantequilla" y sin pantallazos negros.
 *
 * ── Cómo generar los frames (ffmpeg) ──────────────────────────────────────
 *   ffmpeg -i clip.mp4 -vf "fps=24,scale=1280:-2" -q:v 80 frames/com_%03d.webp
 *   ffmpeg -i clip.mp4 -vf "fps=24,scale=720:-2"  -q:v 80 frames/mob_%03d.webp
 * Menos fps/lado = menos peso. ~80-200 frames suele bastar.
 *
 * ── Cómo pasar los frames (build-safe con import.meta.glob) ────────────────
 *   const com = import.meta.glob("./frames/com_*.webp", {
 *     eager: true, query: "?url", import: "default",
 *   });
 *   const framesCom = Object.keys(com).sort().map((k) => com[k] as string);
 *   ...
 *   <CanvasSequence framesCom={framesCom} framesMob={framesMob} poster={poster}>
 *     {/* overlays con position:absolute *\/}
 *   </CanvasSequence>
 */
type CanvasSequenceProps = {
    /** URLs de los frames desktop, ya ordenados (0 → N-1). */
    framesCom: string[];
    /** URLs de los frames móvil. Si se omite, usa `framesCom`. */
    framesMob?: string[];
    /** Imagen mostrada mientras precargan los frames (idealmente el frame 0). */
    poster?: string;
    /** Distancia de scroll (px) durante la que la sección queda pineada. */
    scrollDistance?: number;
    /** Prioridad de refresco de ScrollTrigger (orden de pines apilados). */
    refreshPriority?: number;
    /** Cómo encaja la imagen en el canvas. */
    fit?: "cover" | "contain";
    /** Breakpoint (px) para elegir frames móvil vs desktop. */
    mobileBreakpoint?: number;
    className?: string;
    children?: ReactNode;
};

export const CanvasSequence = ({
    framesCom,
    framesMob,
    poster,
    scrollDistance = 2000,
    refreshPriority = 0,
    fit = "cover",
    mobileBreakpoint = 768,
    className = "",
    children,
}: CanvasSequenceProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < mobileBreakpoint : false,
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
        window.addEventListener("resize", check, { passive: true });
        return () => window.removeEventListener("resize", check);
    }, [mobileBreakpoint]);

    const frames = isMobile && framesMob?.length ? framesMob : framesCom;

    useGSAP(
        () => {
            const section = sectionRef.current;
            const canvas = canvasRef.current;
            if (!section || !canvas || frames.length === 0) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const images: HTMLImageElement[] = new Array(frames.length);
            const state = { frame: 0 };
            let lastDrawn = -1;

            // Ajusta el back-store del canvas a px reales (DPR, cap a 2 para no
            // reventar memoria en pantallas retina/móvil).
            const sizeCanvas = () => {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.round(canvas.clientWidth * dpr);
                canvas.height = Math.round(canvas.clientHeight * dpr);
            };

            const drawFrame = (i: number) => {
                const img = images[i];
                if (!img || !img.complete || img.naturalWidth === 0) return;
                const cw = canvas.width;
                const ch = canvas.height;
                const iw = img.naturalWidth;
                const ih = img.naturalHeight;
                const scale =
                    fit === "cover"
                        ? Math.max(cw / iw, ch / ih)
                        : Math.min(cw / iw, ch / ih);
                const dw = iw * scale;
                const dh = ih * scale;
                ctx.clearRect(0, 0, cw, ch);
                ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
                lastDrawn = i;
            };

            // Solo repinta si el frame redondeado cambió (evita trabajo por tick).
            const render = () => {
                const i = Math.round(state.frame);
                if (i !== lastDrawn) drawFrame(i);
            };

            sizeCanvas();

            // Precarga de todos los frames. Al tener el frame 0 ya mostramos el
            // canvas y ocultamos el poster (cross-fade).
            frames.forEach((src, i) => {
                const img = new Image();
                img.decoding = "async";
                const onDone = () => {
                    if (i === Math.round(state.frame)) drawFrame(i);
                    if (i === 0) {
                        sizeCanvas();
                        drawFrame(0);
                        setReady(true);
                    }
                };
                img.onload = onDone;
                img.onerror = onDone;
                img.src = src;
                images[i] = img;
            });

            // Tween 0→N-1 enganchado al scroll (scrub). gsap interpola el valor
            // y `render` pinta el frame redondeado más cercano.
            const tween = gsap.to(state, {
                frame: frames.length - 1,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: `+=${scrollDistance}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    refreshPriority,
                    invalidateOnRefresh: true,
                },
                onUpdate: render,
            });

            const onResize = () => {
                sizeCanvas();
                drawFrame(Math.round(state.frame));
            };
            window.addEventListener("resize", onResize, { passive: true });

            return () => {
                window.removeEventListener("resize", onResize);
                tween.scrollTrigger?.kill();
                tween.kill();
                images.forEach((im) => {
                    im.onload = null;
                    im.onerror = null;
                });
            };
        },
        { scope: sectionRef, dependencies: [isMobile] },
    );

    return (
        <div
            ref={sectionRef}
            className={`relative isolate h-[100dvh] w-full overflow-hidden bg-[#21292C] ${className}`}
        >
            <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

            {/* Poster: visible hasta que el frame 0 esté listo (mata el negro). */}
            {poster && (
                <img
                    src={poster}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                    style={{ opacity: ready ? 0 : 1 }}
                />
            )}

            {children}
        </div>
    );
};
