/**
 * Audio control button for testimonial playback, allowing users to play or pause narration.
 */

import audioMutedIcon from "../../assets/testimonials/icons/audio-muted-icon.png";
import audioUnmutedIcon from "../../assets/testimonials/icons/audio-unmuted-icon.png";

interface TestimonialAudioButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const TestimonialAudioButton = ({ isPlaying, onToggle }: TestimonialAudioButtonProps) => (
  <button onClick={onToggle} aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"} className="absolute top-5 right-16 z-30 flex h-12 w-12 items-center justify-center rounded-full transition-opacity duration-300 hover:opacity-80 md:h-14 md:w-14">
    <img src={isPlaying ? audioMutedIcon : audioUnmutedIcon} alt={isPlaying ? "Pausar audio" : "Reproducir audio"} className="h-full w-full object-contain" />
  </button>
);