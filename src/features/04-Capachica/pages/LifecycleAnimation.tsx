import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "../utils/timeline";
import { IntroMessage } from "../components/animations/IntroMessage";
import { ChapterTitle } from "../components/animations/ChapterTitle";
import { CycleTitle } from "../components/animations/CycleTitle";
import { CycleStep } from "../components/animations/CycleStep";
import animationVideo from "../assets/videos/animation-1.mp4";

gsap.registerPlugin(useGSAP);

export const LifecycleAnimation = () => {
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

            {/* 1. Párrafo introductorio */}
            <IntroMessage
                start={0.0}
                end={0.15}
                text="El colapso ambiental del lago ya cruzó la orilla: la contaminación del agua está golpeando directamente la salud y la vida de las comunidades ribereñas."
            />

            {/* 2. Título del capítulo */}
            <ChapterTitle
                start={0.18}
                end={0.28}
                label="Capítulo III"
                title={"Riesgos de salud en\nlas zonas ribereñas"}
                description="En los distritos y comunidades adyacentes al río Coata y al litoral del Titicaca, la exposición a fuentes de agua contaminada coincide con la prevalencia de cuadros clínicos específicos en la población."
            />

            {/* 3. Título del ciclo — persiste durante toda la secuencia A-D */}
            <CycleTitle start={0.31} end={0.41} title="Ciclo de contagio" />

            {/* 4. Paso A */}
            <CycleStep
                start={0.32}
                end={0.41}
                step="A"
                text="El agua contaminada descompone la planta de totora, que luego es ingerida por la oveja."
            />

            {/* 5. Paso B */}
            <CycleStep
                start={0.44}
                end={0.54}
                step="B"
                text="La oveja infectada comienza a desarrollar graves efectos físicos como ceguera, legañas, lagrimeo y cojeo."
            />

            {/* 6. Paso C */}
            <CycleStep
                start={0.57}
                end={0.67}
                step="C"
                text="Ante la necesidad, los pobladores deciden sacrificar al animal enfermo para consumir su carne."
            />

            {/* 7. Paso D */}
            <CycleStep
                start={0.72}
                end={0.83}
                step="D"
                text="Al consumir la carne contaminada, los pobladores se enferman y desarrollan severos problemas gastrointestinales agudos."
            />

            {/* Párrafo final del Ciclo de Vida */}

            <IntroMessage
                start={0.86}
                end={0.95}
                text="Los registros de entrevistas locales indican recurrencia de patologías gastrointestinales, dermatitis por contacto, cefaleas crónicas y afecciones respiratorias tras la interacción directa con el recurso hídrico. Asimismo, en el sector ganadero de Capachica, se documentan morbilidades en el ganado alpaquero y vacuno, caracterizadas por infecciones oculares, desnutrición y descarte forzoso de animales."
            />
        </section>
    );
};