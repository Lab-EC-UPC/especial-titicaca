import { useState } from "react";

export default function StoryPopup() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!open) return null;

  // ── Expanded / Full story popup ──
  if (expanded) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={() => {
          setExpanded(false);
          setOpen(false);
        }}
      >
        <div
          className="relative mx-4 flex w-full max-w-[420px] flex-col px-8 pb-8 pt-6"
          style={{
            backgroundColor: "#D9D9D9",
            fontFamily: "Inter, sans-serif",
            color: "#000000",
            fontSize: "11px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar: audio icon + close button */}
          <div className="mb-4 flex items-center justify-between">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ backgroundColor: "#929292" }}
              onClick={() => console.log("Audio toggle")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
            <button
              className="text-[16px] font-bold transition-opacity hover:opacity-70"
              onClick={() => {
                setExpanded(false);
                setOpen(false);
              }}
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <h2
            className="mb-4 text-center font-bold leading-snug"
            style={{ fontSize: "14px" }}
          >
            Juan: A 13 Kilómetros de Olvido
          </h2>

          {/* Scrollable body */}
          <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto pr-1">
            <p className="text-center leading-relaxed">
              Juan vive en una pequeña comunidad en la cuenca del río Coata, muy
              cerca de las orillas del Lago Titicaca. Su hogar está rodeado por
              la actividad minera que, aunque motor económico de la región, ha
              dejado una huella profunda en el agua que consume su familia.
            </p>
            <p className="text-center leading-relaxed">
              Una madrugada, Juan despierta con una crisis estomacal aguda. Los
              dolores son punzantes, síntoma frecuente en zonas donde la
              exposición a metales pesados y la falta de saneamiento básico son
              la norma. En su comunidad no hay ambulancias, ni buses, ni
              mototaxis a esa hora.
            </p>
            <p className="text-center leading-relaxed">
              Para recibir atención, Juan debe llegar a la posta médica más
              cercana:
            </p>
            <ul className="ml-4 list-disc space-y-2 pl-2 text-left leading-relaxed">
              <li>
                La distancia: 13 kilómetros de caminos de tierra y altitud.
              </li>
              <li>
                El tiempo: A un paso constante de 4-5 km/h (considerando la
                fatiga por la enfermedad y la falta de oxígeno a más de 3,800
                msnm), el trayecto le toma casi 3 horas de caminata.
              </li>
              <li>
                El obstáculo: Sin transporte público, cada minuto de dolor se
                multiplica. Juan camina solo, bajo el frío del altiplano,
                esperando que la posta tenga personal cuando finalmente llegue.
              </li>
            </ul>
            <p className="mt-2 text-center italic leading-relaxed">
              "Y esto ocurre en 347 lugares exactos (centros poblados y
              comunidades) de Puno que se encuentran en una situación de
              aislamiento similar, donde la salud está a más de dos horas de
              caminata de distancia."
            </p>
          </div>

          {/* Bottom buttons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => console.log("Ver su ruta")}
              className="cursor-pointer rounded-full px-6 py-2 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#929292", fontSize: "11px" }}
            >
              Ver su ruta
            </button>
            <button
              onClick={() => console.log("Explorar otras rutas")}
              className="cursor-pointer rounded-full px-6 py-2 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#929292", fontSize: "11px" }}
            >
              Explorar otras rutas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Preview / Initial card popup ──
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative mx-4 flex w-full max-w-[440px] flex-col items-center rounded-[20px] px-8 pb-8 pt-16"
        style={{
          backgroundColor: "#D9D9D9",
          fontFamily: "Inter, sans-serif",
          color: "#000000",
          fontSize: "11px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Circular image */}
        <div
          className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 overflow-hidden rounded-full"
          style={{ backgroundColor: "#929292" }}
        >
          <img
            src="/src/assets/campesino.png"
            alt="Juan"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title */}
        <h2
          className="mb-4 mt-2 text-center font-bold leading-snug"
          style={{ fontSize: "14px" }}
        >
          Juan: A 13 Kilómetros de Olvido
        </h2>

        {/* Body */}
        <div className="flex flex-col gap-3">
          <p className="text-center leading-relaxed">
            Juan vive en una pequeña comunidad en la cuenca del río Coata, muy
            cerca de las orillas del Lago Titicaca. Su hogar está rodeado por la
            actividad minera que, aunque motor económico de la región, ha dejado
            una huella profunda en el agua que consume su familia.
          </p>
          <p className="text-center leading-relaxed">
            Una madrugada, Juan despierta con una crisis estomacal aguda. Los
            dolores son punzantes, síntoma frecuente en zonas donde la
            exposición a metales pesados y la falta de saneamiento básico son la
            norma. En su comunidad no hay ambulancias, ni buses, ni mototaxis a
            esa hora.
          </p>
        </div>

        {/* Ver más button */}
        <button
          onClick={() => setExpanded(true)}
          className="mt-6 cursor-pointer rounded-full px-10 py-2 text-center transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#929292", fontSize: "11px" }}
        >
          Ver más
        </button>
      </div>
    </div>
  );
}