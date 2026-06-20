// Sección CTA: invita a iniciar la predicción del futuro del lago
export const FuturoLagoSection = () => {
  return (
    <section
      id="futuro-lago"
      style={{
        background: "#2e3440",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow ambiental de fondo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "min(900px, 120vw)",
          height: "min(900px, 120vw)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(74,154,174,0.12) 0%, rgba(46,52,64,0) 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(80px,12vh,140px) clamp(24px,7vw,48px)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: "clamp(24px,5vw,40px)",
            lineHeight: 1.2,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#f0f2f5",
            margin: "0 0 clamp(18px,3vh,28px)",
          }}
        >
          El Futuro del Lago
        </h2>

        <p
          style={{
            fontSize: "clamp(17px,2vw,26px)",
            lineHeight: 1.4,
            letterSpacing: "0.02em",
            color: "#c8cfd8",
            margin: "0 auto clamp(36px,6vh,52px)",
            maxWidth: 520,
          }}
        >
          Explora el impacto de la contaminación y descubre el destino del
          Titicaca para el 2050.
        </p>

        <button
          type="button"
          style={{
            fontFamily: "var(--font-citizen)",
            fontWeight: 700,
            fontSize: "clamp(20px,2.4vw,32px)",
            lineHeight: "normal",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#ffffff",
            background: "#151B1B",
            border: "none",
            borderRadius: 0,
            padding: "16px 40px",
            cursor: "pointer",
            transition: "background 0.25s, transform 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1f2727";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#151B1B";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Iniciar predicción
        </button>
      </div>
    </section>
  );
};

export default FuturoLagoSection;
