/**
 * Centralized testimonial content, assets and interactive area definitions.
 */

import bg from "../assets/testimonials/images/testimonials-background.png";
import person1Bg from "../assets/testimonials/images/capachica-landscape-background.png";
import person2Bg from "../assets/testimonials/images/capachica-landscape-background.png";
import person3Bg from "../assets/testimonials/images/capachica-landscape-background.png";
import felicianaChar from "../assets/testimonials/images/feliciana-character.png";
import juliana from "../assets/testimonials/images/juliana-character.png";
import victorChar from "../assets/testimonials/images/victor-character.png";
import type { Testimonial } from "../types/TestimonialType";

export const TESTIMONIAL_BACKGROUND = bg;
export const TESTIMONIAL_TITLE = "LAS VOCES QUE NADIE ESCUCHA";
export const TESTIMONIAL_SUBTITLE = "Haz click en los pobladores para conocer su historia";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Feliciana Suaña",
    testimony: [
      { id: 1, text: "La contaminación viene de ese río. Nosotros no tomamos, solo a nuestros animales les hacemos tomar. No estoy bien; me duele todo mi cuerpo, todo, todito. Mi oído ya no escucha." },
      { id: 2, text: "Mis pies me duelen demasiado. Ahora tengo que cubrirlos con trapos. Ya no puedo caminar como antes; se me hace imposible ir lejos, solo logro avanzar distancias muy cortas. " },
    ],
    backgroundImage: person1Bg,
    characterImage: felicianaChar,
    audioSrc: "/src/assets/testimonios/audio-1.mp3",
    clickArea: { left: "10%", top: "35%", width: "22%", height: "50%" },
  },
  {
    id: 2,
    name: "Victor Chata Grande",
    testimony: [
      { id: 1, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
    ],
    backgroundImage: person2Bg,
    characterImage: victorChar,
    audioSrc: "/src/assets/testimonios/audio-2.mp3",
    clickArea: { left: "42%", top: "22%", width: "19%", height: "70%" },
  },
  {
    id: 3,
    name: "Juliana Churata",
    testimony: [
      { id: 1, text: "Yo estoy enferma por metales pesados desde hace cuatro años. Me dolía toda la parte interna de mi cuerpo y no me permitía comer. Desde pequeña, criábamos animales y consumíamos el agua de esa laguna." },
      { id: 2, text: "Desde ahora ya no lo consumimos. Ya no han venido de nuevo a hacerme el análisis. Me dijeron que dentro de cuatro años debía hacerme analizar, pero no me han hecho los análisis. Ahora no se sabe si hay o no." },
      { id: 3, text: "Mi hija también tiene metal pesado y no ha recibido\ntratamiento en su colegio. Esto es grave, aquí en Puno ya falleció la señora Rufina y también el señor Alberto Paucar. Según los análisis, a causa del metal pesado." },
    ],
    backgroundImage: person3Bg,
    characterImage: juliana,
    audioSrc: "/src/assets/testimonios/audio-3.mp3",
    clickArea: { left: "70%", top: "35%", width: "22%", height: "55%" },
  },
];