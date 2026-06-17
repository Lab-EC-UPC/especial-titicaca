import { Suspense, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cuando una sección cargada con `lazy()` termina de montar, su chunk llegó
 * después del refresh coordinado de useScrollOrchestration. Forzamos un
 * ScrollTrigger.refresh() para que sus pins/scrubs se midan y posicionen bien
 * respecto a las demás secciones (sin huecos ni solapes en las costuras).
 */
function RefreshOnMount() {
    useEffect(() => {
        // Esperar al siguiente frame: el layout del subárbol recién montado ya
        // está aplicado cuando ScrollTrigger re-mide.
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, []);
    return null;
}

/**
 * Envuelve una sección below-the-fold cargada con React.lazy. El `fallback`
 * es null (la sección está fuera de viewport al inicio, no necesita placeholder)
 * y al montar dispara el refresh de ScrollTrigger.
 */
export function LazySection({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={null}>
            {children}
            <RefreshOnMount />
        </Suspense>
    );
}
