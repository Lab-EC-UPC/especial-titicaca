import "./index.css";
import "lenis/dist/lenis.css";
import { useState, useEffect } from "react";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useScrollOrchestration } from "./hooks/useScrollOrchestration";
import { HeaderSection } from "./features/01-Header/HeaderSection";
import { JuliacaSection } from "./features/02-Juliaca/JuliacaSection";

import { FloraFaunaSection } from "./features/04-FloraFauna/FloraFaunaSection";
import { CapachicaSection } from "./features/05-Capachica/pages/CapachicaSection";
import { DenunciasSection } from "./features/06-Denuncias/DenunciasSection";
import { FooterSection } from "./features/07-Footer/FooterSection";
import { MapMarkerEditor } from "./dev/MapMarkerEditor";

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
      {showEditor && <MapMarkerEditor onClose={() => setShowEditor(false)} />}

      <main>
        <div id="inicio">
          {" "}
          <HeaderSection />{" "}
        </div>
        <div id="juliaca">
          {" "}
          <JuliacaSection />{" "}
        </div>
        <div id="florafauna">
          {" "}
          <FloraFaunaSection />{" "}
        </div>
        <div id="capachica">
          {" "}
          <CapachicaSection />{" "}
        </div>
        <div id="denuncias">
          {" "}
          <DenunciasSection />{" "}
        </div>
        <div id="footer">
          {" "}
          <FooterSection />{" "}
        </div>
      </main>
    </div>
  );
}

export default App;
