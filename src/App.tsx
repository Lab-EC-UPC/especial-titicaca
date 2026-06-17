import "./index.css";
import "lenis/dist/lenis.css";
import { useState, useEffect, lazy, Suspense } from "react";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useScrollOrchestration } from "./hooks/useScrollOrchestration";
import { HeaderSection } from "./features/01-Header/HeaderSection";
import { LazySection } from "./components/LazySection";

// El hero (HeaderSection) va eager: es lo primero que se ve (LCP). El resto de
// secciones se parte en chunks aparte que se descargan tras el primer paint,
// sin bloquear el render inicial. El editor dev solo carga su chunk al abrirlo.
const JuliacaSection = lazy(() =>
    import("./features/02-Juliaca/JuliacaSection").then((m) => ({ default: m.JuliacaSection })),
);
const FloraFaunaSection = lazy(() =>
    import("./features/04-FloraFauna/FloraFaunaSection").then((m) => ({ default: m.FloraFaunaSection })),
);
const CapachicaSection = lazy(() =>
    import("./features/05-Capachica/pages/CapachicaSection").then((m) => ({ default: m.CapachicaSection })),
);
const DenunciasSection = lazy(() =>
    import("./features/06-Denuncias/DenunciasSection").then((m) => ({ default: m.DenunciasSection })),
);
const FooterSection = lazy(() =>
    import("./features/07-Footer/FooterSection").then((m) => ({ default: m.FooterSection })),
);
const MapMarkerEditor = lazy(() =>
    import("./dev/MapMarkerEditor").then((m) => ({ default: m.MapMarkerEditor })),
);

function App() {
  const [showEditor, setShowEditor] = useState(false);

  useSmoothScroll();
  useScrollOrchestration();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "M") setShowEditor((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      {showEditor && (
        <Suspense fallback={null}>
          <MapMarkerEditor onClose={() => setShowEditor(false)} />
        </Suspense>
      )}

      <main>
        <div id="inicio">
          <HeaderSection />
        </div>
        <div id="juliaca">
          <LazySection>
            <JuliacaSection />
          </LazySection>
        </div>
        <div id="florafauna">
          <LazySection>
            <FloraFaunaSection />
          </LazySection>
        </div>
        <div id="capachica">
          <LazySection>
            <CapachicaSection />
          </LazySection>
        </div>
        <div id="denuncias">
          <LazySection>
            <DenunciasSection />
          </LazySection>
        </div>
        <div id="footer">
          <LazySection>
            <FooterSection />
          </LazySection>
        </div>
      </main>
    </div>
  );
}

export default App;
