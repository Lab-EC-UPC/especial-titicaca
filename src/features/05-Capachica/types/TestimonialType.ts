/**
 * Shared domain types used across the testimonial section.
 */
export interface TestimonyItem {
  id: number;
  text: string;
}

export interface Testimonial {
  id: number;
  name: string;
  testimony: TestimonyItem[];
  backgroundImage: string;
  characterImage: string;
  seatedImage: string;
  audioSrc: string;
  position: {
    left: string;
    bottom: string;
    width: string;
  };
}