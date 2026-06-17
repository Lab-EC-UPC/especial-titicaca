import { useEffect, useState } from "react";

/**
 * Devuelve true cuando el viewport está por debajo del breakpoint indicado.
 * Se usa para alternar el layout de la TriangulacionSection entre la versión
 * de escritorio (posicionado absoluto a 1920px) y la versión móvil
 * (listas, paso a paso y bottom sheets).
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
