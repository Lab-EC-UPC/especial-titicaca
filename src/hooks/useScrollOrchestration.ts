import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// En móvil, la barra de URL que aparece/desaparece cambia el viewport y
// dispara resizes que descuadran los pins. ignoreMobileResize evita ese
// re-cálculo en el resize vertical del móvil. Se fija al importar, antes de
// que cualquier sección cree sus triggers.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Centraliza el ciclo de vida de ScrollTrigger.
 *
 * Cada sección crea su propio trigger de forma asíncrona (en el
 * loadedmetadata de su video), por lo que las posiciones start/end se
 * pueden medir con el layout a medio formar. Aquí forzamos un refresh único
 * y coordinado cuando el layout ya es estable (fuentes + load), eliminando
 * los solapes/huecos en las costuras entre secciones.
 */
export function useScrollOrchestration() {
  useEffect(() => {
    let cancelled = false;
    let pending: number | undefined;

    // Coalescemos todos los disparadores (fuentes, load, settle) en UN solo
    // refresh: cada evento reprograma un timer corto, de modo que los que
    // llegan juntos producen un único ScrollTrigger.refresh() —un solo reflow—
    // en vez de 2-3 seguidos (cada refresh recalcula todos los pins).
    const scheduleRefresh = () => {
      if (cancelled) return;
      window.clearTimeout(pending);
      pending = window.setTimeout(() => {
        if (!cancelled) ScrollTrigger.refresh();
      }, 120);
    };

    // Las fuentes custom (Citizen/Elza) cambian la altura del texto → re-medir.
    document.fonts?.ready.then(scheduleRefresh);
    // Imágenes/videos terminan de cargar.
    window.addEventListener("load", scheduleRefresh);
    // Red de seguridad tras el primer settle del layout.
    const settle = window.setTimeout(scheduleRefresh, 600);

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleRefresh);
      window.clearTimeout(settle);
      window.clearTimeout(pending);
    };
  }, []);
}
