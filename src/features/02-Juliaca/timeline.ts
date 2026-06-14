import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DISTANCE = 4000;

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

type Block = {
    element: HTMLElement;
    startPx: number;
    endPx: number;
    width: number;
    images: number;
    snap: number;
    transition: number;
    type: string;
    update: ((progress: number, tl: GSAPTimeline) => void) | null;
};

// ─── Scene extraction ─────────────────────────────────────────────────────────

const BLOCK_SELECTORS = ["[data-gallery]", "[data-map-section]", "[data-vertimientos-section]"];

function getScenes(container: HTMLElement): Scene[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>("[data-start][data-end]"),
    )
        .filter((el) => !BLOCK_SELECTORS.some((s) => el.closest(s)))
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

// ─── Block config (generic — reads data-start, data-images, data-snap) ────────

const BLOCK_TYPE: Record<string, string> = {
    "[data-gallery]": "gallery",
    "[data-map-section]": "map",
    "[data-vertimientos-section]": "vertimientos",
};

function getBlock(container: HTMLElement, selector: string): Block | null {
    const el = container.querySelector<HTMLElement>(selector);
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
        startPx: start * SCROLL_DISTANCE,
        endPx: start * SCROLL_DISTANCE + width,
        images,
        width,
        snap,
        transition,
        type: BLOCK_TYPE[selector] ?? selector,
        update: null,
    };
}

function collectBlocks(container: HTMLElement): Block[] {
    return BLOCK_SELECTORS.map((s) => getBlock(container, s))
        .filter((b): b is Block => b !== null)
        .sort((a, b) => a.startPx - b.startPx);
}

// ─── Block helpers ────────────────────────────────────────────────────────────

function getOffsetBefore(px: number, blocks: Block[]) {
    return blocks
        .filter((b) => px > b.startPx)
        .reduce((sum, b) => sum + b.width, 0);
}

function getRatio(px: number, blocks: Block[], totalScroll: number) {
    return (px + getOffsetBefore(px, blocks)) / totalScroll;
}

function blockStartRatio(block: Block, blocks: Block[], totalScroll: number) {
    return (block.startPx + getOffsetBefore(block.startPx, blocks)) / totalScroll;
}

function blockEndRatio(block: Block, blocks: Block[], totalScroll: number) {
    return (block.endPx + getOffsetBefore(block.startPx, blocks)) / totalScroll;
}

// ─── Per-type setup ───────────────────────────────────────────────────────────

function setupGallery(tl: GSAPTimeline, block: Block, blocks: Block[], totalScroll: number) {
    const bStart = blockStartRatio(block, blocks, totalScroll);
    const bEnd = blockEndRatio(block, blocks, totalScroll);
    const bDur = block.width / totalScroll;

    const state = { pos: 0 };
    const perImage = bDur / block.images;
    const totalPerImg = block.snap + block.transition;
    const hold = perImage * (block.snap / totalPerImg);
    const trans = perImage * (block.transition / totalPerImg);

    for (let i = 0; i < block.images; i++) {
        const cycleStart = bStart + i * perImage;
        if (i < block.images - 1) {
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
        block.element.querySelectorAll<HTMLElement>("[data-gallery-image]");

    block.update = () => {
        const pos = state.pos;
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
            el.style.transform = `translateX(calc(-50% + ${x}px)) translateY(-50%) scale(${scale})`;

            const textEl =
                el.querySelector<HTMLElement>("[data-gallery-text]");
            if (textEl) {
                textEl.style.opacity = absDist < 0.3 ? "1" : "0";
            }
        });
    };
}

function setupMap(tl: GSAPTimeline, block: Block, blocks: Block[], totalScroll: number) {
    const cuencaEls =
        block.element.querySelectorAll<HTMLElement>("[data-map-cuenca]");
    const cardEls =
        block.element.querySelectorAll<HTMLElement>("[data-map-card]");

    block.update = (progress) => {
        const activeIdx = Math.min(
            Math.max(0, Math.floor(progress * block.images)),
            block.images - 1,
        );

        cuencaEls.forEach((el) => {
            const i = Number(el.dataset.mapCuenca);
            el.style.opacity = i === activeIdx ? "1" : "0";
        });

        cardEls.forEach((el) => {
            const i = Number(el.dataset.mapCard);
            el.style.opacity = i === activeIdx ? "1" : "0";
        });
    };
}

