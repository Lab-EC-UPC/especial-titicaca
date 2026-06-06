import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";
import { Gallery } from "./Gallery";
import "./juliaca.css";

import comVideo from "./assets/juliaca_com.mp4";
import mobVideo from "./assets/juliaca_mob.mp4";

import galeria01 from "./assets/galeria_01.webp";
import galeria02 from "./assets/galeria_02.webp";
import galeria03 from "./assets/galeria_03.webp";
import galeria04 from "./assets/galeria_04.webp";

gsap.registerPlugin(useGSAP);

export const JuliacaSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const videoSrc = isMobile ? mobVideo : comVideo;

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
        { scope: sectionRef, dependencies: [isMobile] },
    );

    return (
        <div ref={sectionRef} className="relative isolate h-screen w-full overflow-hidden bg-black">
            <video
                key={isMobile ? "mob" : "desk"}
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

            <ScrollMessage start={0.4} end={0.5}>
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

            <ScrollMessage start={0.55} end={0.65}>
                <ScrollMessage.Paragraph>
                    Los monitoreos técnicos realizados entre 2022 y 2024 evidencian que
                    <br />
                    las concentraciones de arsénico, plomo, cobre y zinc exceden los
                    <br />
                    Estándares de Calidad Ambiental (ECA) para Agua en múltiples
                    <br />
                    estaciones de muestreo. Específicamente, en la estación de control
                    <br />
                    del río Coata, la concentración de arsénico alcanzó los 0,034 mg/L
                    <br />
                    en 2022, una cifra que triplica el límite máximo permisible establecido
                    <br />
                    en la normativa (0,01 mg/L).
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.75} end={0.85}>
                <ScrollMessage.Paragraph>
                    El recorrido de los vertimientos termina en la bahía interior de Puno.
                    <br />
                    El Organismo de Evaluación y Fiscalización Ambiental (OEFA) la identifica
                    <br />
                    como una de las zonas más afectadas del Lago Titicaca.
                </ScrollMessage.Paragraph>
            </ScrollMessage>
        </div>
    );
};
