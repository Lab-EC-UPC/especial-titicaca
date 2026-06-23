import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FADE_PIXELS = 160;

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

type GalleryBlock = {
    element: HTMLElement;
    start: number;
    images: number;
    snap: number;
    transition: number;
    width: number;
    update: ((progress: number) => void) | null;
};

// ─── Scene extraction ─────────────────────────────────────────────────────────

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
            (s) =>
                !Number.isNaN(s.start) &&
                !Number.isNaN(s.end) &&
                s.start >= 0 &&
                s.end <= 1 &&
                s.start < s.end,
        );
}

// ─── Gallery block detection ──────────────────────────────────────────────────

function getGallery(container: HTMLElement): GalleryBlock | null {
    const el = container.querySelector<HTMLElement>("[data-gallery]");
    if (!el) return null;

    const start = Number(el.dataset.start);
    const images = Number(el.dataset.images);
    const snap = Number(el.dataset.snap);
    if ([start, images, snap].some(Number.isNaN)) return null;

    const transition =
        el.dataset.transition !== undefined
            ? Number(el.dataset.transition)
            : Math.round(snap * 0.7);
    const width = images * (snap + transition);

    return {
        element: el,
        start,
        images,
        snap,
        transition,
        width,
        update: null,
    };
}

// ─── Gallery animation setup ──────────────────────────────────────────────────

function setupGallery(
    tl: GSAPTimeline,
    gallery: GalleryBlock,
    galleryStartRatio: number,
    totalScroll: number,
    getViewportWidth: () => number,
) {
    const galleryDur = gallery.width / totalScroll;
    const perImage = galleryDur / gallery.images;
    const totalPerImg = gallery.snap + gallery.transition;
    const hold = perImage * (gallery.snap / totalPerImg);
    const trans = perImage * (gallery.transition / totalPerImg);

    const state = { pos: 0 };

    for (let i = 0; i < gallery.images; i++) {
        const cycleStart = galleryStartRatio + i * perImage;
        if (i < gallery.images - 1) {
            tl.to(state, { pos: i, duration: hold, ease: "none" }, cycleStart);
            tl.to(
                state,
                { pos: i + 1, duration: trans, ease: "none" },
                cycleStart + hold,
            );
        } else {
            tl.to(state, { pos: i, duration: hold, ease: "none" }, cycleStart);
        }
    }

    const imageEls =
        gallery.element.querySelectorAll<HTMLElement>("[data-gallery-image]");

    gallery.update = () => {
        const pos = state.pos;
        // Cacheado: lo refresca ScrollTrigger en resize (ver onRefresh), no se
        // lee en cada frame del scrub.
        const vw = getViewportWidth();

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
            el.style.transform = `translateX(calc(-50% + ${x}px)) translateY(-50%) scale(${scale})`;

            const textEl =
                el.querySelector<HTMLElement>("[data-gallery-text]");
            if (textEl) {
                textEl.style.opacity = absDist < 0.3 ? "1" : "0";
            }
        });
    };
}

// ─── Main entry ───────────────────────────────────────────────────────────────

