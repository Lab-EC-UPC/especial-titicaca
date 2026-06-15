import { Fauna } from "./Fauna";
import { SocialCarousel, type SocialImage } from "./SocialCarousel";

// TODO: reemplazar estos placeholders por las 3 fotos reales del carrusel.
import Muestra1 from "./assets/Muestra1.webp";
import Muestra2 from "./assets/Muestra2.webp";
import Muestra3 from "./assets/Muestra3.webp";

const SOCIAL_IMAGES: SocialImage[] = [
  {
    src: Muestra1,
    alt: "Desechos",
    description: "Desechos en las orillas del Titicaca",
    subtext: "2026 / Andre Poma",
  },
  {
    src: Muestra2,
    alt: "Desechos",
    description: "Desechos en las orillas del Titicaca",
    subtext: "2026 / Andre Poma",
  },
  {
    src: Muestra3,
    alt: "Botaderos",
    description: "Botaderos en islas de los uros",
    subtext: "2026 / Andre Poma",
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
