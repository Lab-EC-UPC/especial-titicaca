import { useState } from "react";
import {
  TESTIMONIAL_BACKGROUND,
  type Testimonial,
} from "../../constants/testimonial.constants";

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

export const TestimonialBackground = ({
  testimonials,
  onSelectPerson,
}: TestimonialBackgroundProps) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent,
    text: string,
    colorClass: string
  ) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      text,
      colorClass,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="w-full relative overflow-hidden">
      <img
        src={TESTIMONIAL_BACKGROUND}
        alt="Testimonios"
        className="w-full h-auto block"
      />

      {testimonials.map((t, i) => (
        <button
          key={t.id}
          onClick={() => onSelectPerson(t.id)}
          onMouseMove={(e) =>
            handleMouseMove(
              e,
              `Conocer testimonio de ${t.name}`,
              TOOLTIP_STYLES[i]
            )
          }
          onMouseLeave={handleMouseLeave}
          aria-label={`Ver testimonio de ${t.name}`}
          className="absolute cursor-pointer"
          style={{
            left: t.clickArea.left,
            top: t.clickArea.top,
            width: t.clickArea.width,
            height: t.clickArea.height,
          }}
        />
      ))}

      {tooltip && (
        <div
          className={`
            fixed z-50 pointer-events-none
            px-4 py-2 rounded-lg
            text-sm font-bold shadow-lg
            ${tooltip.colorClass}
          `}
          style={{
            left: tooltip.x + 14,
            top: tooltip.y + 14,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};