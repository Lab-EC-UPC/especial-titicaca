import { useEffect, useRef } from "react";

export const TotoraSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      const travelRange = windowH * 1.5;
      const progress = Math.min(Math.max(-rect.top / travelRange, 0), 1);

      const translateY = (1 - progress) * 45;
      content.style.transform = `translateY(${translateY}vh)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "400vh", background: "#1A4A7A" }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #A8D8E8 0%, #A8D8E8 45%, #2B6CB0 45%, #1A4A7A 100%)",
          }}
        />

        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-end"
          style={{
            transition: "transform 0.05s linear",
            willChange: "transform",
          }}
        >
          <div
            className="absolute top-12 text-center z-20"
            style={{ opacity: 1 }}
          >
            <h2
              className="font-bold"
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                color: "#2D3748",
                letterSpacing: "1px",
              }}
            >
              El deterioro de la totora
            </h2>
          </div>

          <div className="relative z-10 w-full flex justify-center">
            <img
              src="totora.png"
              alt="El deterioro de la totora"
              style={{
                width: "clamp(280px, 50vw, 560px)",
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotoraSection;
