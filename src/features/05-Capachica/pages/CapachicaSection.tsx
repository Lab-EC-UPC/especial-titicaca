import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "../utils/timeline";
import { Message } from "../components/animations/Message";
import { ChapterTitle } from "../components/animations/ChapterTitle";
import { Title } from "../components/animations/Title";
import { CycleStep } from "../components/animations/CycleStep";
import animationVideo from "../assets/videos/animation.mp4";
import { TestimonialSection } from "./TestimonialSection";
import { TriangulacionSection } from "../TriangulacionSection";
import { TotoraSection } from "../Totora";

gsap.registerPlugin(useGSAP);

export const CapachicaSection = () => {
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
                video.addEventListener("loadedmetadata", setupTimeline, {
                    once: true,
                });
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
        <section
            ref={sectionRef}
            id="capachica-animation1"
            className="relative isolate h-screen w-full overflow-hidden bg-black"
        >
            {/* ── Video de fondo ───────────────────────────────────────────── */}
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={animationVideo}
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
                text="El colapso ambiental del lago ya cruzó la orilla: la contaminación del agua está golpeando directamente la salud y la vida de las comunidades ribereñas."
            />

            {/* Título del capítulo ciclo de vida */}
            <ChapterTitle
                start={0.22}
                end={0.26}
                label="Capítulo III"
                title={"Riesgos de salud en\nlas zonas ribereñas"}
                description={"En los distritos y comunidades adyacentes al río Coata y al litoral del Titicaca,\nla exposición a fuentes de agua contaminada coincide con la prevalencia de\ncuadros clínicos específicos en la población."}
            />

            {/* Paso A */}
            <Title start={0.28} end={0.32} title="Ciclo de contagio" />
            <CycleStep
                start={0.29}
                end={0.32}
                step="A"
                text="El agua contaminada descompone la planta de totora, que luego es ingerida por la oveja."
            />

            {/* Paso B */}
            <CycleStep
                start={0.34}
                end={0.38}
                step="B"
                text="La oveja infectada comienza a desarrollar graves efectos físicos como ceguera, legañas, lagrimeo y cojeo."
            />

            {/* Paso C */}
            <CycleStep
                start={0.40}
                end={0.44}
                step="C"
                text="Ante la necesidad, los pobladores deciden sacrificar al animal enfermo para consumir su carne."
            />

            {/* Paso D */}
            <CycleStep
                start={0.47}
                end={0.52}
                step="D"
                text="Al consumir la carne contaminada, los pobladores se enferman y desarrollan severos problemas gastrointestinales agudos."
            />

            {/* Párrafo final del Ciclo de Vida */}
            <Message
                start={0.53}
                end={0.58}
                text="Los registros de entrevistas locales indican recurrencia de patologías gastrointestinales, dermatitis por contacto, cefaleas crónicas y afecciones respiratorias tras la interacción directa con el recurso hídrico. Asimismo, en el sector ganadero de Capachica, se documentan morbilidades en el ganado alpaquero y vacuno, caracterizadas por infecciones oculares, desnutrición y descarte forzoso de animales."
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
                text="Representantes comunitarios de Capachica estiman una población de 8,000 personas en condición de vulnerabilidad por exposición potencial a metales pesados y metaloides. Reportes de usuarios locales detallan la existencia de diagnósticos médicos y tratamientos en curso vinculados a insuficiencia renal crónica."
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
                text="El Ministerio de Salud ha reconocido que los metales pesados, las aguas residuales y los residuos sólidos ponen en riesgo la salud de la población.  Sin embargo, el acceso a servicios de salud sigue siendo insuficiente."
                >
            </Message>

            <Message
                start={0.87}
                end={0.92}
                text="Las demandas civiles y los informes técnicos que alertan sobre esta situación se han mantenido constantes durante la última década"
                >
            </Message>

            {/* 6. Título del capítulo promesas sin respuestas */}
            <ChapterTitle
                start={0.94}
                end={1.00}
                label="Capítulo IV"
                title={"Promesas sin respuestas"}
                description={"Durante la última década, el Estado peruano diseñó e implementó mecanismos de inversión pública orientados a la mitigación ambiental y optimización del tratamiento de aguas residuales en la región Puno."}
            />
        </section>
    );
};