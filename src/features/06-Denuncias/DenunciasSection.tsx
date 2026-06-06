import { ProyectosBajoLaLupaSection } from "./ProyectosBajoLaLupaSection";
import { PtarTiticacaSection } from "./PtarTiticacaSection";
import { ImageneSection } from "./ImageneSection";
import { PebltSection } from "./PebltSection";
import { ProyeccionSection } from "./ProyeccionSection";
import { FuturoLagoSection } from "./FuturoLagoSection";

// Sección principal de Denuncias: agrupa las sub-secciones.
export const DenunciasSection = () => {
  return (
    <div>
      <ProyectosBajoLaLupaSection />
      <PtarTiticacaSection />
      <ImageneSection />
      <PebltSection />
      <ProyeccionSection />
      <FuturoLagoSection />
    </div>
  );
};

export default DenunciasSection;
