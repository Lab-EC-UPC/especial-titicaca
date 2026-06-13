import { useState, useEffect } from "react";
import StoryPopup from "../../components/StoryPopup";
import CardRoute from "../../components/CardRoute";
import PunoProvinceMap, { PROVINCES } from "./components/PunoProvinceMap";
import RecorridoSVG, { cardAnim } from "./components/RecorridoSVG";
import ProvinceView from "./components/ProvinceView";
import mapaInicio from "../../assets/images/Capachica/TriangulacionSection/maps/mapa-inicio.png";
import mapaRuta from "../../assets/images/Capachica/TriangulacionSection/maps/mapa-ruta.png";
import mapaSeleccionPuno from "../../assets/images/Capachica/TriangulacionSection/maps/mapa-seleccion-puno.png";
import botonCerrar from "../../assets/images/Capachica/TriangulacionSection/boton-cerrar.png";
import mapaCarabaya      from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-carabaya.png";
import mapaElCollao      from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-collao.png";
import mapaPuno          from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-puno.png";
import mapaChucuito      from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-chucuito.png";
import mapaYunguyo       from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-yunguyo.png";
import mapaSanRoman      from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sanroman.png";
import mapaLampa         from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-lampa.png";
import mapaHuancane      from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-huancane.png";
import mapaMoho          from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-moho.png";
import mapaAzangaro      from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-azarango.png";
import mapaSanAntonio    from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sanantonio.png";
import mapaSandia        from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sandia.png";
import mapaMelgar        from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-melgar.png";

const PROVINCE_MAPS: Record<string, string> = {
  carabaya:              mapaCarabaya,
  "el-collao":           mapaElCollao,
  puno:                  mapaPuno,
  chucuito:              mapaChucuito,
  yunguyo:               mapaYunguyo,
  "san-roman":           mapaSanRoman,
  lampa:                 mapaLampa,
  huancane:              mapaHuancane,
  moho:                  mapaMoho,
  azangaro:              mapaAzangaro,
  "san-antonio-de-putina": mapaSanAntonio,
  sandia:                mapaSandia,
  melgar:                mapaMelgar,
};

type View = "story" | "route" | "map" | "province";

export const TriangulacionSection = () => {
  const [view, setView] = useState<View>("story");
  const [step, setStep] = useState(0);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    if (view !== "route") return;
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 3500);
    const t2 = setTimeout(() => setStep(3), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  return (
    <div
      id="triangulacion"
      className={`relative w-full ${view === "province" ? "bg-[#151B1B]" : "bg-[#304551]"} h-screen`}
    >
      <div className="relative h-screen overflow-hidden">

        {view !== "province" && (
          <img
            src={view === "map" ? mapaSeleccionPuno : view === "route" ? mapaRuta : mapaInicio}
            alt="Mapa Triangulación"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {view === "story" && (
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
        )}

        {view === "route" && <RecorridoSVG step={step} />}

        {view === "story" && (
          <p className="absolute top-14 left-1/2 -translate-x-1/2 z-10 font-citizen font-bold text-white text-xl sm:text-3xl whitespace-nowrap">
            MINERÍA Y COBERTURA DE SALUD EN PUNO
          </p>
        )}

        {view === "map" && (
          <>
            <PunoProvinceMap
              hoveredId={hoveredProvince}
              selectedId={selectedProvince}
              onHover={setHoveredProvince}
              onLeave={() => setHoveredProvince(null)}
              onSelect={(id) => { setSelectedProvince(id); setView("province"); }}
            />
            <button
              onClick={() => { setView("story"); setSelectedProvince(null); }}
              className="absolute top-8 left-8 z-10 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={botonCerrar} alt="Cerrar" className="w-12 h-12" />
            </button>
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-elza text-white/70 text-sm transition-opacity duration-200">
              {hoveredProvince
                ? PROVINCES.find((p) => p.id === hoveredProvince)?.name
                : selectedProvince
                ? PROVINCES.find((p) => p.id === selectedProvince)?.name
                : "Haz clic en cada provincia para conocer más información"}
            </p>
          </>
        )}

        {view === "province" && selectedProvince && (
          <ProvinceView
            selectedProvince={selectedProvince}
            provinceMap={PROVINCE_MAPS[selectedProvince] ?? mapaInicio}
            onBack={() => { setView("map"); setSelectedProvince(null); }}
            onClose={() => { setView("story"); setSelectedProvince(null); }}
          />
        )}

        {view === "story" && (
          <StoryPopup onShowRoute={() => setView("route")} />
        )}

        {view === "route" && (
          <>
            <div className="absolute z-10" style={{ left: "10%", top: "38%", ...cardAnim(step >= 1) }}>
              <CardRoute number={1} color="#13A383" className="w-[300px]">
                Arturo salió de su pueblo natal en busca de un lugar con mayor acceso a la salud para tratarse. Viajó durante siete horas rumbo a Arequipa y así atenderse en un establecimiento de salud más especializado.
              </CardRoute>
            </div>
            <div className="absolute z-10" style={{ left: "73%", top: "52%", ...cardAnim(step >= 2) }}>
              <CardRoute number={2} color="#C03A84" className="w-[300px]">
                Regresó a Coata con un diagnóstico claro y recién pudo iniciar su tratamiento en San Román.
              </CardRoute>
            </div>
            <div className="absolute z-10" style={{ left: "70%", top: "23%", ...cardAnim(step >= 3) }}>
              <CardRoute number={3} color="#FFFFFF" className="w-[335px]" onNext={() => setView("map")}>
                Ya de regreso en Coata, debía recorrer 13 kilómetros diarios para recibir tratamiento en una clínica privada.
              </CardRoute>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
