import bg from "/src/assets/testimonials/testimonials-background.png";
import person1Bg from "/src/assets/testimonials/capachica-landscape-background.png";
import person2Bg from "/src/assets/testimonials/capachica-landscape-background.png";
import person3Bg from "/src/assets/testimonials/capachica-landscape-background.png";
import type { Testimonial } from "../types/TestimonialType";

export const TESTIMONIAL_BACKGROUND = bg;
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Feliciana Suaña",
    testimony: [
      {
        id: 1,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
      {
        id: 2,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
      {
        id: 3,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
      {
        id: 4,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
    ],
    backgroundImage: person1Bg,
    audioSrc: "/src/assets/testimonios/audio-1.mp3",
    clickArea: {
      left: "5%",
      top: "15%",
      width: "22%",
      height: "70%",
    },
  },
  {
    id: 2,
    name: "Victor Chata Grande",
    testimony: [
      {
        id: 1,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
    ],
    backgroundImage: person2Bg,
    audioSrc: "/src/assets/testimonios/audio-2.mp3",
    clickArea: {
      left: "37%",
      top: "5%",
      width: "26%",
      height: "85%",
    },
  },
  {
    id: 3,
    name: "Juliana Churata",
    testimony: [
      {
        id: 1,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
      {
        id: 2,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
      {
        id: 3,
        text: "Para el ganado estamos consumiendo agua del subsuelo; por eso les da diarrea y no pueden engordar. Nosotros vivimos de esto, y si vas al borde del río Coata, por los desbordes, la agricultura tampoco produce ya.",
      },
    ],
    backgroundImage: person3Bg,
    audioSrc: "/src/assets/testimonios/audio-3.mp3",
    clickArea: {
      left: "73%",
      top: "15%",
      width: "22%",
      height: "70%",
    },
  },
];