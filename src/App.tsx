import "./index.css";
import { useState, useEffect } from "react";
import { HeaderSection } from "./features/01-Header/HeaderSection";
import { JuliacaSection } from "./features/02-Juliaca/JuliacaSection";
import { MapaTiticacaSection } from "./features/02-Juliaca/MapaTiticacaSection";
import { FloraFaunaSection } from "./features/03-FloraFauna/FloraFaunaSection";
import { AnimacionCapachicaSection } from "./features/04-Capachica/AnimacionCapachicaSection";
import { CapachicaSection } from "./features/04-Capachica/CapachicaSection";
import { TestimoniosSection } from "./features/04-Capachica/TestimoniosSection";
import { TriangulacionSection } from "./features/04-Capachica/TriangulacionSection";
import { DenunciasSection } from "./features/05-Denuncias/DenunciasSection";
import { FooterSection } from "./features/06-Footer/FooterSection";
import { MapMarkerEditor } from "./dev/MapMarkerEditor";
//import { CoordFinder } from "./components/CoordFinder";

function App() {
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "M") setShowEditor(v => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      
      

      <header className="w-full">
        <h1 className="flex items-center justify-center bg-[#FFCB03] text-6xl font-bold p-5">
          El Comercio
        </h1>
        <nav className="flex flex-wrap items-center justify-center gap-5 p-2 uppercase text-sm bg-white shadow-sm">
          <p>Lo último</p>
          <p>Editorial</p>
          <p>Política</p>
          <p>ECData</p>
          <p>Mundo</p>
          <p>Economía</p>
          <p>DT</p>
          <p>Suscriptores</p>
          <p>Newsletters</p>
          <p>Juegos</p>
        </nav>
      </header>


      {showEditor && <MapMarkerEditor onClose={() => setShowEditor(false)} />}

      <main>
        <div id="inicio">        <HeaderSection />       </div>
        <div id="juliaca">          <JuliacaSection />          </div>
        <div id="mapatiti">          <MapaTiticacaSection />          </div>
        <div id="florafauna">          <FloraFaunaSection />          </div>
        <div id="animacioncapa">          <AnimacionCapachicaSection />          </div>
        <div id="capachica">        <CapachicaSection />       </div>
        <div id="testimonio">        <  TestimoniosSection />       </div>
        <div id="triangulacion">        <TriangulacionSection />       </div>
        <div id="denuncias"> <DenunciasSection /> </div>
        <div id="footer">        <FooterSection />       </div>
        
      </main>
    </div>
  );
}

export default App;