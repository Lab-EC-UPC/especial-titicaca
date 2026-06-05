import audioMutedIcon from "/src/assets/testimonials/icons/audio-muted-icon.png";
import audioUnmutedIcon from "/src/assets/testimonials/icons/audio-unmuted-icon.png";

interface TestimonialAudioButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const TestimonialAudioButton = ({
  isPlaying,
  onToggle,
}: TestimonialAudioButtonProps) => (
  <button
    onClick={onToggle}
    aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
    className="
      absolute top-5 right-5 z-30
      w-12 h-12 md:w-14 md:h-14
      rounded-full
      flex items-center justify-center
      hover:opacity-80 transition-opacity duration-300
    "
  >
    <img
      src={isPlaying ? audioUnmutedIcon : audioMutedIcon}
      alt={isPlaying ? "Pausar audio" : "Reproducir audio"}
      className="w-full h-full object-contain"
    />
  </button>
);