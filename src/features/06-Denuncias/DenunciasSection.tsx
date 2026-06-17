import { ProyectosBajoLaLupaSection } from "./ProyectosBajoLaLupaSection";
import { PtarTiticacaSection } from "./PtarTiticacaSection";
import { ImageneSection } from "./ImageneSection";
import { PebltSection } from "./PebltSection";
import { ProyeccionSection } from "./ProyeccionSection";
// import { FuturoLagoSection } from "./FuturoLagoSection"; // Oculto por el momento, se hará visible más adelante

// Sección principal de Denuncias: agrupa las sub-secciones.
export const DenunciasSection = () => {
  return (
    <div>
      <ProyectosBajoLaLupaSection />
      <PtarTiticacaSection />
      <ImageneSection />
      <PebltSection />
      <ProyeccionSection />
      {/* <FuturoLagoSection /> Oculto por el momento, se hará visible más adelante */}
    </div>
  );
};

export default DenunciasSection;
