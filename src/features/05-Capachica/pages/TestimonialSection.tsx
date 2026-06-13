import { useTestimonial } from "../hooks/useTestimonial";
import { TESTIMONIALS } from "../constants/testimonial.constants";
import { TestimonialBackground } from "../components/testimonials/TestimonialBackground";
import { TestimonialPersonView } from "../components/testimonials/TestimonialPersonView";

export const TestimonialSection = () => {
  const { selectedId, selectPerson, closePerson } = useTestimonial();

  const selectedTestimonial = TESTIMONIALS.find((t) => t.id === selectedId) ?? null;

  return (
    <div id="testimonios" className="relative w-full h-full">
      {selectedTestimonial ? (
        <TestimonialPersonView
          key={selectedTestimonial.id}
          testimonial={selectedTestimonial}
          onClose={closePerson}
        />
      ) : (
        <TestimonialBackground
          testimonials={TESTIMONIALS}
          onSelectPerson={selectPerson}
        />
      )}
    </div>
  );
};