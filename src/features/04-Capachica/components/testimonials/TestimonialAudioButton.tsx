import { Volume2, VolumeX } from "lucide-react";

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
      rounded-full border-2 border-white
      bg-black/30 backdrop-blur-sm
      flex items-center justify-center text-white
      hover:bg-black/50 transition-all duration-300
    "
  >
    {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
  </button>
);