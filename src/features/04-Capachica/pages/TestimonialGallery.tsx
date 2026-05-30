import { useTestimonial } from "../hooks/useTestimonial";
import { TESTIMONIALS } from "../constants/testimonial.constants";
import { TestimonialBackground } from "../components/testimonials/TestimonialBackground";
import { TestimonialPersonView } from "../components/testimonials/TestimonialPersonView";

export const TestimonialGallery = () => {
  const { selectedId, isPlaying, selectPerson, closePerson, toggleAudio } =
    useTestimonial();

  const selectedTestimonial =
    TESTIMONIALS.find((t) => t.id === selectedId) ?? null;

  return (
    <div
      id="testimonios"
      className="relative w-full h-full"
    >
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