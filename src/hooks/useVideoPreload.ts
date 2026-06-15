import { useEffect, useRef, type RefObject } from "react";

/**
 * Carga diferida e inteligente de videos *scrubbed*.
 *
 * Estrategia:
 *  - Los <video> arrancan en `preload="metadata"`: el navegador solo baja la
 *    cabecera (suficiente para obtener la duración y construir la timeline),
 *    sin descargar el archivo completo ni saturar el ancho de banda inicial.
 *  - Cuando la sección entra en una zona de margen amplia (≈2 viewports antes
 *    de ser visible), se sube a `preload="auto"` y se fuerza la descarga con
 *    load(), de modo que el video llegue **bufferizado** justo cuando el
 *    usuario empieza a hacer scrub → sin tartamudeo.
 *
 * Solo se dispara una vez por sección (luego desconecta el observer).
 *
 * @param sectionRef  contenedor de la sección a observar.
 * @param videoRefs   refs de los <video> a precargar (desktop/mobile).
 * @param rootMargin  margen del observer; por defecto ~2 viewports arriba/abajo.
 */
export function useVideoPreload(
  sectionRef: RefObject<HTMLElement | null>,
  videoRefs: RefObject<HTMLVideoElement | null>[],
  rootMargin = "300% 0px 300% 0px",
) {
  // videoRefs suele ser un array literal nuevo en cada render; lo leemos vía
  // ref para que el efecto (y el observer) se cree una sola vez.
  const refsRef = useRef(videoRefs);
  refsRef.current = videoRefs;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Si el navegador no soporta IntersectionObserver, cargamos sin diferir.
    if (typeof IntersectionObserver === "undefined") {
      for (const ref of refsRef.current) {
        const v = ref.current;
        if (v) v.preload = "auto";
      }
      return;
    }

    let done = false;
    const upgrade = () => {
      if (done) return;
      done = true;
      for (const ref of refsRef.current) {
        const v = ref.current;
        if (!v) continue;
        // Saltar el video oculto (p.ej. el de desktop cuando se muestra el de
        // mobile, o viceversa): no malgastar ancho de banda ni ralentizar la
        // descarga del que realmente se ve.
        if (window.getComputedStyle(v).display === "none") continue;
        v.preload = "auto";
        // Forzar la descarga completa (cambiar preload solo no la reanuda),
        // pero solo si el scrub aún no empezó (currentTime 0): así no se
        // resetea/parpadea un video que ya se está scrubbeando.
        if (v.currentTime === 0) {
          try {
            v.load();
          } catch {
            /* noop */
          }
        }
      }
      io.disconnect();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) upgrade();
      },
      { root: null, rootMargin, threshold: 0 },
    );
    io.observe(section);

    return () => io.disconnect();
  }, [sectionRef, rootMargin]);
}
