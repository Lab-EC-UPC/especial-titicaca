import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createVideoTimeline } from "./timeline";
import { useVideoPreload } from "../../hooks/useVideoPreload";

gsap.registerPlugin(useGSAP);

type VideoSectionProps = {
    videoCom: string;
    videoMob: string;
    scrollDistance?: number;
    /** Distancia de scroll (px) específica para móvil. Si se omite, usa
     *  scrollDistance. Permite afinar el ritmo táctil (flick + viewport corto)
     *  sin tocar el de desktop. */
    scrollDistanceMobile?: number;
    refreshPriority?: number;
    /** Empezar a descargar el video de inmediato (1ª sección, above-the-fold). */
    eager?: boolean;
    /** Fundido desde negro al entrar (transición tipo documental). */
    fadeFromBlack?: boolean;
    /** Fundido a negro al salir (transición tipo documental). */
    fadeToBlack?: boolean;
    /** Color de la cortina de fundido (por defecto el teal de sección). */
    fadeColor?: string;
    /** Cross-dissolve: el video se funde (opacity 0→1) por encima de la sección
     *  anterior, que queda visible debajo durante el solapamiento. */
    crossfadeIn?: boolean;
    children: ReactNode;
};

export const VideoSection = ({
    videoCom,
    videoMob,
    scrollDistance = 2000,
    scrollDistanceMobile,
    refreshPriority = 0,
    eager = false,
    fadeFromBlack = false,
    fadeToBlack = false,
    fadeColor = "#151B1B",
    crossfadeIn = false,
    children,
}: VideoSectionProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const videoSrc = isMobile ? videoMob : videoCom;
    // Distancia de pin efectiva: en móvil usa el override si existe.
    const effectiveScrollDistance =
        isMobile && scrollDistanceMobile !== undefined
            ? scrollDistanceMobile
            : scrollDistance;

    // Sube de metadata→auto y bufferiza el video al acercarse la sección.
    // `eager` lo precarga desde el montaje (útil para la 1ª sección).
    useVideoPreload(sectionRef, [videoRef], undefined, eager);

    useGSAP(
        (_context, contextSafe) => {
            const section = sectionRef.current;
            const video = videoRef.current;
            if (!section || !video) return;

            let timeline: ReturnType<typeof createVideoTimeline> | null = null;

            const setupTimeline = contextSafe!(() => {
                if (timeline) return;
                timeline = createVideoTimeline(section, video, effectiveScrollDistance, refreshPriority);
            });

            // Asigna la fuente (com/mob) sobre el MISMO elemento <video>, sin
            // remontarlo. Tras load(), readyState vuelve a 0 y la timeline se
            // (re)construye en loadedmetadata con la duración correcta.
            if (video.getAttribute("src") !== videoSrc) {
                video.setAttribute("src", videoSrc);
                video.load();
            }

            if (video.readyState >= 1) {
                setupTimeline();
            } else {
                video.addEventListener("loadedmetadata", setupTimeline);
            }

            const onVisibility = contextSafe!(() => {
                if (document.hidden) video.pause();
            });

            document.addEventListener("visibilitychange", onVisibility);

            return () => {
                video.removeEventListener("loadedmetadata", setupTimeline);
                document.removeEventListener("visibilitychange", onVisibility);
            };
        },
        { scope: sectionRef, dependencies: [isMobile] },
    );

    return (
        <div
            ref={sectionRef}
            data-crossfade-in={crossfadeIn ? "1" : undefined}
            className="relative isolate h-[100dvh] w-full overflow-hidden bg-black"
            // Cross-dissolve: solapa con la sección previa y parte invisible
            // (la timeline lo funde opacity 0→1). pointer-events:none para no
            // bloquear el contenido interactivo de abajo (p.ej. el iframe del
            // Header) durante el solapamiento.
            style={
                crossfadeIn
                    ? { marginTop: "-50vh", opacity: 0, pointerEvents: "none" }
                    : undefined
            }
        >
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload={eager ? "auto" : "metadata"}
            />

            {children}

            {/* Cortina negra que se disuelve/aparece con el scroll para fundir
                con las secciones contiguas (la anima la timeline si existe). */}
            {(fadeFromBlack || fadeToBlack) && (
                <div
                    data-fade-cover
                    data-fade-from={fadeFromBlack ? "1" : undefined}
                    data-fade-to={fadeToBlack ? "1" : undefined}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[15]"
                    style={{ opacity: fadeFromBlack ? 1 : 0, background: fadeColor }}
                />
            )}
        </div>
    );
};
