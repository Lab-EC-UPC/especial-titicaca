import { useState, useRef, useEffect } from "react";
import Leyenda from "../../../components/Leyenda";
import PopupSaludInformation from "../../../components/PopupSaludInformation";
import PopupMineriaInformation from "../../../components/PopupMineriaInformation";
import TriCoordFinder from "./TriCoordFinder";
import { useIsMobile } from "../hooks/useIsMobile";
import botonCerrar from "../../../assets/images/Capachica/TriangulacionSection/boton-cerrar.png";
import botonAtras from "../../../assets/images/Capachica/TriangulacionSection/Botón atrás.png";
import {
  type LegendTab,
  type MineriaMarker,
  PROVINCE_MARKERS,
  PROVINCE_SALUD_POPUPS,
} from "../data/triangulacionData";

interface Props {
  selectedProvince: string;
  provinceMap: string;
  onBack: () => void;
  onClose: () => void;
}

export default function ProvinceView({ selectedProvince, provinceMap, onBack, onClose }: Props) {
  const [legendTab, setLegendTab] = useState<LegendTab>("salud");
  const [saludAnchor, setSaludAnchor] = useState<{ x: number; y: number; tipo: "segura" | "riesgo" | "critica" } | null>(null);
  const [mineriaPopup, setMineriaPopup] = useState<MineriaMarker | null>(null);
  const [coordMode, setCoordMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();

  // En móvil los marcadores se agrandan y añaden un área de toque transparente.
  const rSegura = isMobile ? 30 : 22;
  const rOtro = isMobile ? 20 : 14;
  const hitR = isMobile ? 56 : 0;
  const triScale = isMobile ? 1.6 : 1;
  const triPts = `0,${-18 * triScale} ${16 * triScale},${14 * triScale} ${-16 * triScale},${14 * triScale}`;

  const closePopups = () => {
    setSaludAnchor(null);
    setMineriaPopup(null);
  };

  // Atajo dev: Ctrl + Shift + C abre/cierra el buscador de coordenadas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        setCoordMode((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const markers = PROVINCE_MARKERS[selectedProvince];

  if (coordMode) {
    return (
      <TriCoordFinder
        provinceId={selectedProvince}
        provinceMap={provinceMap}
        onClose={() => setCoordMode(false)}
      />
    );
  }

  function getScale() {
    const rect = svgRef.current!.getBoundingClientRect();
    const scaleX = rect.width / 1920;
    const scaleY = rect.height / 1080;
    const scale = Math.min(scaleX, scaleY);
    const offX = (rect.width - 1920 * scale) / 2;
    const offY = (rect.height - 1080 * scale) / 2;
    return { scale, offX, offY };
  }

  return (
    <>
      <img
        src={provinceMap}
        alt="Mapa provincia"
        className="absolute inset-0 w-full h-full object-contain"
      />

      <div className="absolute top-8 left-8 z-20 flex gap-3">
        <button onClick={onBack} className="cursor-pointer hover:opacity-80 transition-opacity">
          <img src={botonAtras} alt="Volver" className="w-12 h-12" />
        </button>
        <button onClick={onClose} className="cursor-pointer hover:opacity-80 transition-opacity">
          <img src={botonCerrar} alt="Cerrar" className="w-12 h-12" />
        </button>
      </div>

      {markers && (
        <svg
          ref={svgRef}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full z-10"
          onClick={() => { setSaludAnchor(null); setMineriaPopup(null); }}
        >
          {legendTab === "mineria" &&
            markers.mineria.map((m, i) => (
              <g
                key={i}
                transform={`translate(${m.x}, ${m.y})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const { scale, offX, offY } = getScale();
                  setSaludAnchor(null);
                  setMineriaPopup(prev =>
                    prev?.nombre === m.nombre ? null : {
                      ...m,
                      _sx: m.x * scale + offX,
                      _sy: m.y * scale + offY,
                    } as MineriaMarker & { _sx: number; _sy: number }
                  );
                }}
              >
                {hitR > 0 && (
                  <circle cx={0} cy={0} r={hitR} fill="transparent" />
                )}
                <polygon
                  points={triPts}
                  fill={m.tipo === "formal" ? "#13A383" : "#C03583"}
                />
              </g>
            ))}

          {legendTab === "salud" &&
            markers.salud.map((m, i) => {
              const onPick = (e: React.MouseEvent) => {
                e.stopPropagation();
                const { scale, offX, offY } = getScale();
                setMineriaPopup(null);
                setSaludAnchor(prev =>
                  prev?.tipo === m.tipo ? null : {
                    x: m.x * scale + offX,
                    y: m.y * scale + offY,
                    tipo: m.tipo,
                  }
                );
              };
              return (
                <g key={i} className="cursor-pointer" onClick={onPick}>
                  {hitR > 0 && (
                    <circle cx={m.x} cy={m.y} r={hitR} fill="transparent" />
                  )}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={m.tipo === "segura" ? rSegura : rOtro}
                    fill={
                      m.tipo === "segura" ? "#F4F4F4"
                      : m.tipo === "riesgo" ? "#13A383"
                      : "#C03583"
                    }
                  />
                </g>
              );
            })}
        </svg>
      )}

      {!isMobile && saludAnchor && (() => {
        const popup = PROVINCE_SALUD_POPUPS[selectedProvince]?.find(p => p.zona === saludAnchor.tipo);
        if (!popup) return null;
        return (
          <div
            className="absolute z-20 pointer-events-none"
            style={{ left: saludAnchor.x + 24, top: saludAnchor.y - 80 }}
          >
            <PopupSaludInformation {...popup} />
          </div>
        );
      })()}

      {!isMobile && mineriaPopup && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: (mineriaPopup as MineriaMarker & { _sx: number })._sx + 24,
            top:  (mineriaPopup as MineriaMarker & { _sy: number })._sy - 80,
          }}
        >
          <PopupMineriaInformation
            tipo={mineriaPopup.tipo}
            nombre={mineriaPopup.nombre}
            eessMasCercano={mineriaPopup.eessMasCercano}
            distanciaKm={mineriaPopup.distanciaKm}
            descripcion={mineriaPopup.descripcion}
          />
        </div>
      )}

      {/* Móvil: información del marcador como bottom sheet */}
      {isMobile && (saludAnchor || mineriaPopup) && (
        <div className="fixed inset-0 z-40" onClick={closePopups}>
          <div
            className="absolute inset-x-0 bottom-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              if (saludAnchor) {
                const popup = PROVINCE_SALUD_POPUPS[selectedProvince]?.find(
                  (p) => p.zona === saludAnchor.tipo
                );
                return popup ? <PopupSaludInformation {...popup} /> : null;
              }
              if (mineriaPopup) {
                return (
                  <PopupMineriaInformation
                    tipo={mineriaPopup.tipo}
                    nombre={mineriaPopup.nombre}
                    eessMasCercano={mineriaPopup.eessMasCercano}
                    distanciaKm={mineriaPopup.distanciaKm}
                    descripcion={mineriaPopup.descripcion}
                  />
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}

      {!(isMobile && (saludAnchor || mineriaPopup)) && (
        <div className="absolute z-10 bottom-4 inset-x-4 flex justify-center sm:bottom-8 sm:right-8 sm:inset-x-auto sm:left-auto sm:block">
          <Leyenda activeTab={legendTab} onTabChange={setLegendTab} collapsible={isMobile} />
        </div>
      )}
    </>
  );
}
