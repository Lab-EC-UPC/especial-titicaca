import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DISTANCE = 4000;

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

function getScenes(container: HTMLElement): Scene[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>("[data-start][data-end]")
    )
        .filter((el) => !el.closest("[data-gallery]"))
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
}

function getGalleryConfig(container: HTMLElement): {
    element: HTMLElement;
    startPx: number;
    endPx: number;
    images: number;
    width: number;
    snap: number;
    transition: number;
} | null {
    const el = container.querySelector<HTMLElement>("[data-gallery]");
    if (!el) return null;

    const start = Number(el.dataset.start);
    const images = Number(el.dataset.images);
    const snap = Number(el.dataset.snap);
    if ([start, images, snap].some(Number.isNaN)) return null;

    const transition = el.dataset.transition !== undefined
        ? Number(el.dataset.transition)
        : Math.round(snap * 0.7);
    const width = images * (snap + transition);

    return {
        element: el,
        startPx: start * SCROLL_DISTANCE,
        endPx: start * SCROLL_DISTANCE + width,
        images,
        width,
        snap,
        transition,
    };
}

export function createScrollTimeline(container: HTMLElement, video: HTMLVideoElement): GSAPTimeline {
    const scenes = getScenes(container);
    const gallery = getGalleryConfig(container);
    const extraScroll = gallery ? gallery.width : 0;
    const totalScroll = SCROLL_DISTANCE + extraScroll;
    const fadeDuration = 0.02;

    gsap.set(
        scenes.map((scene) => scene.element),
        { autoAlpha: 0, y: 10 }
    );

    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            start: "top top",
            end: `+=${totalScroll}`,
        },
    });

    // --- video scrub ---
    if (gallery) {
        const gStart = gallery.startPx / totalScroll;
        const gEnd = gallery.endPx / totalScroll;
        const pauseTime = (gallery.startPx / SCROLL_DISTANCE) * video.duration;

        const holdStart = gStart + fadeDuration;
        tl.to(video, { currentTime: pauseTime, duration: holdStart, ease: "none" }, 0);
        tl.to(video, { currentTime: pauseTime, duration: gEnd - holdStart, ease: "none" }, holdStart);
        tl.to(video, { currentTime: video.duration, duration: 1 - gEnd, ease: "none" }, gEnd);
    } else {
        tl.to(video, { currentTime: video.duration, duration: 1, ease: "none" }, 0);
    }

    // --- scenes ---
    const convertPx = (oldProgress: number) => {
        const px = oldProgress * SCROLL_DISTANCE;
        if (gallery && px >= gallery.startPx) {
            return (px + gallery.width) / totalScroll;
        }
        return px / totalScroll;
    };

    scenes.forEach((scene) => {

        // Fade in
        tl.to(
            scene.element,
            { autoAlpha: 1, y: 0, duration: fadeDuration, ease: "power2.out" },
            convertPx(scene.start)
        );

        // Fade out
        tl.to(
            scene.element,
            { autoAlpha: 0, y: -5, duration: fadeDuration, ease: "power2.in" },
            Math.max(convertPx(scene.end) - fadeDuration, convertPx(scene.start) + 0.01)
        );
    });

    // Gallery
    if (gallery) {
        const gStart = gallery.startPx / totalScroll;
        const gEnd = gallery.endPx / totalScroll;
        const gDur = gallery.width / totalScroll;

        tl.to(gallery.element, { autoAlpha: 1, duration: fadeDuration, ease: "power2.out" }, gStart);
        tl.to(gallery.element, { autoAlpha: 0, duration: fadeDuration, ease: "power2.in" }, gEnd);

        // carousel state
        const carouselState = { pos: 0 };
        const perImage = gDur / gallery.images;
        const totalPerImg = gallery.snap + gallery.transition;
        const hold = perImage * (gallery.snap / totalPerImg);
        const trans = perImage * (gallery.transition / totalPerImg);

        for (let i = 0; i < gallery.images; i++) {
            const cycleStart = gStart + i * perImage;
            if (i < gallery.images - 1) {
                tl.to(carouselState, { pos: i, duration: hold, ease: "none" }, cycleStart);
                tl.to(carouselState, { pos: i + 1, duration: trans, ease: "none" }, cycleStart + hold);
            } else {
                tl.to(carouselState, { pos: i, duration: hold, ease: "none" }, cycleStart);
            }
        }

        // image positioning callback
        const imageEls = gallery.element.querySelectorAll<HTMLElement>("[data-gallery-image]");

        tl.eventCallback("onUpdate", () => {
            const pos = carouselState.pos;
            const vw = window.innerWidth;

            imageEls.forEach((el) => {
                const i = Number(el.dataset.galleryImage);
                const dist = i - pos;
                const absDist = Math.abs(dist);

                if (absDist >= 1.5) {
                    el.style.opacity = "0";
                    return;
                }

                const spread = vw < 768 ? 0.5 : 0.45;
                const x = dist * vw * spread;
                const scale = 1 - absDist * 0.4;
                const opacity = 1 - absDist * 0.65;

                el.style.opacity = String(opacity);
                el.style.transform =
                    `translateX(calc(-50% + ${x}px)) translateY(-50%) scale(${scale})`;

                const textEl = el.querySelector<HTMLElement>("[data-gallery-text]");
                if (textEl) {
                    textEl.style.opacity = absDist < 0.3 ? "1" : "0";
                }
            });
        });
    }

    return tl;
}
