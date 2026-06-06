import { useState, useRef } from "react";

type Pregunta = { n: string; q: string };

type CardData = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  accent: string;
  accentBorder: string;
  accentText: string;
  popup: { heading: string; sub: string; preguntas: Pregunta[] };
};

const cards: CardData[] = [
  {
    id: 1,
    title: "Sector Salud",
    subtitle: "(MINSA / DIRESA Puno)",
    image: "/image1_denuncias.jpg",
    color: "from-rose-900/80 to-rose-700/60",
    accent: "bg-rose-500",
    accentBorder: "border-rose-500",
    accentText: "text-rose-400",
    popup: {
      heading: "Sector Salud",
      sub: "MINSA / DIRESA Puno",
      preguntas: [
        {
          n: "01",
          q: "Tras la recolección y análisis de datos de dos décadas (2004-2024), nuestro equipo ha identificado 987 muertes atribuibles al consumo de agua contaminada en Puno. ¿Cómo explica el sector Salud que esta problemática se haya mantenido con un promedio de 47 fallecimientos anuales sin una intervención que logre revertir la tendencia?",
        },
        {
          n: "02",
          q: "Se registra que las últimas dos décadas (2004-2024) el 88.3% de las muertes por enfermedades hídricas en la zona ribereña del Titicaca corresponde a niños y adultos mayores, los grupos con mayor protección constitucional. Ante el hallazgo de que solo los menores de 11 años concentran más de 679 mil casos de morbilidad (54.7% del total), ¿cómo explica el sector Salud que, tras 20 años de diagnósticos y alertas, no se haya implementado una estrategia de saneamiento y prevención efectiva para frenar este impacto mortal en las poblaciones más vulnerables?",
        },
        {
          n: "03",
          q: "Dado que el Ministerio ya reconoce que la presencia de metales y residuos sólidos pone en riesgo la salud, ¿cuál es el presupuesto ejecutado en el último año para el tratamiento de personas con niveles de plomo y mercurio en la sangre en las cuencas de los ríos Coata y Azángaro?",
        },
        {
          n: "04",
          q: "Nuestra investigación ha sistematizado evidencia de que la sepsis y fallas respiratorias son las principales causas de muerte neonatal en Puno (2017-2022). Sin embargo, al solicitar información técnica, su sector respondió que dicha relación 'no se recoge'. ¿Cómo justifica que, ante una crisis de contaminación evidente, el MINSA mantenga este vacío estadístico deliberado que impide establecer un vínculo oficial entre el entorno degradado del lago y la alta mortalidad de recién nacidos en la región?",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Medio Ambiente y Biodiversidad",
    subtitle: "(MINAM / SERNANP / SERFOR)",
    image: "/image3_denuncias.jpg",
    color: "from-emerald-900/80 to-emerald-700/60",
    accent: "bg-emerald-500",
    accentBorder: "border-emerald-500",
    accentText: "text-emerald-400",
    popup: {
      heading: "Medio Ambiente y Biodiversidad",
      sub: "MINAM / SERNANP / SERFOR",
      preguntas: [
        {
          n: "01",
          q: "El Zambullidor del Titicaca, especie endémica, permanece en situación de alto riesgo de extinción pese a años de normativa de protección vigente. ¿Cuál es la evaluación técnica de las autoridades sobre los resultados de las medidas de conservación aplicadas hasta hoy, y qué responsabilidad institucional asumen SERNANP y SERFOR ante el deterioro continuo del ecosistema lacustre?",
        },
        {
          n: "02",
          q: "Según datos de la Autoridad Binacional ALT, la actividad pesquera en el lago ha caído 88.9%, con reducciones críticas en especies nativas como el carachi (96%) y el mauri (80%). ¿Qué programas de restauración de biomasa se han ejecutado en los últimos cinco años, con qué presupuesto y por qué sus resultados no se reflejan en la recuperación de estas especies?",
        },
        {
          n: "03",
          q: "La totora cumple una función crítica de filtración natural y protección de orillas, pero los hallazgos documentan una pérdida progresiva de su vitalidad por contaminación acumulada. ¿Existen planes concretos con metas medibles para recuperar los humedales de la Reserva Nacional del Titicaca, y si no se han logrado avances suficientes, qué factores específicos lo han impedido?",
        },
        {
          n: "04",
          q: "El OEFA ha identificado zonas críticas de contaminación dentro del ámbito de la Reserva Nacional. ¿Cuántos procedimientos sancionadores ha iniciado SERNANP en los últimos tres años contra actividades que degradan el hábitat protegido, y cuántos han derivado en medidas efectivas de remediación?",
        },
      ],
    },
  },
  {
    id: 3,
    title: "Gestión de Recursos Hídricos",
    subtitle: "(ANA)",
    image: "/image2_denuncias.jpg",
    color: "from-blue-900/80 to-blue-700/60",
    accent: "bg-blue-500",
    accentBorder: "border-blue-500",
    accentText: "text-blue-400",
    popup: {
      heading: "Gestión de Recursos Hídricos",
      sub: "Autoridad Nacional del Agua — ANA",
      preguntas: [
        {
          n: "01",
          q: "En 2024 se registró un pico histórico de asignación de 15.5 millones de m³ directamente al lago Titicaca, destinados íntegramente al uso acuícola. ¿Bajo qué criterios técnicos y ambientales la ANA justifica este incremento de concesiones en un ecosistema cuya biodiversidad acuática se encuentra en situación crítica y documentada?",
        },
        {
          n: "02",
          q: "El uso agrícola concentra el 77.5% del volumen total registrado en la cuenca (545.6 millones de m³). ¿Qué mecanismos de fiscalización existen para garantizar que el retorno de estas aguas no transporte agroquímicos hacia el lago, y cuántas inspecciones se realizaron en el último año?",
        },
        {
          n: "03",
          q: "Los registros muestran niveles de hierro y aluminio que exceden largamente los límites permisibles en las cuencas que desembocan en el Lago Titicaca, pese a dos décadas de crecimiento sostenido de la demanda hídrica. ¿Por qué no se ha implementado un sistema de control efectivo que revierta esta situación, y qué medidas inmediatas ha tomado la ANA en las zonas identificadas como más afectadas por el OEFA?",
        },
        {
          n: "04",
          q: "Existen 3,804 derechos de agua registrados en la cuenca con un volumen total de 704.42 millones de m³, mientras la población ribereña sigue enfrentando crisis de salud por consumo de agua no segura. ¿Cómo garantiza la ANA que esta asignación responde a criterios de equidad y protección ambiental, y no a una lógica de concesión que prioriza actividades económicas sobre el derecho humano al agua?",
        },
      ],
    },
  },
  {
    id: 4,
    title: "Autoridad Binacional del Lago Titicaca",
    subtitle: "(ALT)",
    image: "/1780732388219_image.png",
    color: "from-violet-900/80 to-violet-700/60",
    accent: "bg-violet-500",
    accentBorder: "border-violet-500",
    accentText: "text-violet-400",
    popup: {
      heading: "Autoridad Binacional del Lago Titicaca",
      sub: "ALT — Perú / Bolivia",
      preguntas: [
        {
          n: "01",
          q: "La provincia de Juliaca genera más del 80% de las aguas residuales que ingresan a la cuenca del Titicaca, descargadas sin tratamiento suficiente al río Coata. Los diagnósticos financieros muestran que la EPS-JULIACA arrastra pérdidas operativas severas que superan su patrimonio. ¿Cuál es el plan de contingencia exacto o el cronograma de inyección de capital que asumirá la Municipalidad para evitar el colapso sanitario de la ciudad?",
        },
        {
          n: "02",
          q: "El Estado ha destinado recursos millonarios a planes de saneamiento en la cuenca del Titicaca con una pérdida acumulada estimada en S/ 282 millones por fallas de obra y sanciones, sin que el deterioro se haya revertido. ¿Cómo responde el Ministerio ante la persistencia de estas brechas, y qué mecanismos de rendición de cuentas existen sobre la ejecución de ese presupuesto?",
        },
        {
          n: "03",
          q: "El crecimiento urbano de ciudades como Juliaca ha superado la capacidad de los sistemas de tratamiento actuales. ¿Qué compromisos de inversión concretos existen para los próximos cinco años que garanticen que los residuos domésticos dejen de verterse directamente al ecosistema del lago, con montos, plazos y responsables identificados?",
        },
        {
          n: "04",
          q: "¿Cuántas de las obras de saneamiento financiadas en la cuenca del Titicaca en los últimos diez años han sido concluidas, se encuentran operativas y cuentan con supervisión técnica activa? ¿Qué porcentaje de ellas presenta observaciones por incumplimiento o abandono?",
        },
      ],
    },
  },
];

function Card({ card, onClick }: { card: CardData; onClick: (card: CardData) => void }) {
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
      onClick={() => onClick(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      className="relative cursor-pointer rounded-2xl overflow-hidden"
      style={{
        transform: hovered
          ? `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.05)`
          : "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)",
        transition: hovered ? "transform 0.1s ease-out" : "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: hovered ? "0 28px 52px rgba(0,0,0,0.45)" : "0 4px 18px rgba(0,0,0,0.2)",
        aspectRatio: "3/4",
      }}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: hovered ? "none" : "grayscale(100%) brightness(0.8)",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition: "filter 0.55s ease, transform 0.55s ease",
        }}
      />

      {/* dark gradient always present */}
      <div className={`absolute inset-0 bg-gradient-to-t ${card.color}`}
        style={{ opacity: hovered ? 0.5 : 0.75, transition: "opacity 0.4s ease" }}
      />

      {/* shine */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)" }}
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        <div className={`${card.accent} h-[3px] rounded-full mb-3`}
          style={{
            width: hovered ? "2.5rem" : "1.5rem",
            transition: "width 0.35s ease",
          }}
        />
        <h3 className="text-white font-semibold text-sm sm:text-base leading-snug drop-shadow">
          {card.title}
        </h3>
        <p className="text-white/60 text-xs mt-1">{card.subtitle}</p>
        <div className="mt-3 flex items-center gap-1 text-white/50 text-xs"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(5px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <span>Ver preguntas</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Popup({ card, onClose }: { card: CardData | null; onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!card) return null;

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-2xl bg-[#0f1420] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden flex-shrink-0">
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${card.color}`} style={{ opacity: 0.85 }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
            <span className={`text-xs font-semibold tracking-widest uppercase ${card.accentText} mb-1`}>
              Preguntas a la institución
            </span>
            <h2 className="text-white text-lg sm:text-2xl font-bold leading-tight">{card.popup.heading}</h2>
            <p className="text-white/55 text-xs sm:text-sm mt-1">{card.popup.sub}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Accordion questions */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-2">
          {card.popup.preguntas.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl border transition-colors duration-200 ${
                open === i
                  ? `border-opacity-60 ${card.accentBorder} bg-white/5`
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <button
                className="w-full flex items-start gap-3 p-4 text-left"
                onClick={() => toggle(i)}
              >
                <span className={`text-xs font-bold tracking-widest mt-0.5 flex-shrink-0 ${card.accentText}`}>
                  {p.n}
                </span>
                <span className="text-white/80 text-sm font-medium leading-snug flex-1 line-clamp-2"
                  style={{ WebkitLineClamp: open === i ? "unset" : 2 }}
                >
                  {open === i ? p.q : p.q.slice(0, 90) + (p.q.length > 90 ? "…" : "")}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={`flex-shrink-0 mt-0.5 transition-transform duration-300 text-white/40 ${open === i ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {open === i && (
                <div className="px-4 pb-4 pt-0">
                  <div className={`h-px mb-3 opacity-20 ${card.accent}`} />
                  <p className="text-white/65 text-sm leading-relaxed">{p.q}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/30 text-xs">4 preguntas sin respuesta</span>
          <button
            onClick={onClose}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Cerrar ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export const ImageneSection = () => {
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  return (
    <div id="imas" className="bg-[#1e2535]">
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
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full max-w-5xl">
            {cards.map((card) => (
              <Card key={card.id} card={card} onClick={setActiveCard} />
            ))}
          </div>

          <p className="text-white/20 text-xs mt-7 tracking-wider">
            Presiona una imagen para ver las preguntas
          </p>
        </div>
      </div>

      <Popup card={activeCard} onClose={() => { setActiveCard(null); }} />
    </div>
  );
};