import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

const getScrollDistance = (sceneCount: number) => {
    const viewportHeight = window.innerHeight || 0;
    const sceneDistance = viewportHeight * Math.max(1.75, sceneCount * 0.75);

    return Math.max(viewportHeight * 1.75, sceneDistance, 1600);
};

export function createScrollTimeline(container: HTMLElement, video: HTMLVideoElement) {
    const scenes: Scene[] = Array.from(
        container.querySelectorAll<HTMLElement>("[data-start][data-end]")
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
                scene.start < scene.end
        );

    const pinTarget = container;

    gsap.set(
        scenes.map((scene) => scene.element),
        {
            autoAlpha: 0,
            y: 30,
        }
    );

    const syncVideo = (progress: number) => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;

        const nextTime = progress * video.duration;
        if (Math.abs(video.currentTime - nextTime) > 0.033) {
            video.currentTime = nextTime;
        }
    };

    const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: container,
            pin: pinTarget,
            scrub: 0.45,
            anticipatePin: 1,
            start: "top top",
            end: () => `+=${getScrollDistance(scenes.length)}`,
            onUpdate: (self) => {
                syncVideo(self.progress);
            },
        },
    });

    scenes.forEach((scene) => {
        const fadeDuration = 0.05;

        // fade in
        timeline.to(
            scene.element,
            {
                autoAlpha: 1,
                y: 0,
                duration: fadeDuration,
                ease: "power2.out",
            },
            scene.start
        );

        // fade out
        timeline.to(
            scene.element,
            {
                autoAlpha: 0,
                y: -20,
                duration: fadeDuration,
                ease: "power2.in",
            },
            Math.max(scene.end - fadeDuration, scene.start + 0.01)
        );
    });

    return timeline;
}
