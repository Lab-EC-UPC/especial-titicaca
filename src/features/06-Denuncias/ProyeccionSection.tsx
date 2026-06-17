// Texto sobre los modelos de proyección ambiental
export const ProyeccionSection = () => {
  return (
    <section
      id="proyeccion"
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
          maxWidth: 680,
          margin: "0 auto",
          padding: "clamp(80px,12vh,140px) clamp(24px,7vw,48px)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "clamp(10px,1.4vw,13px)",
            fontWeight: 700,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "#5a6272",
            marginBottom: 22,
          }}
        >
          Proyección ambiental
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: "clamp(32px,5vh,52px)",
          }}
        >
          <div style={{ height: 1, width: 48, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          <div style={{ height: 1, width: 48, background: "rgba(255,255,255,0.15)" }} />
        </div>

        <p
          style={{
            fontWeight: 300,
            fontSize: "clamp(17px,1.6vw,22px)",
            lineHeight: 1.85,
            color: "#c8cfd8",
            margin: 0,
            letterSpacing: "0.005em",
          }}
        >
          Los modelos de proyección ambiental advierten que la{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>inacción estructural</strong>{" "}
          acelerará el ritmo de degradación de la cuenca.
        </p>
      </div>
    </section>
  );
};

export default ProyeccionSection;
