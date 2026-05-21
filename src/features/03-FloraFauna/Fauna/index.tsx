import type { CSSProperties, ReactElement } from "react";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import PajaroIcon  from "../../../assets/pato.png";
import PescadoIcon from "../../../assets/pescado.png";

import { FlamencoWalk }    from "./Flamenco/Walk";
import { FlamencoFrontal } from "./Flamenco/Frontal";
import { ParihuanaWalk }   from "./Parihuana/Walk";
import { ParihuanaFrontal } from "./Parihuana/Frontal";
import { ZampullinWalk }   from "./Zampullin/Walk";
import { ZampullinFrontal } from "./Zampullin/Frontal";

import { avesInfo, pecesData } from "./data";

type AnimalItem = {
  nombre: string;
  cientifico: string;
  img?: string;
  FrontalComponent?: (props: { style?: CSSProperties }) => ReactElement;
  WalkComponent?: (props: { style?: CSSProperties }) => ReactElement;
  numero: number;
  estado: string;
};

const aves: AnimalItem[] = [
  { ...avesInfo[0], FrontalComponent: FlamencoFrontal,  WalkComponent: FlamencoWalk  },
  { ...avesInfo[1], FrontalComponent: ParihuanaFrontal, WalkComponent: ParihuanaWalk },
  { ...avesInfo[2], FrontalComponent: ZampullinFrontal, WalkComponent: ZampullinWalk },
];

const peces: AnimalItem[] = pecesData;

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

export const Fauna = () => {
  const [activeTab, setActiveTab] = useState<"aves" | "peces">("aves");
  const [animKey, setAnimKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [arrivedItems, setArrivedItems] = useState([false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleTabChange = (tab: "aves" | "peces") => {
    if (tab === activeTab) return;
    setHoveredIndex(null);
    setActiveTab(tab);
    setAnimKey((k) => k + 1);
    setArrivedItems([false, false, false]);
  };

  const handleItemArrived = (i: number) => {
    setArrivedItems((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const items = activeTab === "aves" ? aves : peces;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-hidden"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #1B2D33 0%, #3A6470 38%, #A4C8D5 100%)",
        paddingTop: "22vh",
        paddingBottom: "14vh",
      }}
    >
      <div className="relative z-10 text-center px-6">
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
          El lago ha perdido múltiples especies con el paso de los años. Según
          informes de la Autoridad Binacional Autónoma del Lago Titicaca, la
          pesca ha caído en 88.9 %, con fuertes reducciones en especies nativas.
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
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              padding: 0,
              border:
                activeTab === tab
                  ? "2px solid rgba(255,255,255,0.7)"
                  : "2px solid transparent",
              outline: "none",
              cursor: "pointer",
              background: "transparent",
              transition: "border-color 0.2s",
            }}
          >
            <img
              src={icon}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
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
            const arrived = arrivedItems[i];
            return (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                variants={animalVariants}
                onAnimationComplete={(def) => { if (def === "visible") handleItemArrived(i); }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                style={{ flex: 1, cursor: "default" }}
              >
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "clamp(80px, 13vw, 170px)",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-6px",
                    whiteSpace: "nowrap",
                    color: "rgba(207,234,243,0.18)",
                    zIndex: 0,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {item.numero}
                </motion.span>

                <motion.div
                  className="relative z-10 mb-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
                >
                  <h3 className="text-white font-bold" style={{ fontSize: "15px" }}>
                    {item.nombre}
                  </h3>
                  <p className="italic" style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                    {item.cientifico}
                  </p>
                </motion.div>

                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: isHovered ? 1.35 : 1,
                    filter: isHovered
                      ? "brightness(0.45) drop-shadow(4px 8px 18px rgba(0,0,0,0.55))"
                      : "brightness(1) drop-shadow(0px 0px 0px rgba(0,0,0,0))",
                  }}
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  style={{
                    height: "clamp(130px, 14vw, 190px)",
                    transformOrigin: "bottom center",
                    position: "relative",
                  }}
                >
                  {/* Vista lateral: SVG animado o imagen estática */}
                  <motion.div
                    animate={{ opacity: (item.FrontalComponent) && arrived ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: "100%" }}
                  >
                    {item.WalkComponent ? (
                      <item.WalkComponent style={{ height: "100%", width: "auto", display: "block" }} />
                    ) : (
                      <img src={item.img} alt={item.nombre} draggable={false} style={{ height: "100%", width: "auto", display: "block" }} />
                    )}
                  </motion.div>

                  {/* Vista frontal */}
                  {item.FrontalComponent && (
                    <motion.div
                      animate={{ opacity: arrived ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        height: "100%",
                      }}
                    >
                      <item.FrontalComponent style={{ height: "100%", width: "auto", display: "block" }} />
                    </motion.div>
                  )}
                </motion.div>

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

export default Fauna;
