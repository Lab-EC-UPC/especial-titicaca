/**
 * Testimonial selection state manager (which person's view is open).
 */
import { useState, useCallback } from "react";

interface UseTestimonialReturn {
  selectedId: number | null;
  selectPerson: (id: number) => void;
  closePerson: () => void;
}

export const useTestimonial = (): UseTestimonialReturn => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectPerson = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const closePerson = useCallback(() => {
    setSelectedId(null);
  }, []);

  return { selectedId, selectPerson, closePerson };
};