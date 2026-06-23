// Texto sobre las asignaciones financieras del PEBLT (UE 005)
export const PebltSection = () => {
  return (
    <section
      id="peblt"
      style={{
        background: "#2E343C",
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
        <p
          style={{
            fontSize: "clamp(17px,1.6vw,22px)",
            lineHeight: 1.85,
            color: "#c8cfd8",
            margin: 0,
            letterSpacing: "0.005em",
          }}
        >
          Aunque el{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            Proyecto Especial Binacional Lago Titicaca (PEBLT)
          </strong>{" "}
          incrementó su presupuesto de{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            S/ 14,5 millones en 2017
          </strong>{" "}
          a{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            S/ 28,9 millones en 2026
          </strong>
          , el aumento de recursos no se ha traducido en mayores avances en la
          cuenca. Contraloría reporta{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            obras paralizadas desde 2014
          </strong>
          , proyectos inconclusos, deficiencias constructivas e indicios de
          pagos por trabajos que no habrían sido ejecutados.
        </p>
      </div>
    </section>
  );
};


