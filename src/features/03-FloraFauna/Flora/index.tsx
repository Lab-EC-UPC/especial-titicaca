import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Ave from "../../../assets/ave.png";
import PajaroIcon from "../../../assets/pato.png";
import PescadoIcon from "../../../assets/pescado.png";

const aves = [
  { nombre: "Nombre", cientifico: "Nombre cientifico", img: Ave, numero: 259, estado: "Peligro menor" },
  { nombre: "Nombre", cientifico: "Nombre cientifico", img: Ave, numero: 581, estado: "Peligro medio" },
  { nombre: "Nombre", cientifico: "Nombre cientifico", img: Ave, numero: 1766, estado: "Peligro Alto" },
];

const peces = [
  { nombre: "Nombre", cientifico: "Nombre cientifico", img: Ave, numero: 120, estado: "Peligro menor" },
  { nombre: "Nombre", cientifico: "Nombre cientifico", img: Ave, numero: 340, estado: "Peligro medio" },
  { nombre: "Nombre", cientifico: "Nombre cientifico", img: Ave, numero: 890, estado: "Peligro Alto" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
};

const animalVariants = {
  hidden: { x: "-200%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const Flora = () => {
  const [activeTab, setActiveTab] = useState<"aves" | "peces">("aves");
  const [animKey, setAnimKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleTabChange = (tab: "aves" | "peces") => {
    if (tab === activeTab) return;
    setHoveredIndex(null);
    setActiveTab(tab);
    setAnimKey((k) => k + 1);
  };

  const items = activeTab === "aves" ? aves : peces;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1B2D33 0%, #3A6470 38%, #A4C8D5 100%)",
        paddingTop: "22vh",
        paddingBottom: "14vh",
      }}
    >
      <div className="relative z-10 text-center px-6">
        <h2 className="text-white uppercase font-black" style={{ fontSize: "28px", letterSpacing: "4px" }}>
          Cap 2: Flora y Fauna
        </h2>
        <p className="mx-auto mt-6 text-white/65 leading-relaxed font-light" style={{ fontSize: "14px", maxWidth: "420px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. (23 palabras)
        </p>
      </div>

      <div className="relative z-10 flex justify-center gap-3 mt-16">
        {[
          { tab: "aves" as const, icon: PajaroIcon, alt: "Aves" },
          { tab: "peces" as const, icon: PescadoIcon, alt: "Peces" },
        ].map(({ tab, icon, alt }) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              width: "52px", height: "52px", borderRadius: "50%", padding: 0,
              border: activeTab === tab ? "2px solid rgba(255,255,255,0.7)" : "2px solid transparent",
              outline: "none", cursor: "pointer", background: "transparent", transition: "border-color 0.2s",
            }}
          >
            <img src={icon} alt={alt} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          </button>
        ))}
      </div>

      <div style={{ overflow: "hidden" }}>
        <motion.div
          key={animKey}
          className="flex flex-row items-end w-full px-8 md:px-16 lg:px-24"
          style={{ marginTop: "20vh" }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {items.map((item, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                variants={animalVariants}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                style={{ flex: 1, cursor: "default" }}
              >
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontSize: "clamp(80px, 13vw, 170px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-6px", whiteSpace: "nowrap", color: "rgba(207,234,243,0.18)", zIndex: 0, userSelect: "none", pointerEvents: "none" }}
                >
                  {item.numero}
                </motion.span>

                <motion.div
                  className="relative z-10 mb-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
                >
                  <h3 className="text-white font-bold" style={{ fontSize: "15px" }}>{item.nombre}</h3>
                  <p className="italic" style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{item.cientifico}</p>
                </motion.div>

                <motion.img
                  src={item.img}
                  alt={item.nombre}
                  className="relative z-10"
                  animate={{
                    scale: isHovered ? 1.35 : 1,
                    filter: isHovered
                      ? "brightness(0.45) drop-shadow(4px 8px 18px rgba(0,0,0,0.55))"
                      : "brightness(1) drop-shadow(0px 0px 0px rgba(0,0,0,0))",
                  }}
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  style={{ width: "clamp(130px, 14vw, 190px)", height: "auto", transformOrigin: "bottom center" }}
                />

                <motion.p
                  className="relative z-10 text-white font-bold text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: "16px", letterSpacing: "1px", marginTop: "14px", minHeight: "22px" }}
                >
                  {item.estado}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-6 mt-24">
        <h3 className="text-white font-bold mb-4" style={{ fontSize: "20px", letterSpacing: "1px" }}>
          El deterioro de la totora
        </h3>
        <p className="mx-auto leading-relaxed text-white/65" style={{ fontSize: "14px", maxWidth: "460px" }}>
          La contaminación no solo afecta a los animales, también golpea a la
          flora que sostiene el ecosistema. La totora, planta emblemática del
          Titicaca, filtra el agua, protege las orillas de la erosión y sirve de
          refugio y alimento para peces y aves. Además, es parte de la vida
          económica y cultural de muchas comunidades, que la usan en artesanías,
          viviendas y embarcaciones. Si la totora muere, el lago pierde una de
          sus principales defensas naturales.
        </p>
      </div>
    </section>
  );
};

export default Flora;
