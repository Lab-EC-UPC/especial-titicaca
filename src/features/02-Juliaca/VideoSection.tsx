import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createVideoTimeline } from "./timeline";

gsap.registerPlugin(useGSAP);

type VideoSectionProps = {
    videoCom: string;
    videoMob: string;
    scrollDistance?: number;
    children: ReactNode;
};

export const VideoSection = ({
    videoCom,
    videoMob,
    scrollDistance = 2000,
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

    useGSAP(
        (_context, contextSafe) => {
            const section = sectionRef.current;
            const video = videoRef.current;
            if (!section || !video) return;

            let timeline: ReturnType<typeof createVideoTimeline> | null = null;

            const setupTimeline = contextSafe!(() => {
                if (timeline) return;
                timeline = createVideoTimeline(section, video, scrollDistance);
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

            {children}
        </div>
    );
};
