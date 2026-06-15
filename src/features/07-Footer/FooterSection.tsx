import { useState } from "react";
import { ChevronDown } from "lucide-react";
import logoLab from "./assets/logo-lab.png";
import { CreditGroupItem } from "./CreditGroupItem";
import { CREDITS } from "./credits.data";

export const FooterSection = () => {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

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
        className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center"
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

        {/* Acordeón de áreas (1 columna en móvil, 4 en desktop) */}
        <div
          className="grid w-full grid-cols-1 md:grid-cols-4 items-start"
          style={{ gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          {CREDITS.map((department) => {
            const open = department.title === openTitle;
            return (
              <div
                key={department.title}
                className="flex w-full flex-col items-center border-b border-white/10 md:border-b-0"
              >
                <button
                  onClick={() => setOpenTitle(open ? null : department.title)}
                  className="flex w-full items-center justify-between text-left uppercase font-semibold transition-opacity"
                  style={{
                    fontSize: "clamp(13px, 1.4vw, 18px)",
                    letterSpacing: "0.1em",
                    lineHeight: 1.25,
                    padding: "clamp(14px, 1.8vh, 20px) clamp(2px, 1vw, 12px)",
                    cursor: "pointer",
                    gap: 8,
                    color: open ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                    background: "transparent",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap" }}>{department.title}</span>
                  <ChevronDown
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: "clamp(16px, 2vw, 22px)",
                      height: "clamp(16px, 2vw, 22px)",
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                  />
                </button>

                {/* Integrantes: se despliegan dentro de la propia sección */}
                <div
                  className="w-full"
                  style={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.35s ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div
                      className="flex w-full flex-col items-start text-left"
                      style={{
                        gap: "clamp(18px, 3vh, 32px)",
                        paddingTop: "clamp(16px, 3vh, 28px)",
                        paddingBottom: "clamp(8px, 2vh, 16px)",
                      }}
                    >
                      {department.groups.map((group) => (
                        <CreditGroupItem
                          key={group.role || group.names[0]}
                          group={{ ...group, columns: undefined }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <img
          src={logoLab}
          alt="Laboratorio EC UPC"
          style={{
            width: "clamp(220px, 60vw, 640px)",
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
