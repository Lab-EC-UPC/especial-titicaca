import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Scene = {
    element: HTMLElement;
    start: number;
    end: number;
};

// Knob principal de RITMO: píxeles de scroll que dura toda la sección pineada.
// Como las ~17 escenas se reparten en 0..1, más distancia = cada escena ocupa
// más scroll = se lee/avanza más despacio y "se pasa" menos. Súbelo si sigue
// sintiéndose rápido (p.ej. 10500–12000), bájalo si se hace largo.
const SCROLL_DISTANCE = 12000;

// Píxeles de scroll que dura cada fundido de overlay. Se normaliza contra la
// distancia total para que el cross-dissolve dure ~lo mismo en px que en
// Juliaca (sensación documental) y no un "corte" de 1 frame. Es el TOPE: cada
// escena recorta su fade a su propio ancho (ver P4) para no solaparse.
const FADE_PIXELS = 280;

// Duración (en pixeles de scroll) del cross-dissolve de entrada y de la
// cortina de salida hacia la sección contigua.
const SEAM_PIXELS = 360;

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
        { autoAlpha: 0, y: 16 },
    );

    // Fundido normalizado a px de scroll (no a "frames" de progreso).
    const fadeDuration = Math.min(0.08, FADE_PIXELS / SCROLL_DISTANCE);
    const seamDuration = Math.min(0.16, SEAM_PIXELS / SCROLL_DISTANCE);

    // ── Secuencia de video (P1) ─────────────────────────────────────────
    // Las duraciones pueden NO estar listas cuando se construye el timeline:
    // el texto no espera al video. Se recalculan de forma perezosa hasta que
    // los 4 clips reportan su metadata (starts[i] = segundo, en la línea
    // continua, en que arranca el clip i).
    let durations: number[] = [];
    let starts: number[] = [];
    let totalDur = 1;
    let durationsReady = false;

    const recomputeDurations = () => {
        const ds = videos.map((v) => v.duration || 0);
        durationsReady = ds.every((d) => d > 0 && Number.isFinite(d));
        durations = ds;
        starts = [];
        let acc = 0;
        for (const d of ds) {
            starts.push(acc);
            acc += d;
        }
        totalDur = ds.reduce((a, b) => a + b, 0) || 1;
    };
    recomputeDurations();

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

    // ── Seek seguro (P2) ────────────────────────────────────────────────
    // Conserva el guard de buffer (evita saltar a un tramo aún no cargado, que
    // dejaría el frame en negro y luego un "fast-forward"), pero SIN dead-zone:
    // el seek se aplica cada frame —igual que el tween de currentTime de
    // Juliaca— para que el scrub lento sea continuo y fluido (un dead-zone
    // cuantizaba el avance y generaba micro-stutter). El epsilon solo descarta
    // re-seeks idénticos (no-op).
    const SEEK_EPS = 0.001;
    const isSeekable = (v: HTMLVideoElement, t: number) => {
        const b = v.buffered;
        for (let k = 0; k < b.length; k++) {
            if (t >= b.start(k) - 0.05 && t <= b.end(k) + 0.05) return true;
        }
        return false;
    };
    const safeSeek = (v: HTMLVideoElement, t: number) => {
        if (v.readyState < 1) return; // sin metadata todavía
        if (Math.abs(v.currentTime - t) < SEEK_EPS) return; // re-seek idéntico
        if (v.buffered.length > 0 && !isSeekable(v, t)) return; // tramo sin buffer
        v.currentTime = t;
    };

    // ── P3: rangos donde el fondo de video debe congelarse ───────────────
    // Los paneles interactivos (Totora, Testimonios, Triangulación) se
    // muestran a pantalla completa (z-30, opacidad 0→1) y TAPAN el video.
    // Mientras están activos no tiene sentido scrubbear/seekear un fondo
    // oculto: congelamos el último frame (ahorra decode y evita un salto
    // visible al salir del panel si el destino no estaba bufferizado).
    const pauseRanges = Array.from(
        container.querySelectorAll<HTMLElement>(
            '[data-pause-video="true"][data-start][data-end]',
        ),
    )
        .map((el) => ({
            start: Number(el.dataset.start),
            end: Number(el.dataset.end),
        }))
        .filter((r) => Number.isFinite(r.start) && Number.isFinite(r.end) && r.start < r.end);
    const inPauseRange = (p: number) =>
        pauseRanges.some((r) => p >= r.start && p <= r.end);

    const applyScrub = (progress: number) => {
        // El video se "engancha" en cuanto hay duraciones; hasta entonces es
        // no-op (se queda en el primer frame) y el texto sigue funcionando.
        if (!durationsReady) recomputeDurations();
        if (!durationsReady) return;

        const p = Math.max(0, Math.min(1, progress));

        // P3: dentro de un panel interactivo a pantalla completa, congelar el
        // video (no scrubbear ni seekear un fondo que está tapado).
        if (inPauseRange(p)) return;

        const gt = p * totalDur;

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
            safeSeek(v, Math.min(durations[i] - 0.001, Math.max(0, gt - starts[i])));
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
            // Arrastre del playhead tras el scroll. Más bajo = más pegado al
            // gesto (menos "sigue moviéndose al soltar"); más alto suaviza pero
            // añade inercia. Súbelo si lo notas brusco, bájalo si "se pasa".
            scrub: 0.2,
            anticipatePin: 1,
            start: "top top",
            end: `+=${SCROLL_DISTANCE}`,
        },
    });

    // Espaciador para que el playhead recorra 0..1 (las escenas se ubican ahí).
    // El video se conduce desde onUpdate leyendo el progreso ya suavizado.
    tl.to({}, { duration: 1 });

    scenes.forEach((scene) => {
        // P4: el fade se adapta al ancho de la escena. Tope = fadeDuration,
        // pero nunca más de width*0.4, de modo que fade-in y fade-out NO se
        // solapan (2·f ≤ width) y queda una meseta a opacidad 1. Sin esto,
        // las escenas estrechas (~0.04) nunca llegaban a verse del todo.
        const width = scene.end - scene.start;
        const f = Math.min(fadeDuration, width * 0.4);

        tl.to(
            scene.element,
            { autoAlpha: 1, y: 0, duration: f, ease: "power2.out" },
            scene.start,
        );

        tl.to(
            scene.element,
            { autoAlpha: 0, y: -12, duration: f, ease: "power2.in" },
            Math.max(scene.end - f, scene.start + f),
        );
    });

    // ── Cross-dissolve de entrada: la sección se funde (0→1) por encima de la
    //    anterior (carrusel FloraFauna), que queda visible debajo durante el
    //    solape gracias al margin-top negativo del contenedor. ────────────────
    if (container.dataset.crossfadeIn === "1") {
        tl.fromTo(
            container,
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: "power1.out", duration: seamDuration },
            0,
        );
    }

    // ── Cortina de salida hacia la sección contigua (Denuncias, #2E343C): se
    //    disuelve a color sólido al final para que el empalme no muestre línea.
    const fadeCover = container.querySelector<HTMLElement>("[data-fade-cover]");
    if (fadeCover && fadeCover.dataset.fadeTo === "1") {
        gsap.set(fadeCover, { autoAlpha: 0 });
        tl.to(
            fadeCover,
            { autoAlpha: 1, ease: "power1.in", duration: seamDuration },
            1 - seamDuration,
        );
    }

    tl.eventCallback("onUpdate", () => applyScrub(tl.progress()));

    return tl;
}
