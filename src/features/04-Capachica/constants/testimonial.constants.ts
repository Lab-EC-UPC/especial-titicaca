/**
 * Centralized testimonial content, assets and interactive area definitions.
 */

import bg from "/src/assets/testimonials/images/testimonials-background.png";
import person1Bg from "/src/assets/testimonials/images/capachica-landscape-background.png";
import person2Bg from "/src/assets/testimonials/images/capachica-landscape-background.png";
import person3Bg from "/src/assets/testimonials/images/capachica-landscape-background.png";
import felicianaChar from "/src/assets/testimonials/images/feliciana-character.png";
import juliana from "/src/assets/testimonials/images/juliana-character.png";
import victorChar from "/src/assets/testimonials/images/victor-character.png";
import type { Testimonial } from "../types/TestimonialType";

export const TESTIMONIAL_BACKGROUND = bg;
export const TESTIMONIAL_TITLE = "TESTIMONIOS";
export const TESTIMONIAL_SUBTITLE = "Haz click en los pobladores para conocer su historia";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Feliciana Suaña",
    testimony: [
      { id: 1, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
      { id: 2, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
      { id: 3, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
      { id: 4, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
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
      { id: 1, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
      { id: 2, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
      { id: 3, text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya." },
    ],
    backgroundImage: person3Bg,
    characterImage: juliana,
    audioSrc: "/src/assets/testimonios/audio-3.mp3",
    clickArea: { left: "70%", top: "35%", width: "22%", height: "55%" },
  },
];