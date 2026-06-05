import bg from "/src/assets/testimonials/testimonials-background.png";
import person1Bg from "/src/assets/testimonials/capachica-landscape-background.png";
import person2Bg from "/src/assets/testimonials/capachica-landscape-background.png";
import person3Bg from "/src/assets/testimonials/capachica-landscape-background.png";

export interface Testimonial {
  id: number;
  name: string;
  testimony: string;
  backgroundImage: string;
  audioSrc: string;
  clickArea: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
}

export const TESTIMONIAL_BACKGROUND = bg;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Feliciana",
    testimony:
      "Testimonio de máximo tres líneas. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    backgroundImage: person1Bg,
    audioSrc: "/src/assets/testimonios/audio-1.mp3",
    clickArea: { left: "5%", top: "15%", width: "22%", height: "70%" },
  },
  {
    id: 2,
    name: "Victor Chata Grande",
    testimony:
      "Testimonio de máximo tres líneas. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    backgroundImage: person2Bg,
    audioSrc: "/src/assets/testimonios/audio-2.mp3",
    clickArea: { left: "37%", top: "5%", width: "26%", height: "85%" },
  },
  {
    id: 3,
    name: "Juliana Churata",
    testimony:
      "Testimonio de máximo tres líneas. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    backgroundImage: person3Bg,
    audioSrc: "/src/assets/testimonios/audio-3.mp3",
    clickArea: { left: "73%", top: "15%", width: "22%", height: "70%" },
  },
];