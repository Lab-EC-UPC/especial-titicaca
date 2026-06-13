import { useState, useRef } from "react";
import Leyenda from "../../../components/Leyenda";
import PopupSaludInformation from "../../../components/PopupSaludInformation";
import PopupMineriaInformation from "../../../components/PopupMineriaInformation";
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
  const svgRef = useRef<SVGSVGElement>(null);

  const markers = PROVINCE_MARKERS[selectedProvince];

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
                <polygon
                  points="0,-18 16,14 -16,14"
                  fill={m.tipo === "formal" ? "#13A383" : "#C03583"}
                />
              </g>
            ))}

          {legendTab === "salud" &&
            markers.salud.map((m, i) => (
              <circle
                key={i}
                cx={m.x}
                cy={m.y}
                r={m.tipo === "segura" ? 22 : 14}
                className="cursor-pointer"
                fill={
                  m.tipo === "segura" ? "#F4F4F4"
                  : m.tipo === "riesgo" ? "#13A383"
                  : "#C03583"
                }
                onClick={(e) => {
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
                }}
              />
            ))}
        </svg>
      )}

      {saludAnchor && (() => {
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

      {mineriaPopup && (
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

      <div className="absolute bottom-8 right-8 z-10">
        <Leyenda activeTab={legendTab} onTabChange={setLegendTab} />
      </div>
    </>
  );
}
