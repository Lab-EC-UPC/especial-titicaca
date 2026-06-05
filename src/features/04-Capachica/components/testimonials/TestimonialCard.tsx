/**
 * Testimonial card with multi-step navigation between testimony fragments.
 */

import { useState } from "react";
import closeIcon from "/src/assets/testimonials/icons/close-icon.png";
import nextIcon from "/src/assets/testimonials/icons/next-icon.png";
import type { TestimonyItem } from "../../types/TestimonialType";

interface TestimonialCardProps {
  name: string;
  testimony: TestimonyItem[];
  onClose: () => void;
}

export const TestimonialCard = ({ name, testimony, onClose }: TestimonialCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === testimony.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="absolute bottom-10 left-1/2 z-20 w-[92%] max-w-3xl -translate-x-1/2">
      <div className="relative w-full rounded-[15px] border-2 border-white/20 bg-white/15 px-8 py-12 text-center shadow-2xl backdrop-blur-[15px] md:px-14 md:py-16">
        <div className="absolute left-1/2 top-0 flex h-[56.97px] w-[239.23px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-[#21292C]">
          <span className="font-[Citizen] text-[19px] font-bold text-white">
            {name}
          </span>
        </div>

        <p className="mx-auto max-w-[698.4px] text-center font-[Elza,Arial,Helvetica,sans-serif] text-[26px] font-normal leading-7.75 text-white">
          {testimony[currentIndex].text}
        </p>

        <button onClick={isLast ? onClose : handleNext} aria-label={isLast ? "Cerrar testimonio" : "Continuar testimonio"} className="absolute bottom-0 left-1/2 flex h-11 w-11 -translate-x-1/2 translate-y-1/2 items-center justify-center transition-opacity duration-300 hover:opacity-80">
          <img src={isLast ? closeIcon : nextIcon} alt={isLast ? "Cerrar" : "Continuar"} className="h-full w-full object-contain" />
        </button>
      </div>
    </div>
  );
};