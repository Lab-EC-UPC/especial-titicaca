import { useState, useEffect } from "react";
import { lockScroll, unlockScroll } from "../../hooks/useSmoothScroll";
import StoryPopup from "../../components/StoryPopup";
import CardRoute from "../../components/CardRoute";
import PunoProvinceMap, { PROVINCES } from "./components/PunoProvinceMap";
import RecorridoSVG, { cardAnim } from "./components/RecorridoSVG";
import ProvinceView from "./components/ProvinceView";
import { useIsMobile } from "./hooks/useIsMobile";
import mapaInicio from "../../assets/images/Capachica/TriangulacionSection/maps/mapa-inicio.png";
import mapaRuta from "../../assets/images/Capachica/TriangulacionSection/maps/mapa-ruta.png";
import mapaSeleccionPuno from "../../assets/images/Capachica/TriangulacionSection/maps/mapa-seleccion-puno.png";
import botonCerrar from "../../assets/images/Capachica/TriangulacionSection/boton-cerrar.png";
import mapaCarabaya from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-carabaya.png";
import mapaElCollao from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-collao.png";
import mapaPuno from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-puno.png";
import mapaChucuito from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-chucuito.png";
import mapaYunguyo from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-yunguyo.png";
import mapaSanRoman from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sanroman.png";
import mapaLampa from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-lampa.png";
import mapaHuancane from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-huancane.png";
import mapaMoho from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-moho.png";
import mapaAzangaro from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-azarango.png";
import mapaSanAntonio from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sanantonio.png";
import mapaSandia from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-sandia.png";
import mapaMelgar from "../../assets/images/Capachica/TriangulacionSection/maps/maps-zoom/mapa-melgar.png";

const PROVINCE_MAPS: Record<string, string> = {
  carabaya: mapaCarabaya,
  "el-collao": mapaElCollao,
  puno: mapaPuno,
  chucuito: mapaChucuito,
  yunguyo: mapaYunguyo,
  "san-roman": mapaSanRoman,
  lampa: mapaLampa,
  huancane: mapaHuancane,
  moho: mapaMoho,
  azangaro: mapaAzangaro,
  "san-antonio-de-putina": mapaSanAntonio,
  sandia: mapaSandia,
  melgar: mapaMelgar,
};

type View = "story" | "route" | "map" | "province";

// Contenido de las 3 tarjetas de la ruta. En escritorio se posicionan de forma
// absoluta sobre el mapa; en móvil se muestran de a una (paso a paso).
const ROUTE_STEPS = [
  {
    number: 1,
    color: "#13A383",
    width: "w-[300px]",
    pos: { left: "10%", top: "38%" },
    text: "Arturo salió de su pueblo natal en busca de un lugar con mayor acceso a la salud para tratarse. Viajó durante siete horas rumbo a Arequipa y así atenderse en un establecimiento de salud más especializado.",
  },
  {
    number: 2,
    color: "#C03A84",
    width: "w-[300px]",
    pos: { left: "73%", top: "52%" },
    text: "Regresó a Coata con un diagnóstico claro y recién pudo iniciar su tratamiento en San Román.",
  },
  {
    number: 3,
    color: "#FFFFFF",
    width: "w-[335px]",
    pos: { left: "70%", top: "23%" },
    text: "Ya de regreso en Coata, debía recorrer 13 kilómetros diarios para recibir tratamiento en una clínica privada.",
  },
] as const;

