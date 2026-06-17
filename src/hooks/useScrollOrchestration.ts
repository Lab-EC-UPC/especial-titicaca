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
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    // Las fuentes custom (Citizen/Elza) cambian la altura del texto → re-medir.
    document.fonts?.ready.then(refresh);
    // Imágenes/videos terminan de cargar.
    window.addEventListener("load", refresh);
    // Red de seguridad tras el primer settle del layout.
    const settle = window.setTimeout(refresh, 600);

    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
      window.clearTimeout(settle);
    };
  }, []);
}
