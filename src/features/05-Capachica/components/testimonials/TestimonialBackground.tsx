/**
 * Interactive testimonial map view that displays selectable characters and contextual tooltips.
 */
import { useState } from "react";
import { TESTIMONIAL_BACKGROUND, TESTIMONIAL_TITLE, TESTIMONIAL_SUBTITLE } from "../../constants/testimonial.constants";
import type { Testimonial } from "../../types/TestimonialType";

const TOOLTIP_STYLES: string[] = [
  "bg-[#0EA483] text-white",
  "bg-[#1A3932] text-white",
  "bg-[#8AB1BD] text-white",
];

interface TooltipState {
  x: number;
  y: number;
  text: string;
  colorClass: string;
}

interface TestimonialBackgroundProps {
  testimonials: Testimonial[];
  onSelectPerson: (id: number) => void;
}

export const TestimonialBackground = ({ testimonials, onSelectPerson }: TestimonialBackgroundProps) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseMove = (e: React.MouseEvent, text: string, colorClass: string) => {
    setTooltip({ x: e.clientX, y: e.clientY, text, colorClass });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={TESTIMONIAL_BACKGROUND}
        alt="Testimonios"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="absolute bottom-[18%] left-1/2 z-10 flex w-full max-w-275 -translate-x-1/2 items-end justify-center gap-1 px-4 sm:bottom-[2%] sm:gap-3 sm:px-6 md:bottom-[6%] md:gap-6 lg:bottom-0 lg:px-8">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectPerson(t.id)}
            onMouseMove={(e) => handleMouseMove(e, `Conocer testimonio de ${t.name}`, TOOLTIP_STYLES[i])}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              handleMouseMove(
                { clientX: touch.clientX, clientY: touch.clientY } as unknown as React.MouseEvent,
                `Conocer testimonio de ${t.name}`,
                TOOLTIP_STYLES[i]
              );
            }}
            aria-label={`Ver testimonio de ${t.name}`}
            className="block w-1/3 cursor-pointer p-0 leading-none focus:outline-none"
          >
            <img
              src={t.seatedImage}
              alt={`Personaje ${t.name}`}
              className="block h-auto w-full select-none pointer-events-none drop-shadow-lg transition-transform duration-200 hover:scale-105"
              draggable={false}
            />
          </button>
        ))}
      </div>

      <p className="absolute left-1/2 top-4 z-20 w-full -translate-x-1/2 px-4 text-center font-[Citizen] text-[20px] font-bold uppercase leading-tight tracking-[0.02em] text-[#F5F5F5] sm:top-6 sm:text-[28px] md:top-8 md:text-[34px] lg:top-10 lg:text-[40px]">
        {TESTIMONIAL_TITLE}
      </p>
      <p
        className="absolute bottom-4 left-1/2 z-20 w-full -translate-x-1/2 px-4 text-center font-[Citizen] text-[13px] font-normal leading-snug text-white sm:bottom-6 sm:text-[18px] md:bottom-8 md:text-[22px] lg:bottom-10 lg:text-[26px]"
        style={{ WebkitTextStroke: "2px #151B1B", paintOrder: "stroke fill" }}
      >
        {TESTIMONIAL_SUBTITLE}
      </p>

      {tooltip && (
        <div
          className={`fixed z-50 hidden rounded-lg px-3 py-2 text-xs font-bold shadow-lg pointer-events-none sm:block sm:px-4 sm:text-sm ${tooltip.colorClass}`}
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};