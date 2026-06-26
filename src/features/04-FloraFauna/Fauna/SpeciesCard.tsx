import { motion } from "motion/react";
import type { Variants } from "motion/react";

import type { AnimalItem } from "./types";

type Props = {
  item: AnimalItem;
  index: number;
  isHovered: boolean;
  arrived: boolean;
  isInView: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggle: () => void;
  onArrived: () => void;
  variants: Variants;
};

const SIDE_VIEW_STYLE = { height: "100%", width: "auto", maxWidth: "100%", display: "block" } as const;

export const SpeciesCard = ({
  item, index, isHovered, arrived, isInView,
  onHoverStart, onHoverEnd, onToggle, onArrived, variants,
}: Props) => {
  const hasFrontal = Boolean(item.FrontalComponent);

  return (
    <motion.div
      className="relative flex w-full flex-col items-center sm:w-auto sm:flex-1 sm:min-w-0"
      variants={variants}
      onAnimationComplete={(def) => { if (def === "visible") onArrived(); }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onTap={onToggle}
      role="button"
      tabIndex={0}
      aria-pressed={isHovered}
      style={{ cursor: "pointer" }}
    >
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(110px, 26vw, 280px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "clamp(-3px, -0.4vw, -6px)",
          whiteSpace: "nowrap",
          color: "rgba(207,234,243,0.42)",
          textShadow: "0 2px 14px rgba(0,0,0,0.45)",
          zIndex: 0,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {item.numero}
      </motion.span>

      <motion.div
        className="relative z-10 mb-3 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
      >
        <h3 className="text-white font-bold" style={{ fontSize: "clamp(13px, 1.6vw, 19px)" }}>
          {item.nombre}
        </h3>
        <p className="italic" style={{ fontSize: "clamp(11px, 1.2vw, 15px)", color: "rgba(255,255,255,0.45)" }}>
          {item.cientifico}
        </p>
      </motion.div>

      <motion.div
        className="relative z-10"
        animate={{
          scale: isHovered ? 1.35 : 1,
          opacity: isHovered ? 0.55 : 1,
          filter: isHovered
            ? "brightness(0.45) drop-shadow(4px 8px 18px rgba(0,0,0,0.55))"
            : "brightness(1) drop-shadow(0px 0px 0px rgba(0,0,0,0))",
        }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        style={{
          height: "clamp(120px, 22vw, 320px)",
          width: "100%",
          transformOrigin: "bottom center",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ opacity: hasFrontal && arrived ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ height: "100%", maxWidth: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          {item.WalkComponent ? (
            <item.WalkComponent style={SIDE_VIEW_STYLE} />
          ) : (
            <motion.div
              animate={{ y: [0, -6, 0, 6, 0], rotate: [-2, 1.5, -1.5, 2, -2] }}
              transition={{ duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
              style={{ height: "100%", maxWidth: "100%", transformOrigin: "center", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            >
              <img
                src={item.img}
                alt={item.nombre}
                draggable={false}
                style={{ ...SIDE_VIEW_STYLE, objectFit: "contain" }}
              />
            </motion.div>
          )}
        </motion.div>

        {item.FrontalComponent && (
          <motion.div
            animate={{ opacity: arrived ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              height: "100%",
              maxWidth: "100%",
            }}
          >
            <item.FrontalComponent style={SIDE_VIEW_STYLE} />
          </motion.div>
        )}
      </motion.div>

      <motion.p
        className="relative z-10 text-white font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: "clamp(11px, 1.4vw, 17px)",
          letterSpacing: "1px",
          marginTop: "clamp(8px, 1.2vw, 14px)",
          minHeight: "clamp(16px, 2vw, 22px)",
        }}
      >
        {item.estado}
      </motion.p>
    </motion.div>
  );
};
