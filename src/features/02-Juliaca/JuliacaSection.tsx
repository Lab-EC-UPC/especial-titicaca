import { useEffect, useRef } from "react";
import { createScrollTimeline } from "./timeline";

import videoSrc from "./assets/video.mp4";

export const JuliacaSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const video = videoRef.current;
        if (!section || !video) return;

        let timeline: ReturnType<typeof createScrollTimeline> | null = null;

        const setupTimeline = () => {
            if (timeline) return;
            timeline = createScrollTimeline(section, video);
        };

        if (video.readyState >= 1) {
            setupTimeline();
        } else {
            video.addEventListener("loadedmetadata", setupTimeline, { once: true });
        }

        return () => {
            video.removeEventListener("loadedmetadata", setupTimeline);
            timeline?.kill();
        };
    }, []);

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

            <div
                className="absolute left-6 top-1/2 z-20 max-w-[min(36ch,42vw)] -translate-y-1/2 rounded-xl border border-white/20 bg-black/70 px-4 py-3 text-left opacity-0 backdrop-blur-sm pointer-events-none max-[900px]:left-1/2 max-[900px]:max-w-[84vw] max-[900px]:-translate-x-1/2"
                data-start="0.2"
                data-end="0.4"
            >
                <h3 className="mb-2 text-[1.35rem] font-medium leading-tight">Lorem ipsum dolor sit amet</h3>
                <p className="text-base leading-relaxed text-white/90">
                    Iaculis massa nisl malesuada lacinia integer nunc posuere.
                </p>
            </div>

            <div
                className="absolute right-6 top-1/2 z-20 max-w-[min(36ch,42vw)] -translate-y-1/2 rounded-xl border border-white/20 bg-black/70 px-4 py-3 text-left opacity-0 backdrop-blur-sm pointer-events-none max-[900px]:left-1/2 max-[900px]:right-auto max-[900px]:max-w-[84vw] max-[900px]:-translate-x-1/2"
                data-start="0.6"
                data-end="0.8"
            >
                <p className="text-base leading-relaxed text-white/90">
                    Nulla molestie mattis scelerisque maximus eget fermentum odio.
                </p>
            </div>
        </div>
    );
};