export const TriangulacionSection = () => {
  const [view, setView] = useState<View>("story");
  const [step, setStep] = useState(0);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Al pulsar "Ver su ruta" el usuario entra en la experiencia interactiva
  // (route/map/province): congelamos el scroll de la página para que no se
  // desplace por debajo. Al volver a "story" (icono X) se reanuda.
  useEffect(() => {
    if (view === "story") unlockScroll();
    else lockScroll();
  }, [view]);

  // Salvaguarda: si la sección se desmonta con el scroll bloqueado, reanúdalo.
  useEffect(() => () => unlockScroll(), []);

  useEffect(() => {
    if (view !== "route") return;
    setStep(1);
    // En móvil el usuario avanza paso a paso con el botón de cada tarjeta.
    if (isMobile) return;
    const t1 = setTimeout(() => setStep(2), 3500);
    const t2 = setTimeout(() => setStep(3), 7000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [view, isMobile]);

  return (
    <div
      id="triangulacion"
      className={`relative w-full ${view === "province" ? "bg-[#151B1B]" : "bg-[#304551]"} h-[100dvh]`}
    >
      <div className="relative h-[100dvh] overflow-hidden">
        {view !== "province" && !(isMobile && view === "map") && (
          <img
            src={
              view === "map"
                ? mapaSeleccionPuno
                : view === "route"
                  ? mapaRuta
                  : mapaInicio
            }
            alt="Mapa Triangulación"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {view === "story" && (
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
        )}

        {view === "route" && <RecorridoSVG step={step} />}

        {view === "route" && (
          <button
            onClick={() => setView("story")}
            className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={botonCerrar} alt="Cerrar" className="w-10 h-10 sm:w-12 sm:h-12" />
          </button>
        )}

        {view === "story" && (
          <p className="absolute top-14 left-1/2 -translate-x-1/2 z-10 font-citizen font-bold text-white text-[22px] sm:text-[30px] md:text-[40px] leading-[1.2] tracking-[0.02em] text-center whitespace-nowrap">
            MINERÍA Y COBERTURA
            <br /> DE SALUD EN PUNO
          </p>
        )}

        {view === "map" && (
          <>
            <PunoProvinceMap
              hoveredId={hoveredProvince}
              selectedId={selectedProvince}
              onHover={setHoveredProvince}
              onLeave={() => setHoveredProvince(null)}
              onSelect={(id) => {
                if (isMobile) {
                  // 1er toque resalta; 2º toque (misma provincia) entra.
                  if (selectedProvince === id) setView("province");
                  else setSelectedProvince(id);
                } else {
                  setSelectedProvince(id);
                  setView("province");
                }
              }}
              viewBox={isMobile ? "600 -30 620 1200" : "0 0 1920 1080"}
              preserveAspectRatio={isMobile ? "xMidYMid meet" : "xMidYMid slice"}
              standalone={isMobile}
            />
            <button
              onClick={() => {
                setView("story");
                setSelectedProvince(null);
              }}
              className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={botonCerrar} alt="Cerrar" className="w-10 h-10 sm:w-12 sm:h-12" />
            </button>

            {isMobile ? (
              <>
                <p className="absolute top-6 left-1/2 -translate-x-1/2 z-20 font-citizen font-bold text-white text-base text-center whitespace-nowrap">
                  Toca una provincia
                </p>
                {/* Barra inferior de confirmación */}
                <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                  {selectedProvince ? (
                    <button
                      onClick={() => setView("province")}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#14A088] bg-[#14A088]/20 px-5 py-4 backdrop-blur-sm active:bg-[#14A088]/35"
                    >
                      <span className="font-citizen text-base font-bold text-white">
                        {PROVINCES.find((p) => p.id === selectedProvince)?.name}
                      </span>
                      <span className="flex items-center gap-2 font-elza text-sm text-white/90">
                        Entrar
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <p className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-center font-elza text-sm text-white/60 backdrop-blur-sm">
                      Toca una provincia en el mapa para seleccionarla
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-elza text-white/70 text-sm transition-opacity duration-200">
                {hoveredProvince
                  ? PROVINCES.find((p) => p.id === hoveredProvince)?.name
                  : selectedProvince
                    ? PROVINCES.find((p) => p.id === selectedProvince)?.name
                    : "Haz clic en cada provincia para conocer más información"}
              </p>
            )}
          </>
        )}

        {view === "province" && selectedProvince && (
          <ProvinceView
            selectedProvince={selectedProvince}
            provinceMap={PROVINCE_MAPS[selectedProvince] ?? mapaInicio}
            onBack={() => {
              setView("map");
              setSelectedProvince(null);
            }}
            onClose={() => {
              setView("story");
              setSelectedProvince(null);
            }}
          />
        )}

        {view === "story" && (
          <StoryPopup onShowRoute={() => setView("route")} />
        )}

        {view === "route" &&
          (isMobile ? (
            // Móvil: una tarjeta a la vez, el usuario avanza con la flecha.
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <p className="mb-3 text-center font-elza text-xs text-white/60">
                Paso {step} de {ROUTE_STEPS.length}
              </p>
              {ROUTE_STEPS.filter((s) => s.number === step).map((s) => (
                <CardRoute
                  key={s.number}
                  number={s.number}
                  color={s.color}
                  className="mx-auto w-full max-w-md"
                  onNext={() =>
                    step < ROUTE_STEPS.length
                      ? setStep(step + 1)
                      : setView("map")
                  }
                >
                  {s.text}
                </CardRoute>
              ))}
            </div>
          ) : (
            // Escritorio: las 3 tarjetas posicionadas sobre el mapa.
            <>
              {ROUTE_STEPS.map((s) => (
                <div
                  key={s.number}
                  className="absolute z-10"
                  style={{ ...s.pos, ...cardAnim(step >= s.number) }}
                >
                  <CardRoute
                    number={s.number}
                    color={s.color}
                    className={s.width}
                    onNext={
                      s.number === ROUTE_STEPS.length
                        ? () => setView("map")
                        : undefined
                    }
                  >
                    {s.text}
                  </CardRoute>
                </div>
              ))}
            </>
          ))}
      </div>
    </div>
  );
};
