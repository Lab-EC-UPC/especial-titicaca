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
    <div className="relative w-full overflow-hidden">
      <img src={TESTIMONIAL_BACKGROUND} alt="Testimonios" className="block h-auto w-full" />

      <p className="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 items-center whitespace-nowrap text-center font-[Citizen] text-[40px] font-bold uppercase tracking-[0.02em] text-[#F5F5F5]">
        {TESTIMONIAL_TITLE}
      </p>

      <p className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-center font-[Citizen] text-[26px] font-normal text-white" style={{ WebkitTextStroke: "3.2px #151B1B", paintOrder: "stroke fill" }}>
        {TESTIMONIAL_SUBTITLE}
      </p>

      {testimonials.map((t, i) => (
        <button
          key={t.id}
          onClick={() => onSelectPerson(t.id)}
          onMouseMove={(e) => handleMouseMove(e, `Conocer testimonio de ${t.name}`, TOOLTIP_STYLES[i])}
          onMouseLeave={handleMouseLeave}
          aria-label={`Ver testimonio de ${t.name}`}
          className="absolute cursor-pointer"
          style={{ left: t.clickArea.left, top: t.clickArea.top, width: t.clickArea.width, height: t.clickArea.height }}
        />
      ))}

      {tooltip && (
        <div className={`fixed z-50 rounded-lg px-4 py-2 text-sm font-bold shadow-lg pointer-events-none ${tooltip.colorClass}`} style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
};