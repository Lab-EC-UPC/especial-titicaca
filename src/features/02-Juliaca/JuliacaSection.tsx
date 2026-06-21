import { VideoSection } from "./VideoSection";
import { ScrollMessage } from "./ScrollMessage";
import { Gallery } from "./Gallery";
import { MapaTiticacaSection } from "../03-MapaTiticaca/MapaTiticacaSection";
import { ContaminacionCuencaSection } from "../03-MapaTiticaca/ContaminacionCuencaSection";
import "./juliaca.css";

import comVid01 from "./assets/videos/juliaca_bg_com_01.mp4";
import mobVid01 from "./assets/videos/juliaca_bg_mob_01.mp4";
import comVid02 from "./assets/videos/juliaca_bg_com_02.mp4";
import mobVid02 from "./assets/videos/juliaca_bg_mob_02.mp4";
import comVid03 from "./assets/videos/juliaca_bg_com_03.mp4";
import mobVid03 from "./assets/videos/juliaca_bg_mob_03.mp4";

import galeria01 from "./assets/galeria_01.webp";
import galeria02 from "./assets/galeria_02.webp";
import galeria03 from "./assets/galeria_03.webp";
import galeria04 from "./assets/galeria_04.webp";

const GALLERY_IMAGES = [
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
];

export const JuliacaSection = () => {
    return (
        <>
            {/* ── Video 1: intro + gallery ── */}
            <VideoSection
                videoCom={comVid01}
                videoMob={mobVid01}
                scrollDistance={2080}
                refreshPriority={5}
                eager
                crossfadeIn
            >
                <ScrollMessage start={0.058} end={0.25}>
                    <ScrollMessage.Paragraph>
                        Lo que observas aquí es solo una parte de la historia.
                        <br />
                        Para entender lo que ocurre en el Titicaca, primero hay que mirar al río Coata.
                    </ScrollMessage.Paragraph>
                </ScrollMessage>

                <ScrollMessage start={0.346} end={0.577}>
                    <ScrollMessage.Heading>
                        SIGUIENDO
                        <br />
                        EL CURSO DEL COATA
                    </ScrollMessage.Heading>
                    <ScrollMessage.Paragraph>
                        Es el principal receptor de basura de la región, arrastrando cada año
                        <br />
                        más de 4,000 toneladas de residuos sólidos y vertiendo un volumen de aguas
                        <br />
                        residuales equivalente a llenar más de 300 piscinas olímpicas cada año.
                    </ScrollMessage.Paragraph>
                </ScrollMessage>

                <Gallery
                    title="¿Qué revela el paso del tiempo?"
                    images={GALLERY_IMAGES}
                    start={0.654}
                    snap={130}
                    transition={70}
                />

                <ScrollMessage start={0.769} end={0.962}>
                    <ScrollMessage.Paragraph>
                        Los registros de la Autoridad Nacional del Agua (ANA) muestran un deterioro
                        <br />
                        sostenido en la cuenca. En 2015 se identificaron 8 puntos críticos por
                        <br />
                        vertimientos; para 2025 la cifra aumentó a 11 zonas en estado de alerta máxima.
                    </ScrollMessage.Paragraph>
                </ScrollMessage>
            </VideoSection>

            {/* ── Mapa Titicaca (standalone) ── */}
            <MapaTiticacaSection />

            {/* ── Video 2: contaminación química ── */}
            <VideoSection
                videoCom={comVid02}
                videoMob={mobVid02}
                scrollDistance={720}
                refreshPriority={3}
                crossfadeIn
            >
                <ScrollMessage start={0.167} end={0.722}>
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
            </VideoSection>

            {/* ── Contaminación Cuenca (standalone) ── */}
            <ContaminacionCuencaSection />

            {/* ── Video 3: bahía interior + impacto biológico ── */}
            <VideoSection
                videoCom={comVid03}
                videoMob={mobVid03}
                scrollDistance={1200}
                refreshPriority={2}
                crossfadeIn
                fadeToBlack
                fadeColor="#2e3440"
            >
                <ScrollMessage start={0.167} end={0.5}>
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

                <ScrollMessage start={0.667} end={0.933} background={false}>
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
            </VideoSection>
        </>
    );
};
