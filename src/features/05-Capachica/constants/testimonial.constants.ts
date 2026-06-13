/**
 * Centralized testimonial content, assets and interactive area definitions.
 */
import bg from "../assets/testimonials/images/testimonials-background.png";
import bgPersonView from "../assets/testimonials/images/capachica-landscape-background.png";
import feliciana from "../assets/testimonials/images/feliciana-character.png";
import juliana from "../assets/testimonials/images/juliana-character.png";
import victor from "../assets/testimonials/images/victor-character.png";
import julianaSeated from "../assets/testimonials/images/juliana-seated.png";
import felicianaSeated from "../assets/testimonials/images/feliciana-seated.png";
import victorStand from "../assets/testimonials/images/victor-stand.png";
import type { Testimonial } from "../types/TestimonialType";
import feliciana_1_audio from "../assets/audios/feliciana_1.mp3";
import feliciana_2_audio from "../assets/audios/feliciana_2.mp3";
import juliana_1_audio from "../assets/audios/juliana_1.mp3";
import juliana_2_audio from "../assets/audios/juliana_2.mp3";
import juliana_3_audio from "../assets/audios/juliana_3.mp3";
import victor_1_audio from "../assets/audios/victor_1.mp3";

export const TESTIMONIAL_BACKGROUND = bg;
export const TESTIMONIAL_TITLE = "LAS VOCES QUE NADIE ESCUCHA";
export const TESTIMONIAL_SUBTITLE = "Haz click en los pobladores para conocer su historia";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Feliciana Suaña",
    testimony: [
      {
        id: 1,
        text: "La contaminación viene de ese río. Nosotros no tomamos, solo a nuestros animales les hacemos tomar. No estoy bien; me duele todo mi cuerpo, todo, todito. Mi oído ya no escucha.",
        audioSrc: feliciana_1_audio,
      },
      {
        id: 2,
        text: "Mis pies me duelen demasiado. Ahora tengo que cubrirlos con trapos. Ya no puedo caminar como antes; se me hace imposible ir lejos, solo logro avanzar distancias muy cortas. ",
        audioSrc: feliciana_2_audio,
      },
    ],
    backgroundImage: bgPersonView,
    characterImage: feliciana,
    seatedImage: felicianaSeated,
    position: { left: "50%", bottom: "0%", width: "26%" },
  },
  {
    id: 2,
    name: "Victor Chata Grande",
    testimony: [
      {
        id: 1,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
        audioSrc: victor_1_audio,
      },
    ],
    backgroundImage: bgPersonView,
    characterImage: victor,
    seatedImage: victorStand,
    position: { left: "50%", bottom: "0%", width: "24%" },
  },
  {
    id: 3,
    name: "Juliana Churata",
    testimony: [
      {
        id: 1,
        text: "Yo estoy enferma por metales pesados desde hace cuatro años. Me dolía toda la parte interna de mi cuerpo y no me permitía comer. Desde pequeña, criábamos animales y consumíamos el agua de esa laguna.",
        audioSrc: juliana_1_audio,
      },
      {
        id: 2,
        text: "Desde ahora ya no lo consumimos. Ya no han venido de nuevo a hacerme el análisis. Me dijeron que dentro de cuatro años debía hacerme analizar, pero no me han hecho los análisis. Ahora no se sabe si hay o no.",
        audioSrc: juliana_2_audio,
      },
      {
        id: 3,
        text: "Mi hija también tiene metal pesado y no ha recibido\ntratamiento en su colegio. Esto es grave, aquí en Puno ya falleció la señora Rufina y también el señor Alberto Paucar. Según los análisis, a causa del metal pesado.",
        audioSrc: juliana_3_audio,
      },
    ],
    backgroundImage: bgPersonView,
    characterImage: juliana,
    seatedImage: julianaSeated,
    position: { left: "50%", bottom: "0%", width: "26%" },
  },
];