import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";
import { Gallery } from "./Gallery";
import "./juliaca.css";

import videoSrc from "./assets/juliaca_com.mp4";
import metalesImage from "./assets/metales_titicaca.png";
import vertimientosImage from "./assets/origen_vertimientos.png";
import galeria01 from "./assets/galeria_01.webp";
import galeria02 from "./assets/galeria_02.webp";
import galeria03 from "./assets/galeria_03.webp";
import galeria04 from "./assets/galeria_04.webp";

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

            <ScrollMessage start={0.05} end={0.15}>
                <ScrollMessage.Paragraph>
                    Lo que observas aquí es solo una parte del problema.
                    <br />
                    Río arriba se acumulan residuos que continúan avanzando por la cuenca.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.2} end={0.3}>
                <ScrollMessage.Chapter>Capítulo I</ScrollMessage.Chapter>
                <ScrollMessage.Heading>
                    CONTAMINACIÓN QUE
                    <br />
                    ARRASTRA COATA
                </ScrollMessage.Heading>
                <ScrollMessage.Paragraph>
                    Las evaluaciones oficiales confirman el acelerado deterioro del río Coata
                    <br />
                    como vía de transporte de la contaminación hacia el Titicaca.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <Gallery
                title="¿Qué revela el paso del tiempo?"
                images={[
                    {
                        src: galeria01,
                        alt: "Descripción de 10 palabras",
                        description: "Descripción de 10 palabras",
                        subtext: "El comercio / 1980",
                    },
                    {
                        src: galeria02,
                        alt: "Descripción de 10 palabras",
                        description: "Descripción de 10 palabras",
                        subtext: "El comercio / 1986",
                    },
                    {
                        src: galeria03,
                        alt: "Descripción de 10 palabras",
                        description: "Descripción de 10 palabras",
                        subtext: "Reynaldo Yucra / 2026",
                    },
                    {
                        src: galeria04,
                        alt: "Descripción de 10 palabras",
                        description: "Descripción de 10 palabras",
                        subtext: "Reynaldo Yucra / 2026",
                    },
                ]}
                start={0.34}
                snap={130}
                transition={70}
            />

            <ScrollMessage start={0.45} end={0.5}>
                <ScrollMessage.Paragraph>
                    De acuerdo con la Autoridad Nacional del Agua (ANA), las zonas bajo
                    <br />
                    alarma máxima en la cuenca aumentaron en la última década.
                    <br />
                    Se registra que los puntos críticos identificados por vertimientos pasó
                    <br />
                    de 8 en el 2015 a 11 en las evaluaciones del 2025.
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
