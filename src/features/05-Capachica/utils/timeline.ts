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

/**
 * Timeline scrubbeada de Capachica.
 *
 * El video de fondo se entrega como una SECUENCIA de N clips consecutivos
 * (segmentos del mismo render). Se tratan como una única línea de tiempo
 * continua: cada clip cubre una porción del scroll proporcional a su duración
 * y solo el clip activo es visible. Clips cortos = totalmente bufferizados =
 * seek baratísimo → scrub fluido en móvil; además cargan de forma progresiva.
 *
 * Como los overlays se ubican por FRACCIÓN del total (data-start/data-end en
 * 0..1), su sincronización no depende del número de clips ni de su duración
 * absoluta: se reescala sola.
 */
export function createScrollTimeline(
    container: HTMLElement,
    videos: HTMLVideoElement[],
): GSAPTimeline {
    const scenes = getScenes(container);

    gsap.set(
        scenes.map((scene) => scene.element),
        { autoAlpha: 0, y: 10 },
    );

    // ── Secuencia de video ──────────────────────────────────────────────
    const durations = videos.map((v) => v.duration || 0);
    const totalDur = durations.reduce((a, b) => a + b, 0) || 1;
    // starts[i] = segundo (en la línea continua) en que arranca el clip i.
    const starts: number[] = [];
    let acc = 0;
    for (const d of durations) {
        starts.push(acc);
        acc += d;
    }

    let activeIdx = -1;

    // Precarga progresiva: fuerza la descarga completa de un clip una sola vez.
    const loaded = new Set<number>();
    const loadOnce = (i: number) => {
        const v = videos[i];
        if (!v || loaded.has(i)) return;
        loaded.add(i);
        v.preload = "auto";
        // No relanzar load() si ya se está mostrando/scrubbeando (resetea a 0).
        if (v.currentTime === 0) {
            try {
                v.load();
            } catch {
                /* noop */
            }
        }
    };

    const setActive = (i: number) => {
        if (i === activeIdx) return;
        videos.forEach((v, j) => {
            v.style.opacity = j === i ? "1" : "0";
        });
        activeIdx = i;
        // Stream adelantado: el actual ya debería estar; aseguramos el siguiente.
        loadOnce(i);
        loadOnce(i + 1);
    };

    const applyScrub = (progress: number) => {
        const gt = Math.max(0, Math.min(1, progress)) * totalDur;

        // Localiza el clip activo dentro de la línea continua.
        let i = durations.length - 1;
        for (let k = 0; k < durations.length; k++) {
            if (gt < starts[k] + durations[k]) {
                i = k;
                break;
            }
        }

        setActive(i);

        const v = videos[i];
        if (v && durations[i] > 0) {
            // epsilon para no rebasar el último frame del clip.
            v.currentTime = Math.min(durations[i] - 0.001, Math.max(0, gt - starts[i]));
        }
    };

    // Estado inicial: solo el primer clip visible; precarga 0 y 1.
    videos.forEach((v, j) => {
        v.style.opacity = j === 0 ? "1" : "0";
    });
    loadOnce(0);
    loadOnce(1);

    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 0.3,
            anticipatePin: 1,
            start: "top top",
            end: `+=${SCROLL_DISTANCE}`,
        },
    });

    // Espaciador para que el playhead recorra 0..1 (las escenas se ubican ahí).
    // El video se conduce desde onUpdate leyendo el progreso ya suavizado.
    tl.to({}, { duration: 1 });

    scenes.forEach((scene) => {
        const fadeDuration = 0.01;

        tl.to(
            scene.element,
            { autoAlpha: 1, y: 0, duration: fadeDuration, ease: "power2.out" },
            scene.start,
        );

        tl.to(
            scene.element,
            { autoAlpha: 0, y: -5, duration: fadeDuration, ease: "power2.in" },
            Math.max(scene.end - fadeDuration, scene.start + 0.01),
        );
    });

    tl.eventCallback("onUpdate", () => applyScrub(tl.progress()));

    return tl;
}
