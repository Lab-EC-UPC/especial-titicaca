import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "../utils/timeline";
import { Message } from "../components/animations/Message";
import { ChapterTitle } from "../components/animations/ChapterTitle";
import { Title } from "../components/animations/Title";
import { CycleStep } from "../components/animations/CycleStep";
import pcVid01 from "../Capachica/capachica_pc_01.mp4";
import pcVid02 from "../Capachica/capachica_pc_02.mp4";
import pcVid03 from "../Capachica/capachica_pc_03.mp4";
import pcVid04 from "../Capachica/capachica_pc_04.mp4";
import celVid01 from "../Capachica/capachica_cel_01.mp4";
import celVid02 from "../Capachica/capachica_cel_02.mp4";
import celVid03 from "../Capachica/capachica_cel_03.mp4";
import celVid04 from "../Capachica/capachica_cel_04.mp4";
import { TestimonialSection } from "./TestimonialSection";
import { TriangulacionSection } from "../TriangulacionSection";
import { TotoraSection } from "../Totora";
import { EndingGradientOverlay } from "../components/animations/EndingGradientOverlay";


gsap.registerPlugin(useGSAP);

// Fondo de Capachica troceado en 4 segmentos consecutivos (pc = desktop,
// cel = móvil). Ver utils/timeline.ts: se scrubbean como una sola línea
// continua para lograr scrub fluido + carga progresiva.
const PC_SEGMENTS = [pcVid01, pcVid02, pcVid03, pcVid04];
const CEL_SEGMENTS = [celVid01, celVid02, celVid03, celVid04];

