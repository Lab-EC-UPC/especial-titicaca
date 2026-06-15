import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

const SCROLL_DISTANCE = 6000;

function getScenes(container: HTMLElement): Scene[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>("[data-start][data-end]"),
    )
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

export function createScrollTimeline(
    container: HTMLElement,
    video: HTMLVideoElement,
    refreshPriority = 0,
): GSAPTimeline {
    const scenes = getScenes(container);

    gsap.set(
        scenes.map((scene) => scene.element),
        {
            autoAlpha: 0,
            y: 10,
        },
    );

    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            start: "top top",
            end: `+=${SCROLL_DISTANCE}`,
            refreshPriority,
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
        // Fade proporcional al ancho de la escena: más ancho que el 0.01
        // original (disolve suave, sin parpadeo) pero limitado para que toda
        // escena alcance opacidad plena y mantenga un "hold" en el medio.
        const span = scene.end - scene.start;
        const fadeDuration = Math.min(0.05, span * 0.4);

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
            scene.element,
            {
                autoAlpha: 0,
                y: -5,
                duration: fadeDuration,
                ease: "power2.in",
            },
            Math.max(scene.end - fadeDuration, scene.start + fadeDuration),
        );
    });

    return tl;
}