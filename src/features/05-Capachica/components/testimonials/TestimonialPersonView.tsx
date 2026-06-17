/**
 * Testimonial experience combining background, character, audio controls and story card.
 */
import type { Testimonial } from "../../types/TestimonialType";
import { useTestimonialAudioPlayer } from "../../hooks/useTestimonialAudioPlayer";
import { TestimonialAudioButton } from "./TestimonialAudioButton";
import { TestimonialCard } from "./TestimonialCard";
import { useState, useEffect } from "react";

const FADE_MS = 900;

interface TestimonialPersonViewProps {
  testimonial: Testimonial;
  onClose: () => void;
  isClosing: boolean;
}

export const TestimonialPersonView = ({ testimonial, onClose, isClosing }: TestimonialPersonViewProps) => {
  const { currentIndex, isPlaying, goNext, toggleAudio } = useTestimonialAudioPlayer(
    testimonial.testimony
  );

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`relative h-full w-full overflow-hidden transition-opacity ease-in-out ${
        isVisible && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <img
        src={testimonial.backgroundImageMobile}
        alt={testimonial.name}
        className="absolute inset-0 block h-full w-full object-cover sm:hidden"
      />
      <img
        src={testimonial.backgroundImage}
        alt={testimonial.name}
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
      />

      <div className="absolute bottom-[28%] left-1/2 w-full -translate-x-1/2 overflow-hidden h-[50%] sm:bottom-0 sm:h-[75%] md:h-[90%] md:w-full">
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