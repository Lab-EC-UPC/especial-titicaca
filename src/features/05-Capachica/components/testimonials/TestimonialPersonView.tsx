/**
 * Testimonial experience combining background, character, audio controls and story card.
 */
import type { Testimonial } from "../../types/TestimonialType";
import { useTestimonialAudioPlayer } from "../../hooks/useTestimonialAudioPlayer";
import { TestimonialAudioButton } from "./TestimonialAudioButton";
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialPersonViewProps {
  testimonial: Testimonial;
  onClose: () => void;
}

export const TestimonialPersonView = ({ testimonial, onClose }: TestimonialPersonViewProps) => {
  const { currentIndex, isPlaying, goNext, toggleAudio } = useTestimonialAudioPlayer(
    testimonial.testimony
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={testimonial.backgroundImage}
        alt={testimonial.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 overflow-hidden h-[70%] sm:h-[75%] md:h-[90%] md:w-full">
        <img
          src={testimonial.characterImage}
          alt={`Personaje ${testimonial.name}`}
          className="block h-full w-full object-contain object-bottom"
        />
      </div>
      <TestimonialAudioButton
        isPlaying={isPlaying}
        onToggle={toggleAudio}
      />
      <TestimonialCard
        name={testimonial.name}
        testimony={testimonial.testimony}
        currentIndex={currentIndex}
        onNext={goNext}
        onClose={onClose}
      />
    </div>
  );
};