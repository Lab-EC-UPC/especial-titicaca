import { useTestimonial } from "../../hooks/useTestimonial";
import { TESTIMONIALS } from "../../constants/testimonial.constants";
import { TestimonialBackground } from "./TestimonialBackground";
import { TestimonialPersonView } from "./TestimonialPersonView";

export const TestimonialGallery = () => {
  const { selectedId, isPlaying, selectPerson, closePerson, toggleAudio } =
    useTestimonial();

  const selectedTestimonial = TESTIMONIALS.find((t) => t.id === selectedId) ?? null;

  return (
    <div id="testimonios">
      {selectedTestimonial ? (
        <TestimonialPersonView
          testimonial={selectedTestimonial}
          isPlaying={isPlaying}
          onClose={closePerson}
          onToggleAudio={() => toggleAudio(selectedTestimonial.audioSrc)}
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