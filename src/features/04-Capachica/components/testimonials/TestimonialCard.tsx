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
        <div className="absolute bottom-20 left-1/2 z-20 w-197.5 max-w-[92vw] -translate-x-1/2">
            <div className="relative h-[251.04px] w-full rounded-[15px] border-2 border-[rgba(88,106,116,0.5)] bg-[rgba(21,27,27,0.65)] px-8 py-12 shadow-2xl backdrop-blur-[25px]">
                <div className="absolute left-1/2 top-0 flex h-[56.97px] w-[313.7px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-[#13A383]">
                    <span className="font-[Citizen] text-[19px] leading-4.75 font-bold text-black">
                        {name}
                    </span>
                </div>

                <div className="flex h-full items-center justify-center">
                    <p className="whitespace-pre-line mx-auto max-w-[698.4px] text-center font-[Elza] text-[26px] font-normal leading-7.75 text-white">
                        {testimony[currentIndex].text}
                    </p>
                </div>

                <button
                    onClick={isLast ? onClose : handleNext}
                    aria-label={isLast ? "Cerrar testimonio" : "Continuar testimonio"}
                    className="absolute bottom-0 left-1/2 flex h-11 w-11 -translate-x-1/2 translate-y-1/2 items-center justify-center transition-opacity duration-300 hover:opacity-80"
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