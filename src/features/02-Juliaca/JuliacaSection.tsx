import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createScrollTimeline } from "./timeline";
import { ScrollMessage } from "./ScrollMessage";

import videoSrc from "./assets/video.mp4";

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

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.4))]" />

            <ScrollMessage start={0.2} end={0.4}>
                <h3 className="mb-2 text-[1.35rem] font-medium leading-tight">Lorem ipsum dolor sit amet</h3>
                <p className="text-base leading-relaxed text-white/90">
                    Iaculis massa nisl malesuada lacinia integer nunc posuere.
                </p>
            </ScrollMessage>

            <ScrollMessage start={0.6} end={0.8}>
                <p className="text-base leading-relaxed text-white/90">
                    Nulla molestie mattis scelerisque maximus eget fermentum odio.
                </p>
            </ScrollMessage>
        </div>
    );
};
