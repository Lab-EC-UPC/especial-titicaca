/**
 * Testimonial card with multi-step navigation between testimony fragments.
 */
import { useState } from "react";
import closeIcon from "../../assets/testimonials/icons/close-icon.png";
import nextIcon from "../../assets/testimonials/icons/next-icon.png";
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
    <div className="absolute bottom-10 left-1/2 z-20 w-[92vw] -translate-x-1/2 sm:bottom-14 md:bottom-20 md:w-197.5 md:max-w-[92vw]">
      <div className="relative h-auto w-full rounded-[15px] border-2 border-[rgba(88,106,116,0.5)] bg-[rgba(21,27,27,0.65)] px-4 pt-6 pb-9 shadow-2xl backdrop-blur-[25px] sm:px-6 sm:pt-7 sm:pb-10 md:h-[251.04px] md:px-8 md:py-12">
        <div className="absolute left-1/2 top-0 flex h-9 w-[60%] max-w-[313.7px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-[#13A383] px-2 sm:h-10 md:h-[56.97px] md:w-[313.7px]">
          <span className="text-center font-[Citizen] text-[13px] leading-tight font-bold text-black sm:text-[16px] md:text-[19px] md:leading-4.75">
            {name}
          </span>
        </div>
        <div className="flex h-full items-center justify-center">
          <p className="whitespace-pre-line mx-auto max-w-full text-center font-[Elza] text-[15px] font-normal leading-6 text-white sm:max-w-[90%] sm:text-[19px] sm:leading-7 md:max-w-[698.4px] md:text-[26px] md:leading-7.75">
            {testimony[currentIndex].text}
          </p>
        </div>
        <button
          onClick={isLast ? onClose : handleNext}
          aria-label={isLast ? "Cerrar testimonio" : "Continuar testimonio"}
          className="absolute bottom-0 left-1/2 flex h-9 w-9 -translate-x-1/2 translate-y-1/2 items-center justify-center transition-opacity duration-300 hover:opacity-80 sm:h-10 sm:w-10 md:h-11 md:w-11"
        >
          <img
            src={isLast ? closeIcon : nextIcon}
            alt={isLast ? "Cerrar" : "Continuar"}
            className="h-full w-full object-contain"
          />
        </button>
      </div>
    </div>
  );
};