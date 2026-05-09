import Group78 from "../../assets/Group78.png";
import Maskgroup from "../../assets/Maskgroup.png";

const birds = [
  {
    nombre: "Nombre",
    cientifico: "Nombre cientifico",
    img: Group78,
    danger: false,
  },
  {
    nombre: "Nombre",
    cientifico: "Nombre cientifico",
    img: Group78,
    danger: false,
  },
  {
    nombre: "Nombre",
    cientifico: "Nombre cientifico",
    img: Maskgroup,
    danger: true,
  },
];

export const Flora = () => {
  return (
    <section
      className="relative w-full overflow-x-hidden"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #1B2D33 0%, #3A6470 38%, #A4C8D5 100%)",
      }}
    >
      <div className="relative z-10 text-center pt-28 px-6">
        <h2
          className="text-white uppercase font-black"
          style={{ fontSize: "28px", letterSpacing: "4px" }}
        >
          Cap 2: Flora y Fauna
        </h2>
        <p
          className="mx-auto mt-6 text-white/65 leading-relaxed font-light"
          style={{ fontSize: "14px", maxWidth: "420px" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. (23
          palabras)
        </p>
      </div>

      <div style={{ height: "32vh" }} />

      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
        <div className="flex flex-row items-end w-full">
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-3 text-center">
              <h3 className="text-white font-bold" style={{ fontSize: "16px" }}>
                {birds[0].nombre}
              </h3>
              <p
                className="italic"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}
              >
                {birds[0].cientifico}
              </p>
            </div>
            <img
              src={birds[0].img}
              alt={birds[0].nombre}
              style={{ width: "clamp(90px, 10vw, 130px)", height: "auto" }}
            />
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="mb-3 text-center">
              <h3 className="text-white font-bold" style={{ fontSize: "16px" }}>
                {birds[1].nombre}
              </h3>
              <p
                className="italic"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}
              >
                {birds[1].cientifico}
              </p>
            </div>
            <img
              src={birds[1].img}
              alt={birds[1].nombre}
              style={{ width: "clamp(110px, 12vw, 155px)", height: "auto" }}
            />
          </div>

          <div
            className="flex-[2] relative flex flex-col items-center"
            style={{ paddingTop: "60px" }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "clamp(100px, 15vw, 190px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-6px",
                whiteSpace: "nowrap",
                color: "rgba(207,234,243,0.13)",
                zIndex: 0,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              1766
            </span>

            <div className="relative z-10 mb-3 text-center">
              <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
                {birds[2].nombre}
              </h3>
              <p
                className="italic"
                style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}
              >
                {birds[2].cientifico}
              </p>
            </div>

            <img
              src={birds[2].img}
              alt={birds[2].nombre}
              className="relative z-10"
              style={{
                width: "clamp(150px, 17vw, 220px)",
                height: "auto",
                filter: "drop-shadow(4px 8px 18px rgba(0,0,0,0.55))",
              }}
            />

            <p
              className="relative z-10 mt-6 text-white font-bold text-center"
              style={{ fontSize: "17px", letterSpacing: "1px" }}
            >
              Peligro Alto
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: "72vh" }} />

      <div className="relative z-10 text-center px-6 pb-44">
        <p
          className="mx-auto leading-relaxed"
          style={{
            fontSize: "14px",
            maxWidth: "460px",
            color: "rgba(30,44,46,0.72)",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt (16 palabras).
        </p>
      </div>
    </section>
  );
};

export default Flora;