function setupVertimientos(tl: GSAPTimeline, block: Block, blocks: Block[], totalScroll: number) {
    const frameEls =
        block.element.querySelectorAll<HTMLElement>("[data-vertimientos-frame]");
    const titleEl = block.element.querySelector<HTMLElement>("[data-vertimientos-title]");
    const dotEls =
        block.element.querySelectorAll<HTMLElement>("[data-vertimientos-dot]");

    block.update = (progress) => {
        const activeIdx = Math.min(
            Math.max(0, Math.floor(progress * block.images)),
            block.images - 1,
        );
        const frame = activeIdx + 1;

        frameEls.forEach((el) => {
            const f = Number(el.dataset.vertimientosFrame);
            el.style.opacity = f === frame ? "1" : "0";
        });

        if (titleEl) {
            titleEl.style.opacity = frame === 1 ? "1" : "0";
        }

        dotEls.forEach((el) => {
            const f = Number(el.dataset.vertimientosDot);
            const isActive = f === frame;
            const isPast = f < frame;
            el.style.width = isActive ? "10px" : "8px";
            el.style.height = isActive ? "10px" : "8px";
            el.style.background = isActive
                ? "rgba(255,255,255,1)"
                : isPast
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.2)";
            if (isActive) {
                el.style.boxShadow = "0 0 6px rgba(255,255,255,0.6)";
            } else {
                el.style.boxShadow = "none";
            }
        });
    };
}

const SETUP: Record<string, (tl: GSAPTimeline, block: Block, blocks: Block[], totalScroll: number) => void> = {
    gallery: setupGallery,
    map: setupMap,
    vertimientos: setupVertimientos,
};

// ─── Main entry ───────────────────────────────────────────────────────────────

export function createScrollTimeline(container: HTMLElement, video: HTMLVideoElement): GSAPTimeline {
    const scenes = getScenes(container);
    const blocks = collectBlocks(container);

    const extraScroll = blocks.reduce((sum, b) => sum + b.width, 0);
    const totalScroll = SCROLL_DISTANCE + extraScroll;
    const fadeDuration = 0.02;

    gsap.set(scenes.map((s) => s.element), { autoAlpha: 0, y: 10 });

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

    // ── video scrub ────────────────────────────────────────────────────────
    if (blocks.length > 0) {
        let lastRatio = 0;

        for (const block of blocks) {
            const bStart = blockStartRatio(block, blocks, totalScroll);
            const bEnd = blockEndRatio(block, blocks, totalScroll);
            const pauseTime = (block.startPx / SCROLL_DISTANCE) * video.duration;

            tl.to(video, { currentTime: pauseTime, duration: bStart - lastRatio, ease: "none" }, lastRatio);
            tl.to(video, { currentTime: pauseTime, duration: bEnd - bStart, ease: "none" }, bStart);

            lastRatio = bEnd;
        }

        tl.to(video, { currentTime: video.duration, duration: 1 - lastRatio, ease: "none" }, lastRatio);
    } else {
        tl.to(video, { currentTime: video.duration, duration: 1, ease: "none" }, 0);
    }

    // ── scenes ─────────────────────────────────────────────────────────────
    scenes.forEach((scene) => {
        const startAt = getRatio(scene.start * SCROLL_DISTANCE, blocks, totalScroll);
        const endAt = getRatio(scene.end * SCROLL_DISTANCE, blocks, totalScroll);

        tl.to(scene.element, { autoAlpha: 1, y: 0, duration: fadeDuration, ease: "power2.out" }, startAt);
        tl.to(scene.element, { autoAlpha: 0, y: -5, duration: fadeDuration, ease: "power2.in" }, Math.max(endAt - fadeDuration, startAt + 0.01));
    });

    // ── blocks: fade in/out + per-type setup ──────────────────────────────
    for (const block of blocks) {
        const bStart = blockStartRatio(block, blocks, totalScroll);
        const bEnd = blockEndRatio(block, blocks, totalScroll);

        tl.to(block.element, { autoAlpha: 1, duration: fadeDuration, ease: "power2.out" }, bStart);
        tl.to(block.element, { autoAlpha: 0, duration: fadeDuration, ease: "power2.in" }, bEnd);

        SETUP[block.type]?.(tl, block, blocks, totalScroll);
    }

    // ── onUpdate dispatch ──────────────────────────────────────────────────
    tl.eventCallback("onUpdate", () => {
        const t = tl.progress();

        blocks.forEach((block) => {
            if (!block.update) return;

            const bStart = blockStartRatio(block, blocks, totalScroll);
            const bEnd = blockEndRatio(block, blocks, totalScroll);
            const bDur = (bEnd - bStart);
            const progress = bDur > 0 ? Math.max(0, Math.min(1, (t - bStart) / bDur)) : 0;

            block.update(progress, tl);
        });
    });

    return tl;
}
