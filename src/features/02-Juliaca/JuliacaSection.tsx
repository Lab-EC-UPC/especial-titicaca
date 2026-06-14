import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";
import { Gallery } from "./Gallery";
import { MapSection } from "./MapSection";
import { VertimientosSection } from "./VertimientosSection";
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

            <ScrollMessage start={0.03} end={0.13}>
                <ScrollMessage.Paragraph>
                    Lo que observas aquí es solo una parte de la historia.
                    <br />
                    Para entender lo que ocurre en el Titicaca, primero hay que mirar al río Coata.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.18} end={0.3}>
                <ScrollMessage.Heading>
                    SIGUIENDO
                    <br />
                    EL CURSO DEL COATA
                </ScrollMessage.Heading>
                <ScrollMessage.Paragraph>
                    Es el el principal receptor de basura de la región, arrastrando cada año
                    <br />
                    más de 4,000 toneladas de residuos sólidos y vertiendo un volumen de aguas
                    <br />
                    residuales equivalente a llenar más de 300 piscinas olímpicas cada año.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <Gallery
                title={
                    isMobile ?
                        <>
                            ¿Qué revela
                            <br />
                            el paso del tiempo?
                        </>
                    :   "¿Qué revela el paso del tiempo?"
                }
                images={[
                    {
                        src: galeria01,
                        description: "Orillas del Lago Titicaca, ciudad de Puno",
                        subtext: "El comercio / 1980",
                    },
                    {
                        src: galeria02,
                        description: "Desborde del lago Titicaca",
                        subtext: "El comercio / 1986",
                    },
                    {
                        src: galeria03,
                        description: "Embarcaciones en el puerto de Puno",
                        subtext: "Reynaldo Yucra / 2026",
                    },
                    {
                        src: galeria04,
                        description: "Embarcaciones en el muelle de Puno",
                        subtext: "Reynaldo Yucra / 2026",
                    },
                ]}
                start={0.34}
                snap={130}
                transition={70}
            />

            <ScrollMessage start={0.4} end={0.5}>
                <ScrollMessage.Paragraph>
                    Los registros de la Autoridad Nacional del Agua (ANA) muestran un deterioro
                    <br />
                    sostenido en la cuenca. En 2015 se identificaron 8 puntos críticos por
                    <br />
                    vertimientos; para 2025 la cifra aumentó a 11 zonas en estado de alerta máxima.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <MapSection start={0.52} />

            <ScrollMessage start={0.55} end={0.65}>
                <ScrollMessage.Paragraph>
                    En el río Coata, el arsénico llegó a triplicar el límite establecido por
                    <br />
                    los Estándares de Calidad Ambiental (ECA) en 2022. También se detectaron
                    <br />
                    niveles elevados de plomo, cobre y zinc. En la cuenca del Ramis, el aluminio
                    <br />
                    alcanzó concentraciones de hasta 478,644 mg/L, más de 95 veces por encima
                    <br />
                    del valor de referencia para la protección del riego y la ganadería.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <VertimientosSection start={0.7} />

            <ScrollMessage start={0.75} end={0.85}>
                <ScrollMessage.Paragraph>
                    La bahía interior de Puno recibe gran parte de los vertimientos que llegan
                    <br />
                    al Titicaca. Allí se han identificado al menos 15 descargas de aguas servidas
                    <br />
                    y los monitoreos registran altas concentraciones de coliformes fecales,
                    <br />
                    incluidas bacterias como E. coli.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.9} end={0.98} background={false}>
                <ScrollMessage.Paragraph>
                    El impacto ya no se limita al agua. La alteración de sus condiciones
                    <br />
                    naturales reduce el oxígeno disponible y favorece la proliferación de
                    <br />
                    plantas flotantes, afectando el equilibrio biológico del lago y las
                    <br />
                    especies que dependen de este ecosistema.
                </ScrollMessage.Paragraph>
            </ScrollMessage>
        </div>
    );
};
