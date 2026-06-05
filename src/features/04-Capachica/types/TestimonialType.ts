export interface TestimonyItem {
  id: number;
  text: string;
}

export interface Testimonial {
  id: number;
  name: string;
  testimony: TestimonyItem[];
  backgroundImage: string;
  audioSrc: string;
  clickArea: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
}