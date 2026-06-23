import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import { useCrossfadeIn } from "../../../hooks/useCrossfadeIn";
import PajaroIcon from "../assets/pato.png";
import PescadoIcon from "../assets/pescado.png";

import { aves, peces } from "./data";
import { SpeciesCard } from "./SpeciesCard";
import type { TabKey } from "./types";

const TABS: { tab: TabKey; icon: string; alt: string }[] = [
  { tab: "peces", icon: PescadoIcon, alt: "Peces" },
  { tab: "aves", icon: PajaroIcon, alt: "Aves" },
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
  const [activeTab, setActiveTab] = useState<TabKey>("peces");
  const [animKey, setAnimKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [arrivedItems, setArrivedItems] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Cross-dissolve de entrada sobre el último video de Juliaca (que sigue
  // pineado debajo durante el solape). Requiere el marginTop/opacity/z-index
  // que se aplican en el <section> de abajo. El fin adelantado ("top 60%")
  // deja a Fauna opaca antes de que el video se despinee, cubriendo su tramo
  // final oscuro con margen de seguridad.
  useCrossfadeIn(sectionRef, { end: "top 60%" });

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
        background: "linear-gradient(to bottom, #2e3440 0%, #586A74 12%)",
        paddingTop: "clamp(120px, 26vh, 280px)",
        paddingBottom: "clamp(120px, 22vh, 260px)",
        // Cross-dissolve de entrada (useCrossfadeIn): solapa 50vh con el video
        // saliente de Juliaca y parte invisible; z-index para pintar por encima
        // del elemento pineado (position:fixed) que queda debajo.
        marginTop: "-50vh",
        opacity: 0,
        zIndex: 1,
      }}
    >
      <div className="relative z-10 text-center px-4 sm:px-6">
        <h2
          className="text-white uppercase font-black"
          style={{
            fontSize: "clamp(22px, 4vw, 38px)",
            letterSpacing: "clamp(2px, 0.4vw, 4px)",
          }}
        >
          Alteración del ecosistema
        </h2>
        <p
          className="mx-auto text-center text-white/65 leading-relaxed"
          style={{
            marginTop: "clamp(96px, 16vh, 180px)",
            fontSize: "clamp(14px, 1.8vw, 18px)",
            maxWidth: "min(680px, 92vw)",
          }}
        >
          Los peces nativos del Titicaca se han reducido en las últimas décadas
          debido a la sobrepesca y a la preocupante calidad del agua que amenaza
          su supervivencia. Este colapso ha transformado la actividad pesquera
          tradicional, obligando a las comunidades a migrar hacia la acuicultura
          mediante la crianza de trucha, una especie introducida que hoy domina
          el mercado local.
        </p>
      </div>

      <div
        className="relative z-10 text-center px-4 sm:px-6"
        style={{ marginTop: "clamp(160px, 34vh, 340px)" }}
      >
        <h3
          className="uppercase tracking-widest font-semibold text-white"
          style={{
            fontSize: "clamp(14px, 1.9vw, 21px)",
            letterSpacing: "clamp(2px, 0.5vw, 5px)",
          }}
        >
          ¿CUÁNTAS ESPECIES QUEDAN?
        </h3>
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
          className="flex flex-col items-center gap-16 sm:flex-row sm:items-end sm:gap-0 w-full px-2 sm:px-8 md:px-16 lg:px-24"
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
              onToggle={() => setHoveredIndex((prev) => (prev === i ? null : i))}
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
          className="mx-auto text-center text-white/65 leading-relaxed"
          style={{
            fontSize: "clamp(14px, 1.8vw, 18px)",
            maxWidth: "min(680px, 92vw)",
          }}
        >
          El deterioro de los ecosistemas del lago también afecta a las aves. La
          pérdida de áreas de anidación, la quema de totorales y la perturbación
          constante de sus hábitats han comprometido la reproducción y
          conservación de varias especies del Titicaca.
        </p>
      </div>
    </section>
  );
};


