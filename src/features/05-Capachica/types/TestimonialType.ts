/**
 * Shared domain types used across the testimonial section.
 */
export interface TestimonyItem {
  id: number;
  text: string;
  audioSrc: string;
}

export interface Testimonial {
  id: number;
  name: string;
  testimony: TestimonyItem[];
  backgroundImage: string;
  backgroundImageMobile: string;
  characterImage: string;
  seatedImage: string;
  position: {
    left: string;
    bottom: string;
    width: string;
  };
}