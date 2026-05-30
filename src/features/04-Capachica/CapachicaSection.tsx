import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";
import "./capachica.css";

import capachicaVideo from "../../assets/backgrounds/capachica.mp4";
import { LifecycleGallery } from "./components/lifecycle/LifecycleGallery";
import { TestimonialGallery } from "./components/testimonials/TestimonialGallery";

import detTotora from "./assets/deterioro_totora.png";
import capachica21 from "./assets/capachica_2_1.png";
import capachica22 from "./assets/capachica_2_2.png";
import capachica23 from "./assets/capachica_2_3.png";

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
                document.removeEventListener(
                    "visibilitychange",
                    onVisibility
                );
            };
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="capachica"
            className="relative isolate h-screen w-full overflow-hidden bg-black"
        >
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={capachicaVideo}
                muted
                playsInline
                preload="auto"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.08)_28%,rgba(0,0,0,0.22))]" />

            <ScrollMessage start={0.03} end={0.12}>
                <div className="flex flex-col items-center gap-8 text-center md:gap-10">
                    <ScrollMessage.Heading>
                        El deterioro de la totora
                    </ScrollMessage.Heading>

                    <ScrollMessage.Image
                        src={detTotora}
                        alt="El deterioro de la totora"
                    />
                </div>
            </ScrollMessage>

            <ScrollMessage.Wide start={0.17} end={0.35}>
                <div className="mx-auto w-full max-w-6xl space-y-12 text-center md:space-y-16">
                    <ScrollMessage.Heading className="mb-6 md:mb-8">
                        Esta reducción afecta la pesca, la alimentación y la
                        economía local
                    </ScrollMessage.Heading>

                    <div className="grid gap-8 text-white md:grid-cols-2 md:gap-10 lg:px-6">
                        <ScrollMessage.Paragraph>
                            ¿Qué no muestran las redes sociales?
                        </ScrollMessage.Paragraph>

                        <ScrollMessage.Paragraph>
                            Detrás de lo que se comparte en redes
                        </ScrollMessage.Paragraph>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
                        <figure className="space-y-3 text-center">
                            <ScrollMessage.Image
                                src={capachica21}
                                alt="Capachica 2 1"
                            />

                            <figcaption className="text-base text-white/85 sm:text-lg">
                                Lorem ipsum dolor sit amet consectetur
                                adipiscing elit quisque faucibus.
                            </figcaption>
                        </figure>

                        <figure className="space-y-3 text-center">
                            <ScrollMessage.Image
                                src={capachica22}
                                alt="Capachica 2 2"
                            />

                            <figcaption className="text-base text-white/85 sm:text-lg">
                                Lorem ipsum dolor sit amet consectetur
                                adipiscing elit quisque faucibus.
                            </figcaption>
                        </figure>

                        <figure className="space-y-3 text-center">
                            <ScrollMessage.Image
                                src={capachica23}
                                alt="Capachica 2 3"
                            />

                            <figcaption className="text-base text-white/85 sm:text-lg">
                                Lorem ipsum dolor sit amet consectetur
                                adipiscing elit quisque faucibus.
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </ScrollMessage.Wide>

            <ScrollMessage start={0.4} end={0.45}>
                <ScrollMessage.Paragraph>
                    Entre los totorales, el recorrido continúa hacia Capachica.
                    Allí, los efectos de la contaminación empiezan a reflejarse
                    en la salud de las familias.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.5} end={0.6}>
                <ScrollMessage.Paragraph>
                    Salimos del lago y avanzamos entre los totorales hacia
                    Capachica. Al alejarnos del agua, la contaminación deja de
                    ser solo ambiental y empieza a impactar en las comunidades.
                    En Capachica, los cambios en el lago se reflejan en la
                    pesca, los cultivos y la salud de las familias.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            <ScrollMessage start={0.65} end={0.75}>
                <ScrollMessage.Heading>
                    CAP 3: SALUD
                </ScrollMessage.Heading>

                <ScrollMessage.Paragraph>
                    Las comunidades dependen del lago, pero el lago ya no es
                    seguro.
                </ScrollMessage.Paragraph>
            </ScrollMessage>

            {/* Lifecycle Gallery */}
            <div
                className="absolute inset-0 z-20 opacity-0 pointer-events-none"
                data-start="0.76"
                data-end="0.84"
                data-pause-video="true"
                data-interactive="true"
            >
                <div className="relative h-full w-full overflow-hidden">
                    <LifecycleGallery />
                </div>
            </div>

            {/* Testimonial Gallery */}
            <div
                className="absolute inset-0 z-30 opacity-0 pointer-events-none"
                data-start="0.85"
                data-end="0.98"
                data-pause-video="true"
                data-interactive="true"
            >
                <div className="relative h-full w-full overflow-hidden">
                    <TestimonialGallery />
                </div>
            </div>

        </section>
    );
};