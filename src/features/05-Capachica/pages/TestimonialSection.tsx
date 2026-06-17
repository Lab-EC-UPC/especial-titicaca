import { useState, useCallback } from "react";
import { TESTIMONIALS } from "../constants/testimonial.constants";
import { TestimonialBackground } from "../components/testimonials/TestimonialBackground";
import { TestimonialPersonView } from "../components/testimonials/TestimonialPersonView";

const FADE_MS = 900;

export const TestimonialSection = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [closingId, setClosingId] = useState<number | null>(null);

  const selectPerson = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const closePerson = useCallback(() => {
    const current = selectedId;
    setClosingId(current);
    window.setTimeout(() => {
      setSelectedId(null);
      setClosingId(null);
    }, FADE_MS);
  }, [selectedId]);

  const selectedTestimonial = TESTIMONIALS.find((t) => t.id === selectedId) ?? null;
  const isClosing = closingId !== null;

  return (
    <div id="testimonios" className="relative w-full h-full">
      <TestimonialBackground
        testimonials={TESTIMONIALS}
        onSelectPerson={selectPerson}
        hidden={selectedId !== null && !isClosing}
      />
      {selectedTestimonial && (
        <div className="absolute inset-0">
          <TestimonialPersonView
            key={selectedTestimonial.id}
            testimonial={selectedTestimonial}
            onClose={closePerson}
            isClosing={isClosing}
          />
        </div>
      )}
    </div>
  );
};