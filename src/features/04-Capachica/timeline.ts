import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

const SCROLL_DISTANCE = 9000;

function getScenes(container: HTMLElement): Scene[] {
    return Array.from(container.querySelectorAll<HTMLElement>("[data-start][data-end]"))
        .map((element) => ({
            element,
            start: Number(element.dataset.start),
            end: Number(element.dataset.end),
        }))
        .filter(
            (scene) =>
                !Number.isNaN(scene.start) &&
                !Number.isNaN(scene.end) &&
                scene.start >= 0 &&
                scene.end <= 1 &&
                scene.start < scene.end,
        );
}

export function createScrollTimeline(container: HTMLElement, video: HTMLVideoElement) {
    const scenes = getScenes(container);

    gsap.set(scenes.map((scene) => scene.element), {
        autoAlpha: 0,
        y: 10,
    });

    gsap.set(video, {
        filter: "blur(0px)",
        willChange: "filter",
    });

    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            start: "top top",
            end: `+=${SCROLL_DISTANCE}`,
        },
    });

    tl.to(
        video,
        {
            currentTime: video.duration,
            duration: 1,
            ease: "none",
        },
        0,
    );

    scenes.forEach((scene) => {
        const fadeDuration = 0.02;

        tl.to(
            scene.element,
            {
                autoAlpha: 1,
                y: 0,
                duration: fadeDuration,
                ease: "power2.out",
            },
            scene.start,
        );

        tl.to(
            video,
            {
                filter: "blur(2px)",
                duration: fadeDuration,
                ease: "power2.out",
            },
            scene.start,
        );

        tl.to(
            scene.element,
            {
                autoAlpha: 0,
                y: -5,
                duration: fadeDuration,
                ease: "power2.in",
            },
            Math.max(scene.end - fadeDuration, scene.start + 0.01),
        );

        tl.to(
            video,
            {
                filter: "blur(0px)",
                duration: fadeDuration,
                ease: "power2.in",
            },
            Math.max(scene.end - fadeDuration, scene.start + 0.01),
        );
    });

    return tl;
}
