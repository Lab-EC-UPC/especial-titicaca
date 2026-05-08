import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";

import videoSrc from "./assets/video.mp4";

gsap.registerPlugin(useGSAP);

export const JuliacaSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useGSAP(
        (_context, contextSafe) => {
            const section = sectionRef.current;
            const video = videoRef.current;
            if (!section || !video) return;

            let timeline: ReturnType<typeof createScrollTimeline> | null = null;

            const setupTimeline = contextSafe!(() => {
                if (timeline) return;
                timeline = createScrollTimeline(section, video);
            });

            if (video.readyState >= 1) {
                setupTimeline();
            } else {
                video.addEventListener("loadedmetadata", setupTimeline, { once: true });
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
        { scope: sectionRef },
    );

    return (
        <div ref={sectionRef} className="relative isolate h-screen w-full overflow-hidden bg-black">
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                muted
                playsInline
                preload="auto"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.04)_45%,rgba(0,0,0,0.2))]" />

            <ScrollMessage start={0.1} end={0.2}>
                <p className="text-center text-lg font-light leading-[1.4] tracking-[0.03em] text-white">
                    El olor fétido del río, la ausencia de peces y las enfermedades constantes revelan años de promesas
                    incumplidas.
                </p>
            </ScrollMessage>

            <ScrollMessage start={0.3} end={0.4}>
                <p className="text-center text-lg font-light leading-[1.4] tracking-[0.03em] text-white">
                    Lo que observas aquí es solo una parte del problema. Río arriba se acumulan residuos que continúan
                    avanzando por la cuenca.
                </p>
            </ScrollMessage>

            <ScrollMessage start={0.5} end={0.7}>
                <h2 className="mb-2 text-center text-4xl font-extrabold leading-[1.4] tracking-[0.03em] text-white">
                    CAP 1: JULIACA
                </h2>
                <p className="text-center text-lg font-light leading-[1.4] tracking-[0.03em] text-white">
                    Juliaca concentra más del 80% de las aguas residuales que ingresan a la cuenca del Titicaca.
                </p>
            </ScrollMessage>
        </div>
    );
};
