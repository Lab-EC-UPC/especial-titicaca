import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import PajaroIcon from "../../../assets/pato.png";
import PescadoIcon from "../../../assets/pescado.png";

import { aves, peces } from "./data";
import { SpeciesCard } from "./SpeciesCard";
import type { TabKey } from "./types";

const TABS: { tab: TabKey; icon: string; alt: string }[] = [
  { tab: "aves", icon: PajaroIcon, alt: "Aves" },
  { tab: "peces", icon: PescadoIcon, alt: "Peces" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
};

const buildAnimalVariants = (fromX: string) => ({
  hidden: { x: fromX, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
});

export const Fauna = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("aves");
  const [animKey, setAnimKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [arrivedItems, setArrivedItems] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) return;
    setHoveredIndex(null);
    setActiveTab(tab);
    setAnimKey((k) => k + 1);
    setArrivedItems([false, false, false]);
  };

  const markArrived = (i: number) =>
    setArrivedItems((prev) => prev.map((v, idx) => (idx === i ? true : v)));

  const items = activeTab === "aves" ? aves : peces;
  const animalVariants = buildAnimalVariants(
    activeTab === "aves" ? "-200%" : "200%",
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-hidden"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #1B2D33 0%, #3A6470 38%, #4A7A88 65%, #1E3038 100%)",
        paddingTop: "clamp(120px, 26vh, 280px)",
        paddingBottom: "clamp(120px, 22vh, 260px)",
      }}
    >
      <div className="relative z-10 text-center px-4 sm:px-6">
        <p
          className="uppercase tracking-widest font-light"
          style={{
            fontSize: "clamp(10px, 1vw, 12px)",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "clamp(3px, 0.5vw, 6px)",
            marginBottom: "clamp(6px, 1vw, 10px)",
          }}
        >
          CAPÍTULO II
        </p>
        <h2
          className="text-white uppercase font-black"
          style={{
            fontSize: "clamp(18px, 3.4vw, 32px)",
            letterSpacing: "clamp(2px, 0.4vw, 4px)",
          }}
        >
          ALTERACIÓN DEL ECOSISTEMA
        </h2>
        <p
          className="mx-auto text-white/65 leading-relaxed font-light"
          style={{
            marginTop: "clamp(32px, 5vh, 56px)",
            fontSize: "clamp(12px, 1.4vw, 15px)",
            maxWidth: "min(420px, 92vw)",
          }}
        >
          Los reportes del Instituto del Mar del Perú (Imarpe) confirman una
          alarmante desaparición de fauna: la cantidad de peces nativos en el
          Titicaca cayó drásticamente, pasando de unas 6,000 toneladas en los
          años 80 a apenas 1,500 toneladas en las mediciones recientes. Una
          reducción del 75% que golpea directamente el sustento de los
          pescadores locales.
        </p>
      </div>

      <div
        className="relative z-10 text-center px-4 sm:px-6"
        style={{ marginTop: "clamp(160px, 34vh, 340px)" }}
      >
        <p
          className="uppercase tracking-widest font-semibold text-white"
          style={{
            fontSize: "clamp(12px, 1.6vw, 18px)",
            letterSpacing: "clamp(2px, 0.5vw, 5px)",
          }}
        >
          ¿CUÁNTAS ESPECIES QUEDAN?
        </p>
      </div>

      <div className="relative z-10 flex justify-center gap-3 mt-6 sm:mt-8">
        {TABS.map(({ tab, icon, alt }) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              width: "clamp(40px, 5vw, 56px)",
              height: "clamp(40px, 5vw, 56px)",
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
          className="flex flex-row items-end w-full px-2 sm:px-8 md:px-16 lg:px-24"
          style={{ marginTop: "clamp(60px, 16vh, 220px)" }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {items.map((item, i) => (
            <SpeciesCard
              key={i}
              item={item}
              index={i}
              isHovered={hoveredIndex === i}
              arrived={arrivedItems[i]}
              isInView={isInView}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              onArrived={() => markArrived(i)}
              variants={animalVariants}
            />
          ))}
        </motion.div>
      </div>

      <div
        className="relative z-10 text-center px-4 sm:px-6"
        style={{ marginTop: "clamp(160px, 32vh, 320px)" }}
      >
        <p
          className="mx-auto leading-relaxed text-white/65"
          style={{
            fontSize: "clamp(12px, 1.4vw, 15px)",
            maxWidth: "min(460px, 92vw)",
          }}
        >
          El exceso de basura y aguas residuales provoca un fenómeno devastador:
          el agua se llena de nutrientes que hacen crecer algas de forma
          descontrolada, robándose todo el oxígeno. Esta falta de aire en el
          agua ya causó una asfixia y mortandad masiva de peces en la bahía
          interior de Puno, teniendo su punto más crítico en el año 2013.
        </p>
      </div>
    </section>
  );
};

export default Fauna;
