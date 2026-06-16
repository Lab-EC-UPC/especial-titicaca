import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Instancia activa de Lenis, para que otros componentes (p.ej. el menú)
// puedan disparar un scroll suave coherente con la inercia global.
let activeLenis: Lenis | null = null;

type LenisScrollTarget = number | string | HTMLElement;
type LenisScrollOptions = Parameters<Lenis["scrollTo"]>[1];

/** Scroll suave a un destino usando Lenis; cae a scrollIntoView si Lenis
 *  no está activo (p.ej. con prefers-reduced-motion). */
export function lenisScrollTo(
  target: LenisScrollTarget,
  options?: LenisScrollOptions,
) {
  if (activeLenis) {
    activeLenis.scrollTo(target, options);
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) el.scrollIntoView({ behavior: "smooth" });
}

/** Congela el scroll de la página (p.ej. mientras una experiencia interactiva
 *  está abierta). Pausa Lenis; si no hay Lenis (prefers-reduced-motion) cae a
 *  bloquear el overflow nativo del documento. */
export function lockScroll() {
  if (activeLenis) {
    activeLenis.stop();
    return;
  }
  document.documentElement.style.overflow = "hidden";
}

/** Reanuda el scroll de la página previamente congelado con lockScroll(). */
export function unlockScroll() {
  if (activeLenis) {
    activeLenis.start();
    return;
  }
  document.documentElement.style.overflow = "";
}

/**
 * Capa de scroll suave (inercial) para todo el documento.
 *
 * Lenis suaviza el scrollY REAL del documento, así que todas las secciones
 * heredan la inercia sin reescribirse: los pins/scrub de GSAP (Juliaca,
 * Capachica, Header) y también los listeners manuales que leen
 * getBoundingClientRect / scroll (MapaTiticaca, Contaminación).
 *
 * Integración oficial Lenis + GSAP:
 *  - lenis.on("scroll", ScrollTrigger.update)  → ScrollTrigger se sincroniza.
 *  - lenis.raf se maneja desde el ticker de GSAP → un solo loop de rAF.
 *  - lagSmoothing(0) evita que GSAP "salte" tras un frame lento.
 *
 * Requiere quitar `scroll-behavior: smooth` del CSS (pelea con Lenis/GSAP).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Curva de easing suave para el feel "documental".
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // GSAP ticker entrega segundos; Lenis espera milisegundos.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      activeLenis = null;
    };
  }, []);
}
