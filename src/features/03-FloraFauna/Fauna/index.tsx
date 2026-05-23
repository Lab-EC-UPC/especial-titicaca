import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import PajaroIcon  from "../../../assets/pato.png";
import PescadoIcon from "../../../assets/pescado.png";

import { aves, peces } from "./data";
import { SpeciesCard } from "./SpeciesCard";
import type { TabKey } from "./types";

const TABS: { tab: TabKey; icon: string; alt: string }[] = [
  { tab: "aves",  icon: PajaroIcon,  alt: "Aves"  },
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
  const [arrivedItems, setArrivedItems] = useState<boolean[]>([false, false, false]);

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
  const animalVariants = buildAnimalVariants(activeTab === "aves" ? "-200%" : "200%");

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1B2D33 0%, #3A6470 38%, #A4C8D5 100%)",
        paddingTop: "clamp(80px, 18vh, 220px)",
        paddingBottom: "clamp(60px, 12vh, 160px)",
      }}
    >
      <div className="relative z-10 text-center px-4 sm:px-6">
        <h2
          className="text-white uppercase font-black"
          style={{ fontSize: "clamp(18px, 3.4vw, 32px)", letterSpacing: "clamp(2px, 0.4vw, 4px)" }}
        >
          Cap 2: Flora y Fauna
        </h2>
        <p
          className="mx-auto mt-6 text-white/65 leading-relaxed font-light"
          style={{ fontSize: "clamp(12px, 1.4vw, 15px)", maxWidth: "min(420px, 92vw)" }}
        >
          El lago ha perdido múltiples especies con el paso de los años. Según
          informes de la Autoridad Binacional Autónoma del Lago Titicaca, la
          pesca ha caído en 88.9 %, con fuertes reducciones en especies nativas.
        </p>
      </div>

      <div className="relative z-10 flex justify-center gap-3 mt-10 sm:mt-16">
        {TABS.map(({ tab, icon, alt }) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              width: "clamp(40px, 5vw, 56px)",
              height: "clamp(40px, 5vw, 56px)",
              borderRadius: "50%",
              padding: 0,
              border: activeTab === tab ? "2px solid rgba(255,255,255,0.7)" : "2px solid transparent",
              outline: "none",
              cursor: "pointer",
              background: "transparent",
              transition: "border-color 0.2s",
            }}
          >
            <img
              src={icon}
              alt={alt}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
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

      <div className="relative z-10 text-center px-4 sm:px-6 mt-16 sm:mt-24">
        <h3 className="text-white font-bold mb-4" style={{ fontSize: "clamp(15px, 2vw, 22px)", letterSpacing: "1px" }}>
          El deterioro de la totora
        </h3>
        <p className="mx-auto leading-relaxed text-white/65" style={{ fontSize: "clamp(12px, 1.4vw, 15px)", maxWidth: "min(460px, 92vw)" }}>
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
