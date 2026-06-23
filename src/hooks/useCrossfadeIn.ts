import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CrossfadeInOptions = {
    /** Posición de scroll donde empieza el fundido (sintaxis ScrollTrigger). */
    start?: string;
    /** Posición de scroll donde el fundido llega a opaco. */
    end?: string;
};

/**
 * Cross-dissolve de entrada para secciones que NO son VideoSection (p.ej.
 * Fauna), que no tienen su propia timeline scrubbeada.
 *
 * La sección debe solaparse con la anterior (marginTop negativo) y partir
 * invisible (opacity:0). Este hook la funde (autoAlpha 0→1) conducido por el
 * scroll mientras sube POR ENCIMA de la sección saliente —que sigue pineada y
 * visible debajo—, logrando una disolvencia media→contenido real, en lugar de
 * un corte o de un "dip" a color plano.
 *
 * El tramo del fundido (top bottom → top center) coincide con el solape de
 * 50vh, de modo que la sección queda totalmente opaca mientras la anterior aún
 * está pineada (no se ve el frame de video al despinearse).
 *
 * Importante: la sección debe estar posicionada (position:relative) con un
 * z-index > 0 para pintar por encima del elemento pineado (position:fixed) de
 * la sección anterior.
 */
export function useCrossfadeIn(
    ref: RefObject<HTMLElement | null>,
    { start = "top bottom", end = "top center" }: CrossfadeInOptions = {},
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        // Sin animación: la sección debe quedar visible y sin el solape (que
        // dependía del fundido para no mostrarse como un hueco).
        if (prefersReduced) {
            gsap.set(el, { autoAlpha: 1, marginTop: 0 });
            return;
        }

        const tween = gsap.fromTo(
            el,
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: "none" },
        );

        const st = ScrollTrigger.create({
            trigger: el,
            start,
            end,
            scrub: true,
            animation: tween,
        });

        return () => {
            st.kill();
            tween.kill();
        };
    }, [ref, start, end]);
}
