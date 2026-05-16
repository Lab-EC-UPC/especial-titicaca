import { useState, useRef, useCallback } from "react";

interface UseTestimonialReturn {
  selectedId: number | null;
  isPlaying: boolean;
  selectPerson: (id: number) => void;
  closePerson: () => void;
  toggleAudio: (audioSrc: string) => void;
}

export const useTestimonial = (): UseTestimonialReturn => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const selectPerson = useCallback(
    (id: number) => {
      stopAudio();
      setSelectedId(id);
    },
    [stopAudio]
  );

  const closePerson = useCallback(() => {
    stopAudio();
    setSelectedId(null);
  }, [stopAudio]);

  const toggleAudio = useCallback(
    (audioSrc: string) => {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioSrc);
        audioRef.current.onended = () => setIsPlaying(false);
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    [isPlaying]
  );

  return { selectedId, isPlaying, selectPerson, closePerson, toggleAudio };
};