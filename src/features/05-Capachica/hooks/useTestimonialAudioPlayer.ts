/**
 * Manages scrubbed/section-based audio playback for a testimonial's story fragments.
 * Auto-plays the audio matching the current fragment, auto-advances to the next
 * fragment when the audio finishes (if the audio toggle is active), and restarts
 * the current fragment's audio whenever the toggle is turned back on.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import type { TestimonyItem } from "../types/TestimonialType";

interface UseTestimonialAudioPlayerReturn {
  currentIndex: number;
  isPlaying: boolean;
  isLast: boolean;
  toggleAudio: () => void;
  goNext: () => void;
}

export const useTestimonialAudioPlayer = (
  testimony: TestimonyItem[]
): UseTestimonialAudioPlayerReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLast = currentIndex === testimony.length - 1;

  useEffect(() => {
    // Always tear down any previous audio before deciding what to do next.
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!isPlaying) return;

    const audio = new Audio(testimony[currentIndex].audioSrc);
    audioRef.current = audio;

    audio.onended = () => {
      setCurrentIndex((prev) =>
        prev < testimony.length - 1 ? prev + 1 : prev
      );
    };

    audio.play().catch(() => {
      // Autoplay might be blocked by the browser until user interaction; ignore.
    });

    return () => {
      audio.onended = null;
      audio.pause();
    };
  }, [currentIndex, isPlaying, testimony]);

  const toggleAudio = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < testimony.length - 1 ? prev + 1 : prev
    );
  }, [testimony.length]);

  return { currentIndex, isPlaying, isLast, toggleAudio, goNext };
};