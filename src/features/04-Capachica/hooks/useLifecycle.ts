import { useState, useCallback } from "react";

interface UseLifecycleReturn {
  current: number;
  goTo: (index: number) => void;
}

export const useLifecycle = (): UseLifecycleReturn => {
  const [current, setCurrent] = useState<number>(0);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setCurrent(index);
  }, [current]);

  return { current, goTo };
};