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
  audioSrc: string;
  clickArea: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
}