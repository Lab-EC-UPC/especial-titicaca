import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

type CardData = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  content?: string[];
};

const cards: CardData[] = [
  {
    id: 1,
    title: "Sector Salud",
    subtitle: "(MINSA / DIRESA Puno)",
    image: "/image1_denuncias.png",
    content: [
      "La Dirección Regional de Salud de Puno (DIRESA) fue consultada en el marco de esta investigación. Fiorella Luna Lino, coordinadora regional de la Estrategia de Metales Pesados, sostuvo que la institución tiene población expuesta a metales pesados, pero no intoxicada: para declarar una intoxicación se requieren sintomatología clínica específica y resultados de laboratorio, criterios que según DIRESA no se han cumplido a la fecha.",
      'Sin embargo, los propios tamizajes de la institución muestran que entre el 70% y el 72.3% de los niños y gestantes muestreados en Capachica, Coata y Huata presentan arsénico en orina por encima del valor de referencia. Sobre el presupuesto, la representante fue directa: "No es suficiente. Tengo que mencionarlo una vez más, es poco." La red de salud Puno opera con una base de 16,000 soles y en 2025 solo alcanzó el 17% de su meta de atención.',
      'DIRESA también reconoció que no existe tratamiento para la intoxicación crónica por metales pesados. "La única remediación es que la persona se aleje del factor de riesgo", afirmó, y señaló que la solución de fondo requiere acción multisectorial más allá de las competencias del sector salud.',
      "El Comercio intentó comunicarse con el Ministerio de Salud del Perú (MINSA), pero no recibió respuesta.",
    ],
  },
  {
    id: 2,
    title: "Medio Ambiente y Biodiversidad",
    subtitle: "(MINAM / SERNANP / SERFOR)",
    image: "/image2_denuncias.png",
    content: [
      "El Comercio intentó comunicarse con el Ministerio del Ambiente del Perú (MINAM), el Servicio Nacional de Áreas Naturales Protegidas por el Estado (SERNANP) y el Servicio Nacional Forestal y de Fauna Silvestre (SERFOR), pero no recibió respuesta de ninguna área.",
    ],
  },
  {
    id: 3,
    title: "Gestión de Recursos Hídricos",
    subtitle: "(ANA)",
    image: "/image3_denuncias.png",
    content: [
      "El Comercio intentó comunicarse con la Autoridad Nacional del Agua (ANA), pero no recibió respuesta.",
    ],
  },
  {
    id: 4,
    title: "Autoridad Binacional del Lago Titicaca",
    subtitle: "(ALT)",
    image: "/image4_denuncias.png",
    content: [
      "El Comercio intentó comunicarse con la Autoridad Binacional del Lago Titicaca (ALT) y con las municipalidades de Puno y San Román, pero no recibió respuesta.  ",
    ],
  },
];

function InstitutionModal({
  card,
  onClose,
}: {
  card: CardData;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl bg-[#2e3440] border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="p-5 sm:p-8 md:p-10">
          <h3 className="text-white text-lg sm:text-2xl font-bold leading-tight pr-8">
            {card.title}
          </h3>
          <h4 className="text-white/50 text-xs sm:text-sm mt-1">
            {card.subtitle}
          </h4>

          <div className="h-px w-full bg-white/10 my-5 sm:my-6" />

          {card.content && card.content.length > 0 ? (
            <div className="flex flex-col gap-4 text-white/80 text-sm sm:text-base leading-relaxed text-left sm:text-justify">
              {card.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm italic">
              Contenido próximamente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ card, onSelect }: { card: CardData; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setTilt({ x, y });
  };

  return (
    <div
      ref={ref}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        transform: hovered
          ? `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.05)`
          : "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)",
        transition: hovered
          ? "transform 0.1s ease-out"
          : "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: hovered
          ? "0 28px 52px rgba(0,0,0,0.45)"
          : "0 4px 18px rgba(0,0,0,0.2)",
        aspectRatio: "3/4",
      }}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.55s ease",
        }}
      />

      {/* degradado neutro para legibilidad del texto */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"
        style={{
          opacity: hovered ? 0.45 : 0.72,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* shine */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)",
          }}
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        <div
          className="h-[3px] rounded-full mb-3 bg-white/40"
          style={{
            width: hovered ? "2.5rem" : "1.5rem",
            transition: "width 0.35s ease",
          }}
        />
        <h3 className="text-white font-semibold text-sm sm:text-base leading-snug drop-shadow">
          {card.title}
        </h3>
        <p className="text-white/60 text-xs mt-1">{card.subtitle}</p>
      </div>
    </div>
  );
}

export const ImageneSection = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  return (
    <div id="imas" className="bg-[#2e3440]">
      <div className="mx-auto container w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-full">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-white/35 text-xs tracking-[0.35em] uppercase mb-3">
              Rendición de cuentas
            </p>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide leading-tight">
              ¿QUÉ DICEN LAS INSTITUCIONES
              <br className="hidden sm:block" /> RESPONSABLES?
            </h2>
            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="h-px w-10 bg-white/15" />
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div className="h-px w-10 bg-white/15" />
            </div>
            <p className="text-white/50 text-sm sm:text-base mt-5">
              Haz clic en cada institución para conocer su respuesta
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full max-w-5xl">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onSelect={() => setSelectedCard(card)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedCard && (
        <InstitutionModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};
