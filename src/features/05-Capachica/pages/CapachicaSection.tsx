import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "../utils/timeline";
import { Message } from "../components/animations/Message";
import { ChapterTitle } from "../components/animations/ChapterTitle";
import { Title } from "../components/animations/Title";
import { CycleStep } from "../components/animations/CycleStep";
import animationVideo from "../assets/videos/animation.mp4";
import animationVideoMobile from "../assets/videos/animation_mobile.mp4";
import { TestimonialSection } from "./TestimonialSection";
import { TriangulacionSection } from "../TriangulacionSection";
import { TotoraSection } from "../Totora";
import { EndingGradientOverlay } from "../components/animations/EndingGradientOverlay";


gsap.registerPlugin(useGSAP);

export const CapachicaSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoMobileRef = useRef<HTMLVideoElement>(null);

    useGSAP(
        (_context, contextSafe) => {
            const section = sectionRef.current;
            const video = videoRef.current;
            const videoMobile = videoMobileRef.current;
            if (!section || !video || !videoMobile) return;

            const activeVideo =
                window.matchMedia("(min-width: 640px)").matches ? video : videoMobile;

            let timeline: ReturnType<typeof createScrollTimeline> | null = null;

            const setupTimeline = contextSafe!(() => {
                if (timeline) return;
                timeline = createScrollTimeline(section, activeVideo);
            });

            if (activeVideo.readyState >= 1) {
                setupTimeline();
            } else {
                activeVideo.addEventListener("loadedmetadata", setupTimeline, {
                    once: true,
                });
            }

            const onVisibility = contextSafe!(() => {
                if (document.hidden) {
                    video.pause();
                    videoMobile.pause();
                }
            });

            document.addEventListener("visibilitychange", onVisibility);

            return () => {
                activeVideo.removeEventListener("loadedmetadata", setupTimeline);
                document.removeEventListener("visibilitychange", onVisibility);
            };
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            id="capachica-animation1"
            className="relative isolate h-screen w-full overflow-hidden bg-black"
        >
            {/* ── Video de fondo (desktop / tablet) ───────────────────────── */}
            <video
                ref={videoRef}
                className="absolute inset-0 hidden h-full w-full object-cover sm:block"
                src={animationVideo}
                muted
                playsInline
                preload="auto"
            />

            {/* ── Video de fondo (mobile) ──────────────────────────────────── */}
            <video
                ref={videoMobileRef}
                className="absolute inset-0 block h-full w-full object-cover sm:hidden"
                src={animationVideoMobile}
                muted
                playsInline
                preload="auto"
            />

            {/* ── Gradiente sutil ──────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.04)_45%,rgba(0,0,0,0.2))]" />

            {/* ── Overlays ─────────────────────────────────────────────────── */}

            {/* 1. Párrafo introductorio totora */}

            <Message
                start={0.0}
                end={0.08}
                text="Los totorales del lago se están reduciendo drásticamente. Esta planta es vital porque purifica el agua de forma natural y sostiene la economía de la zona (pesca, artesanía y forraje). Pobladores de Capachica reportan que las alteraciones morfológicas en la planta han suspendido su uso tradicional para consumo alimenticio."
            />

            {/* Capítulo de la totora: comparador interactivo (arrastrar ←/→) */}
            <div
                className="absolute inset-0 z-30 opacity-0"
                data-start="0.09"
                data-end="0.16"
                data-pause-video="true"
                data-interactive="true"
            >
                <div className="relative h-full w-full overflow-hidden">
                    <TotoraSection />
                </div>
            </div>

            {/* 2. Párrafo introductorio ciclo de vida */}

            <Message
                start={0.16}
                end={0.20}
                text="La contaminación del lago Titicaca está afectando directamente la calidad de vida de aproximadamente 42 mil habitantes, especialmente de quienes viven en las islas flotantes y en sus orillas. Estas comunidades dependen del lago para actividades esenciales como la pesca, el acceso al agua y el turismo."
            />

            {/* Título del capítulo ciclo de vida */}
            <ChapterTitle
                start={0.22}
                end={0.26}
                title={"Riesgos de salud en\nlas zonas ribereñas"}
                description="La calidad del agua también tiene consecuencias sobre la salud de las comunidades. En las zonas cercanas a los ríos Coata, Ramis, Llallimayo y Suches se registra una alta incidencia de infecciones respiratorias, enfermedades digestivas asociadas a bacterias y parásitos, así como problemas de salud bucal"
            />

            {/* Paso A */}
            <Title start={0.28} end={0.32} title="Ciclo de contagio" />
            <CycleStep
                start={0.29}
                end={0.32}
                step="A"
                text="La oveja come las plantas de totora expuestas a aguas residuales de zonas afectadas"
            />

            {/* Paso B */}
            <CycleStep
                start={0.34}
                end={0.38}
                step="B"
                text="Con el tiempo, desarrolla síntomas como ceguera, lagrimeo, legañas y dificultades para caminar"
            />

            {/* Paso C */}
            <CycleStep
                start={0.40}
                end={0.44}
                step="C"
                text="Ante la necesidad, los pobladores sacrifican al animal para aprovechar su carne"
            />

            {/* Paso D */}
            <CycleStep
                start={0.47}
                end={0.52}
                step="D"
                text="El consumo de carne proveniente de animales enfermos puede provocar problemas gastrointestinales agudos"
            />

            {/* Párrafo final del Ciclo de Vida */}
            <Message
                start={0.53}
                end={0.58}
                text="Los entrevistados reportan frecuentes problemas gastrointestinales, afecciones en la piel y dolores de cabeza asociados al contacto con ríos y canales. Mientras que, los productores de Capachica describen casos de infecciones oculares, pérdida de peso y deterioro físico en alpacas y vacunos, situaciones que terminan con el sacrificio de los animales."
            />

            {/* 3. Sección de Testimonios */}

            <div
                className="absolute inset-0 z-30 opacity-0"
                data-start="0.60"
                data-end="0.67"
                data-pause-video="true"
                data-interactive="true"
            >
                <div className="relative h-full w-full overflow-hidden">
                    <TestimonialSection />
                </div>
            </div>

            {/* Párrafo */}

            <Message
                start={0.67}
                end={0.71}
                text="También se reportan casos de enfermedades renales que atribuyen a años de exposición a metales pesados. Los monitoreos han identificado arsénico, plomo y mercurio en distintos ríos de la cuenca, sustancias asociadas a daños crónicos en los riñones y el sistema nervioso."
                >
            </Message>

            {/* 4. Mapa de Triangulaciones */}
            <div
                className="absolute inset-0 z-30 opacity-0"
                data-start="0.72"
                data-end="0.81"
                data-pause-video="true"
                data-interactive="true"
            >
                <div className="relative h-full w-full overflow-hidden">
                    <TriangulacionSection />
                </div>
            </div>

            {/* 5. Parrafos finales */}

            <Message
                start={0.82}
                end={0.86}
                text="Los reclamos de las comunidades no son recientes. Desde hace más de una década, pobladores de distintas provincias de Puno alertan sobre descargas que llegan a ríos y afluentes vinculados al Titicaca."
                >
            </Message>

            <Message
                start={0.87}
                end={0.92}
                text="Aunque los riesgos han sido reconocidos por las autoridades, muchas comunidades siguen enfrentando dificultades para acceder a atención especializada. A ello se suman retrasos en proyectos de infraestructura sanitaria que permanecen pendientes en la región."
                >
            </Message>

            {/* 6. Título del capítulo promesas sin respuestas */}
            <EndingGradientOverlay start={0.94} end={1.00} />
            
            <ChapterTitle
                start={0.94}
                end={1.00}
                title={"Promesas sin respuestas"}
                description={"Durante la última década, el Estado peruano diseñó e implementó mecanismos de inversión pública orientados a la mitigación ambiental y optimización del tratamiento de aguas residuales en la región Puno."}
            />
        </section>
    );
};