export function createVideoTimeline(
    container: HTMLElement,
    video: HTMLVideoElement,
    scrollDistance = 2000,
    refreshPriority = 0,
): GSAPTimeline {
    const gallery = getGallery(container);
    const extraScroll = gallery ? gallery.width : 0;
    const totalScroll = scrollDistance + extraScroll;

    const galleryStartPx = gallery ? gallery.start * scrollDistance : 0;
    const galleryEndPx = gallery ? galleryStartPx + gallery.width : 0;

    const fadeDuration = Math.min(0.1, FADE_PIXELS / totalScroll);

    function timelineRatio(videoRatio: number) {
        const px = videoRatio * scrollDistance;
        const offset = gallery && px > galleryStartPx ? gallery.width : 0;
        return (px + offset) / totalScroll;
    }

    const scenes = getScenes(container);

    gsap.set(scenes.map((s) => s.element), { autoAlpha: 0, y: 10 });

    // Ancho de viewport cacheado: lo refresca ScrollTrigger en cada resize
    // (onRefresh, abajo), evitando leer window.innerWidth en cada frame.
    let viewportW = window.innerWidth;

    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: container,
            pin: true,
            // Arrastre del playhead tras el scroll: más bajo = más pegado al
            // gesto (menos "sigue moviéndose al soltar"). Súbelo si lo notas
            // brusco; bájalo si "se pasa".
            scrub: 0.3,
            anticipatePin: 1,
            start: "top top",
            end: `+=${totalScroll}`,
            refreshPriority,
            onRefresh: () => {
                viewportW = window.innerWidth;
            },
        },
    });

    // ── video scrub ────────────────────────────────────────────────────
    if (gallery) {
        const beforeGallery = galleryStartPx / totalScroll;
        const galleryDur = gallery.width / totalScroll;
        const afterGallery = beforeGallery + galleryDur;
        const pauseTime = gallery.start * video.duration;

        tl.to(video, { currentTime: pauseTime, duration: beforeGallery, ease: "none" }, 0);
        tl.to(video, { currentTime: pauseTime, duration: galleryDur, ease: "none" }, beforeGallery);
        tl.to(video, { currentTime: video.duration, duration: 1 - afterGallery, ease: "none" }, afterGallery);
    } else {
        tl.to(video, { currentTime: video.duration, duration: 1, ease: "none" }, 0);
    }

    // ── scenes ─────────────────────────────────────────────────────────
    scenes.forEach((scene) => {
        const startAt = timelineRatio(scene.start);
        const endAt = timelineRatio(scene.end);

        tl.to(scene.element, { autoAlpha: 1, y: 0, duration: fadeDuration, ease: "power2.out" }, startAt);
        tl.to(scene.element, { autoAlpha: 0, y: -5, duration: fadeDuration, ease: "power2.in" }, Math.max(endAt - fadeDuration, startAt + 0.01));
    });

    // ── gallery block ──────────────────────────────────────────────────
    if (gallery) {
        const galleryStartRatio = galleryStartPx / totalScroll;
        const galleryEndRatio = galleryEndPx / totalScroll;

        tl.to(gallery.element, { autoAlpha: 1, duration: fadeDuration, ease: "power2.out" }, galleryStartRatio);
        tl.to(gallery.element, { autoAlpha: 0, duration: fadeDuration, ease: "power2.in" }, galleryEndRatio);

        setupGallery(tl, gallery, galleryStartRatio, totalScroll, () => viewportW);

        tl.eventCallback("onUpdate", () => {
            if (!gallery.update) return;
            const t = tl.progress();
            const gDur = galleryEndRatio - galleryStartRatio;
            const progress = gDur > 0 ? Math.max(0, Math.min(1, (t - galleryStartRatio) / gDur)) : 0;
            gallery.update(progress);
        });
    }

    // ── Fundido desde/hacia negro (transición tipo documental) ─────────
    const fadeCover = container.querySelector<HTMLElement>("[data-fade-cover]");
    if (fadeCover) {
        const fadeFrom = fadeCover.dataset.fadeFrom === "1";
        const fadeTo = fadeCover.dataset.fadeTo === "1";
        const FADE_FROM_D = 0.09;
        // La cortina de salida usa una ventana AMPLIA y ADELANTADA: así el
        // teal queda puesto como "suelo" antes/mientras la siguiente sección
        // hace su propio cross-dissolve por encima, evitando que su final
        // oscuro asome (negro) a través del fundido. `power2.out` lo sube
        // pronto para que lidere al contenido entrante.
        const FADE_TO_D = 0.4;
        if (fadeFrom) {
            tl.fromTo(
                fadeCover,
                { autoAlpha: 1 },
                { autoAlpha: 0, ease: "power1.out", duration: FADE_FROM_D },
                0,
            );
        } else {
            gsap.set(fadeCover, { autoAlpha: 0 });
        }
        if (fadeTo) {
            tl.to(
                fadeCover,
                { autoAlpha: 1, ease: "power2.out", duration: FADE_TO_D },
                1 - FADE_TO_D,
            );
        }
    }

    // ── Cross-dissolve de entrada: el contenedor se funde (0→1) por encima de
    //    la sección anterior, que queda visible debajo durante el solape. ────
    if (container.dataset.crossfadeIn === "1") {
        tl.fromTo(
            container,
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: "power1.out", duration: 0.16 },
            0,
        );
    }

    return tl;
}