export const CapachicaSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.innerWidth < 640,
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useGSAP(
        (_context, contextSafe) => {
            const section = sectionRef.current;
            const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
            if (!section || videos.length !== PC_SEGMENTS.length) return;

            const sources = isMobile ? CEL_SEGMENTS : PC_SEGMENTS;

            // Asigna la fuente (pc/cel) sobre los MISMOS elementos <video>, sin
            // remontarlos. load() arranca la carga de metadata; el video se
            // engancha al scrub en cuanto conoce su duración.
            videos.forEach((v, i) => {
                if (v.getAttribute("src") !== sources[i]) {
                    v.setAttribute("src", sources[i]);
                    v.load();
                }
            });

            // P1: el timeline (pin + textos) se construye YA, sin esperar al
            // video. Así los textos nunca quedan rehenes de la carga de los
            // clips; el scrub del video se incorpora solo cuando hay duración.
            const timeline = createScrollTimeline(section, videos);

            const onVisibility = contextSafe!(() => {
                if (document.hidden) videos.forEach((v) => v.pause());
            });

            document.addEventListener("visibilitychange", onVisibility);

            return () => {
                document.removeEventListener("visibilitychange", onVisibility);
                timeline.scrollTrigger?.kill();
                timeline.kill();
            };
        },
        { scope: sectionRef, dependencies: [isMobile] },
    );

    return (
        <section
            ref={sectionRef}
            id="capachica-animation1"
            data-crossfade-in="1"
            className="relative isolate h-[100dvh] w-full overflow-hidden bg-black"
            // Cross-dissolve de entrada: solapa 50vh con el carrusel previo y
            // parte invisible; la timeline la funde (autoAlpha 0→1). Con
            // visibility:hidden inicial los overlays interactivos no capturan
            // eventos hasta que la sección es visible.
            style={{ marginTop: "-50vh", opacity: 0 }}
        >
            {/* ── Fondo de video: 4 segmentos apilados; solo el activo es ──
                visible. La fuente (pc/cel) se asigna por JS según isMobile. */}
            {PC_SEGMENTS.map((_, i) => (
                <video
                    key={i}
                    ref={(el) => {
                        videoRefs.current[i] = el;
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "metadata"}
                />
            ))}

            {/* ── Gradiente sutil ──────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.04)_45%,rgba(0,0,0,0.2))]" />

            {/* ── Blend superior con la sección previa (carrusel FloraFauna,
                #2e3440) para que el empalme no muestre línea ─────────────── */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
                style={{
                    height: "20vh",
                    background:
                        "linear-gradient(to bottom, #2e3440 0%, rgba(46,52,64,0) 100%)",
                }}
            />

            {/* ── Blend inferior persistente hacia #2E343C (= Denuncias), para
                que el borde de reposo no muestre línea con la sección que sigue
                (el EndingGradientOverlay es transitorio y se desvanece). ──── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
                style={{
                    height: "24vh",
                    background:
                        "linear-gradient(to top, #2E343C 0%, rgba(46,52,60,0) 100%)",
                }}
            />

            {/* ── Overlays ─────────────────────────────────────────────────── */}

            {/* 1. Párrafo introductorio totora */}
            <Message start={0.0} end={0.08}>
                Los <b>totorales</b> del lago se están reduciendo drásticamente. <b>Esta planta es
                vital</b> porque purifica el agua de forma natural y sostiene la economía de
                la zona (pesca, artesanía y forraje). Pobladores de <b>Capachica</b> reportan
                que las <b>deformaciones</b> en la planta han suspendido su uso tradicional
                para consumo alimenticio.
            </Message>

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

            <Message start={0.16} end={0.20}>
                La <b>contaminación</b> del lago Titicaca está afectando directamente
                la calidad de vida de aproximadamente <b>42 mil habitantes</b>,
                especialmente de quienes viven en las <b>islas flotantes</b> y en sus 
                <b> orillas</b>. Estas comunidades dependen del lago para actividades
                esenciales <b>como la pesca, el acceso al agua y el turismo.</b>
            </Message>

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
            <Message start={0.53} end={0.58}>
                Los entrevistados reportan frecuentes <b>problemas gastrointestinales
                afecciones en la piel y dolores de cabeza</b> asociados al contacto con ríos
                y canales. Mientras que, los <b>productores de Capachica</b> describen casos
                de infecciones oculares, pérdida de peso y deterioro físico en <b>alpacas y
                vacunos,</b> situaciones que terminan con el sacrificio de los animales.
            </Message>

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

            <Message start={0.67}  end={0.71} >
                También se reportan casos de <b>enfermedades renales</b> que atribuyen a
                años de exposición a metales pesados. Los monitoreos han identificado
                arsénico, plomo y mercurio en distintos ríos de la cuenca, sustancias
                asociadas a <b>daños crónicos</b> en los riñones y el sistema nervioso.
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

            <Message start={0.82} end={0.86}>
                Los <b>reclamos de las comunidades</b> no son recientes. Desde hace más de
                una década, pobladores de distintas provincias de Puno <b>alertan sobre
                descargas</b> que llegan a ríos y afluentes vinculados al Titicaca.
            </Message>

            <Message start={0.87} end={0.92}>
                Aunque los riesgos han sido reconocidos por las autoridades, muchas
                <b> comunidades</b> siguen enfrentando <b>dificultades para acceder a atención
                especializada</b>. A ello se suman retrasos en proyectos de infraestructura
                sanitaria que permanecen pendientes en la región.
            </Message>

            {/* 6. Título del capítulo promesas sin respuestas */}
            <EndingGradientOverlay start={0.94} end={1.00} />

            <ChapterTitle
                start={0.94}
                end={1.00}
                title={"Promesas sin respuestas"}
                description={"Durante la última década, el Estado peruano diseñó e implementó mecanismos de inversión pública orientados a la mitigación ambiental y optimización del tratamiento de aguas residuales en la región Puno."}
            />

            {/* ── Cortina de salida: la timeline la disuelve a #2E343C (= tope de
                Denuncias) al final del scroll, para que el empalme con la
                siguiente sección sea un cross-dissolve y no una línea. ──────── */}
            <div
                data-fade-cover
                data-fade-to="1"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[40]"
                style={{ opacity: 0, background: "#2E343C" }}
            />
        </section>
    );
};