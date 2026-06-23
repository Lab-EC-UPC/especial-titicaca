// Texto institucional sobre el proyecto PTAR Titicaca
export const PtarTiticacaSection = () => {
  return (
    <section
      id="ptar-titicaca"
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
            letterSpacing: "0.020em",
          }}
        >
          En <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>2019</strong>
          , el proyecto{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            PTAR Titicaca
          </strong>{" "}
          (Plantas de Tratamiento de Aguas Residuales) prometía tratar los
          desagües de Puno y Juliaca mediante una inversión de{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            más de S/ 860 millones
          </strong>
          . No obstante, las obras iniciadas en{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>2021</strong>{" "}
          acumularon retrasos y observaciones de la Contraloría, y el contrato
          terminó siendo{" "}
          <strong style={{ fontWeight: 600, color: "#f0f2f5" }}>
            anulado en 2023
          </strong>{" "}
          tras la paralización de los trabajos.
        </p>
      </div>
    </section>
  );
};


