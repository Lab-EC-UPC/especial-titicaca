import { useState, useEffect, type RefObject } from 'react';
import { clamp } from './mathUtils';

export const useScrollFrame = (ref: RefObject<HTMLElement>, total: number) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalHeight = ref.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const ratio = clamp(scrolled / totalHeight, 0, 1);
      setIdx(Math.round(ratio * (total - 1)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, total]);

  return { idx, progress: idx / (total - 1) };
};