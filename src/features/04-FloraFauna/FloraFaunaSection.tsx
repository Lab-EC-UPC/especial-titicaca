import { Fauna } from "./Fauna";
import { SocialCarousel, type SocialImage } from "./SocialCarousel";

// TODO: reemplazar estos placeholders por las 3 fotos reales del carrusel.
import Muestra1 from "./assets/Muestra1.png";
import Muestra2 from "./assets/Muestra2.png";
import Muestra3 from "./assets/Muestra3.png";

const SOCIAL_IMAGES: SocialImage[] = [
  {
    src: Muestra1,
    alt: "Contaminación en la orilla del lago",
    description: "Descripción del cuadro",
    subtext: "Año · Lugar de la foto",
  },
  {
    src: Muestra2,
    alt: "Residuos acumulados en la totora",
    description: "Descripción del cuadro",
    subtext: "Año · Lugar de la foto",
  },
  {
    src: Muestra3,
    alt: "Estado del ecosistema afectado",
    description: "Descripción del cuadro",
    subtext: "Año · Lugar de la foto",
  },
];

export const FloraFaunaSection = () => (
  <>
    <Fauna />
    <SocialCarousel
      title="¿Qué no muestran las redes sociales?"
      images={SOCIAL_IMAGES}
    />
  </>
);

export default FloraFaunaSection;
