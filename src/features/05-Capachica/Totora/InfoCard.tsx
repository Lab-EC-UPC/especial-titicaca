type Props = {
  text: string;
  top: string;
  side: "left" | "right";
  visible: boolean;
  delay: number;
};

export const InfoCard = ({ text, top, side, visible, delay }: Props) => {
  const hiddenOffset = side === "left" ? -24 : 24;
  return (
    <div
      style={{
        position: "absolute",
        top,
        [side]: 0,
        width: "clamp(110px, 14vw, 190px)",
        background: "rgba(20,32,40,0.85)",
        backdropFilter: "blur(8px)",
        borderRadius: "8px",
        borderLeft: side === "left" ? "3px solid #C83C6E" : "none",
        borderRight: side === "right" ? "3px solid #C83C6E" : "none",
        padding: "clamp(8px, 1.1vw, 12px) clamp(10px, 1.4vw, 16px)",
        color: "rgba(255,255,255,0.92)",
        fontSize: "clamp(10px, 1.05vw, 14px)",
        fontWeight: 400,
        lineHeight: 1.55,
        letterSpacing: "0.01em",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${hiddenOffset}px)`,
        transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
      }}
    >
      {text}
    </div>
  );
};
