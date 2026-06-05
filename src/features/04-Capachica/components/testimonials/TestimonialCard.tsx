import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { TestimonyItem } from "../../types/TestimonialType";

interface TestimonialCardProps {
  name: string;
  testimony: TestimonyItem[];
  onClose: () => void;
}

export const TestimonialCard = ({
  name,
  testimony,
  onClose,
}: TestimonialCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === testimony.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-3xl">
      <div className="relative w-full bg-white/90 backdrop-blur-sm rounded-lg px-8 py-12 md:px-14 md:py-16 shadow-2xl text-center">
        <div className="
          absolute top-0 left-1/2
          -translate-x-1/2 -translate-y-1/2
          bg-black text-white font-bold
          text-xs md:text-sm
          px-10 py-2.5 rounded-md
          whitespace-nowrap
        ">
          {name}
        </div>

        <p className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed">
          {testimony[currentIndex].text}
        </p>

        {isLast ? (
          <button
            onClick={onClose}
            aria-label="Cerrar testimonio"
            className="
              absolute bottom-0 left-1/2
              -translate-x-1/2 translate-y-1/2
              w-11 h-11 rounded-full
              bg-gray-700/90 text-white font-bold text-base
              flex items-center justify-center
              hover:bg-gray-900 transition-all duration-300 shadow-xl
            "
          >
            ✕
          </button>
        ) : (
          <button
            onClick={handleNext}
            aria-label="Continuar testimonio"
            className="
              absolute bottom-0 left-1/2
              -translate-x-1/2 translate-y-1/2
              w-11 h-11 rounded-full
              bg-gray-700/90 text-white
              flex items-center justify-center
              hover:bg-gray-900 transition-all duration-300 shadow-xl
            "
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
};