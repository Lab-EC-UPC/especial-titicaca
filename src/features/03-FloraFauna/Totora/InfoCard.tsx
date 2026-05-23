type Props = {
  text: string;
  top: string;
  side: "left" | "right";
  visible: boolean;
  delay: number;
};

export const InfoCard = ({ text, top, side, visible, delay }: Props) => {
  const hiddenOffset = side === "left" ? -18 : 18;
  return (
    <div
      style={{
        position: "absolute",
        top,
        [side]: 0,
        width: "clamp(95px, 13vw, 170px)",
        background: "rgba(45,60,70,0.78)",
        backdropFilter: "blur(6px)",
        borderRadius: "10px",
        padding: "clamp(6px, 1vw, 10px) clamp(8px, 1.2vw, 14px)",
        color: "#fff",
        fontSize: "clamp(9px, 1vw, 13px)",
        fontWeight: 500,
        lineHeight: 1.4,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${hiddenOffset}px)`,
        transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
      }}
    >
      {text}
    </div>
  );
};
