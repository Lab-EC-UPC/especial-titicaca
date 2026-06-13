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
  <button
    onClick={onToggle}
    aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
    className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full transition-opacity duration-300 hover:opacity-80 sm:top-5 sm:h-10 sm:w-10 md:left-auto md:right-16 md:translate-x-0 md:h-11 md:w-11"
  >
    <img src={isPlaying ? audioMutedIcon : audioUnmutedIcon} alt={isPlaying ? "Pausar audio" : "Reproducir audio"} className="h-full w-full object-contain" />
  </button>
);