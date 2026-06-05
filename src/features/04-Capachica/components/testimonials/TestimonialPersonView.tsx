import type { Testimonial } from "../../types/TestimonialType";
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
  <div className="w-full h-screen relative overflow-hidden">

    <img src={testimonial.backgroundImage} alt={testimonial.name} className="absolute inset-0 w-full h-full object-cover" />

   <div className="absolute bottom-0 left-1/2 md:left-[53%] -translate-x-1/2 w-[90%] md:w-[65%] overflow-hidden md:h-[85%] h-auto">
      <img src={testimonial.characterImage} alt={`Personaje ${testimonial.name}`} className="w-full h-auto block md:h-[180%] md:object-top md:object-cover" />
    </div>

    <TestimonialAudioButton isPlaying={isPlaying} onToggle={onToggleAudio} />

    <TestimonialCard key={testimonial.id} name={testimonial.name} testimony={testimonial.testimony} onClose={onClose} />
  </div>
);