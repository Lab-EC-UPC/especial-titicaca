import { useState } from "react";
import StoryPopup from "../../components/StoryPopup";
import mapaTriangulacion from "../../assets/images/Capachica/TriangulacionSection/mapa-triangulacion.png";
import botonRetroceder from "../../assets/images/Capachica/TriangulacionSection/boton-retroceder.png";
import cruz from "../../assets/images/Capachica/TriangulacionSection/cruz.png";
import Leyenda from "../../components/Leyenda";
import CardInformation from "../../components/CardInformation";

type Zona = "segura" | "riesgo" | "critica";

const ZONA_COLORES: Record<Zona, string> = {
  segura:  "#00C2B2",
  riesgo:  "#FFCA0F",
  critica: "#FF0000",
};

const CRUCES: { top: string; left: string; zona?: Zona }[] = [
  { top: "8%",  left: "12%", zona: "segura"  },
  { top: "15%", left: "55%", zona: "riesgo"  },
  { top: "22%", left: "80%", zona: "critica" },
  { top: "35%", left: "25%" },
  { top: "45%", left: "90%" },
  { top: "55%", left: "40%" },
  { top: "65%", left: "72%" },
  { top: "75%", left: "18%" },
  { top: "85%", left: "60%" },
  { top: "50%", left: "5%"  },
  { top: "5%",  left: "40%" },
  { top: "10%", left: "70%" },
  { top: "28%", left: "48%" },
  { top: "30%", left: "88%" },
  { top: "40%", left: "62%" },
  { top: "48%", left: "30%" },
  { top: "58%", left: "85%" },
  { top: "62%", left: "15%" },
  { top: "70%", left: "50%" },
  { top: "78%", left: "80%" },
  { top: "82%", left: "35%" },
  { top: "88%", left: "22%" },
  { top: "92%", left: "75%" },
  { top: "20%", left: "10%" },
];

export const TriangulacionSection = () => {
  const [selectedCruz, setSelectedCruz] = useState<number | null>(null);

    return (
      <div id="triangulacion" className="bg-violet-200">
        <div className="w-full h-screen flex flex-col">
            <h2 className="text-2xl font-inter font-semibold text-center py-6">
              Mapa por Triangulaciones
            </h2>

          <div className="relative flex-1 w-full bg-[#C7C7C7]">
          <StoryPopup />
          <div className = "absolute top-4 left-4">
            <img src={botonRetroceder} alt="Boton Retroceder" className="w-[60px]" />
          </div>

          {CRUCES.map((pos, i) => (
            <div
              key={i}
              className="absolute cursor-pointer"
              style={{ top: pos.top, left: pos.left }}
              onClick={() => setSelectedCruz(i)}
            >
              {pos.zona && (
                <div
                  className="absolute w-15 h-15 rounded-full -top-[18px] -left-[18px]"
                  style={{ backgroundColor: ZONA_COLORES[pos.zona], opacity: 0.30}}
                />
              )}
              <img src={cruz} alt="" className="relative w-6" />
            </div>
          ))}

          {selectedCruz !== null && (
            <div
              className="absolute z-10"
              style={{ 
                top: `calc(${CRUCES[selectedCruz].top} - 120px)`, 
                left: `calc(${CRUCES[selectedCruz].left} + 30px)` 
              }}
            >
              <CardInformation onClose={() => setSelectedCruz(null)} />
            </div>
          )}

          <div className="flex h-full justify-center items-center">
            <img src={mapaTriangulacion} alt="Mapa por Triangulaciones" className="w-[800px]" />     
          </div>

          <div className="absolute bottom-18 left-16">
            <Leyenda />
          </div>


          </div>
            
        </div>
      </div>
    )
  }
  