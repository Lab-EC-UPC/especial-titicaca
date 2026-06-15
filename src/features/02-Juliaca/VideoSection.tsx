import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createVideoTimeline } from "./timeline";
import { useVideoPreload } from "../../hooks/useVideoPreload";

gsap.registerPlugin(useGSAP);

type VideoSectionProps = {
    videoCom: string;
    videoMob: string;
    scrollDistance?: number;
    refreshPriority?: number;
    children: ReactNode;
};

export const VideoSection = ({
    videoCom,
    videoMob,
    scrollDistance = 2000,
    refreshPriority = 0,
    children,
}: VideoSectionProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const videoSrc = isMobile ? videoMob : videoCom;

    // Sube de metadata→auto y bufferiza el video al acercarse la sección.
    useVideoPreload(sectionRef, [videoRef]);

    useGSAP(
        (_context, contextSafe) => {
            const section = sectionRef.current;
            const video = videoRef.current;
            if (!section || !video) return;

            let timeline: ReturnType<typeof createVideoTimeline> | null = null;

            const setupTimeline = contextSafe!(() => {
                if (timeline) return;
                timeline = createVideoTimeline(section, video, scrollDistance, refreshPriority);
            });

            // Asigna la fuente (com/mob) sobre el MISMO elemento <video>, sin
            // remontarlo. Tras load(), readyState vuelve a 0 y la timeline se
            // (re)construye en loadedmetadata con la duración correcta.
            if (video.getAttribute("src") !== videoSrc) {
                video.setAttribute("src", videoSrc);
                video.load();
            }

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
        <div ref={sectionRef} className="relative isolate h-[100dvh] w-full overflow-hidden bg-black">
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
            />

            {children}
        </div>
    );
};
