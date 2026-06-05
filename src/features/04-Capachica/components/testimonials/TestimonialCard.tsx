import { useState } from "react";
import closeIcon from "/src/assets/testimonials/icons/close-icon.png";
import nextIcon from "/src/assets/testimonials/icons/next-icon.png";
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
      <div className="relative w-full text-center px-8 py-12 md:px-14 md:py-16 bg-white/15 border-2 border-white/20 backdrop-blur-[15px] rounded-[15px] shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[239.23px] h-[56.97px] bg-[#21292C] rounded-md flex items-center justify-center">
          <span
            style={{
              fontFamily: "Citizen",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "19px",
              lineHeight: "19px",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {name}
          </span>
        </div>

        <p
          style={{
            fontFamily: "Elza, Arial, Helvetica, sans-serif",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "26px",
            lineHeight: "31px",
            textAlign: "center",
            color: "#FFFFFF",
            maxWidth: "698.4px",
            margin: "0 auto",
          }}
        >
          {testimony[currentIndex].text}
        </p>

        <button
          onClick={isLast ? onClose : handleNext}
          aria-label={isLast ? "Cerrar testimonio" : "Continuar testimonio"}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-11 h-11 flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
        >
          <img
            src={isLast ? closeIcon : nextIcon}
            alt={isLast ? "Cerrar" : "Continuar"}
            className="w-full h-full object-contain"
          />
        </button>
      </div>
    </div>
  );
};