import type { Testimonial } from "../../constants/testimonial.constants";
import { TestimonialAudioButton } from "./TestimonialAudioButton";
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialPersonViewProps {
  testimonial: Testimonial;
  isPlaying: boolean;
  onClose: () => void;
  onToggleAudio: () => void;
}

export const TestimonialPersonView = ({
  testimonial,
  isPlaying,
  onClose,
  onToggleAudio,
}: TestimonialPersonViewProps) => (
  <div className="w-screen h-screen relative overflow-hidden">
    <img
      src={testimonial.backgroundImage}
      alt={testimonial.name}
      className="w-full h-full object-cover"
    />
    <TestimonialAudioButton isPlaying={isPlaying} onToggle={onToggleAudio} />
    <TestimonialCard
      name={testimonial.name}
      testimony={testimonial.testimony}
      onClose={onClose}
    />
  </div>
);