import logoLab from "./assets/logo-lab.png";
import { CreditDepartment } from "./CreditDepartment";
import { CREDITS } from "./credits.data";

export const FooterSection = () => {
  return (
    <footer
      id="footer"
      className="w-full"
      style={{
        background: "#2E343C",
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      <div
        className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center"
        style={{
          paddingTop: "clamp(100px, 18vh, 200px)",
          paddingBottom: "clamp(100px, 18vh, 200px)",
        }}
      >
        <h2
          className="uppercase font-bold text-white"
          style={{
            fontSize: "clamp(17px, 4vw, 40px)",
            letterSpacing: "0.18em",
            marginBottom: "clamp(56px, 11vh, 110px)",
          }}
        >
          Créditos
        </h2>

        <div
          className="flex w-full flex-col items-center"
          style={{ gap: "clamp(56px, 11vh, 110px)" }}
        >
          {CREDITS.map((department) => (
            <CreditDepartment key={department.title} department={department} />
          ))}
        </div>

        <img
          src={logoLab}
          alt="Laboratorio EC UPC"
          style={{
            width: "clamp(340px, 52vw, 640px)",
            height: "auto",
            marginTop: "clamp(72px, 14vh, 140px)",
          }}
        />

        <p
          className="uppercase font-light"
          style={{
            fontSize: "clamp(10px, 1.1vw, 12px)",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            marginTop: "clamp(40px, 8vh, 80px)",
          }}
        >
          © {new Date().getFullYear()} · Lago Titicaca
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
