import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";

import videoSrc from "./assets/video.mp4";
import metalesImage from "./assets/metales_titicaca.png";
import vertimientosImage from "./assets/origen_vertimientos.png";

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

            <ScrollMessage start={0.1} end={0.15}>
                <ScrollMessage.Paragraph>
                    El olor fétido del río, la ausencia de peces y las enfermedades constantes revelan años de promesas
                    incumplidas.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.2} end={0.25}>
                <ScrollMessage.Paragraph>
                    Lo que observas aquí es solo una parte del problema. Río arriba se acumulan residuos que continúan
                    avanzando por la cuenca.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.3} end={0.4}>
                <ScrollMessage.Heading>CAP 1: JULIACA</ScrollMessage.Heading>
                <ScrollMessage.Paragraph>
                    Juliaca concentra más del 80% de las aguas residuales que ingresan a la cuenca del Titicaca.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.45} end={0.5}>
                <ScrollMessage.Paragraph>
                    El crecimiento urbano supera los sistemas de tratamiento y los residuos terminan recorriendo el río
                    Coata.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.55} end={0.6}>
                <ScrollMessage.ImageHeading>Metales en el Lago Titicaca y sus cuencas</ScrollMessage.ImageHeading>
                <ScrollMessage.Image src={metalesImage} alt="Metales en el Lago Titicaca y sus cuencas" />
            </ScrollMessage>

            <ScrollMessage start={0.65} end={0.7}>
                <ScrollMessage.Paragraph>
                    El río Coata concentra la mayor carga contaminante. Registra niveles de plomo y mercurio por encima
                    de los límites permitidos.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.75} end={0.8}>
                <ScrollMessage.ImageHeading>Origen de los vertimientos</ScrollMessage.ImageHeading>
                <ScrollMessage.Image src={vertimientosImage} alt="Origen de los vertimientos" />
            </ScrollMessage>

            <ScrollMessage start={0.85} end={0.9}>
                <ScrollMessage.Paragraph>
                    El recorrido de los vertimientos termina en la bahía interior de Puno. El Organismo de Evaluación y
                    Fiscalización Ambiental (OEFA) la identifica como una de las zonas más afectadas del Lago Titicaca.
                </ScrollMessage.Paragraph>
            </ScrollMessage>
        </div>
    );
};
