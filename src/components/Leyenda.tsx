type Tab = "salud" | "mineria";
type Shape = "circle" | "triangle";

interface LeyendaProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface LegendItem {
  color: string;
  label: string;
  subtitle?: string;
  shape?: Shape;
}

const SALUD_ITEMS: LegendItem[] = [
  { color: "#F4F4F4", label: "ZONA SEGURA", subtitle: "Hospital (II-1/II-2/II-E)" },
  { color: "#13A383", label: "ZONA RIESGO MEDIO", subtitle: "Centro de Salud y Centro c/especialidades" },
  { color: "#C03583", label: "ZONA CRÍTICA", subtitle: "Posta básica y Puesto c/médico" },
];

const MINERIA_ITEMS: LegendItem[] = [
  { color: "#13A383", label: "MINERÍA FORMAL REGISTRADA", shape: "triangle" },
  { color: "#C03583", label: "MINERÍA INFORMAL (REINFO)", shape: "triangle" },
];

function TriangleIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" className="flex-shrink-0">
      <path d="M14 0L28 24H0L14 0Z" fill={color} />
    </svg>
  );
}

export default function Leyenda({ activeTab, onTabChange }: LeyendaProps) {
  const items = activeTab === "salud" ? SALUD_ITEMS : MINERIA_ITEMS;

  return (
    <div
      className="rounded-xl p-8 w-[400px]"
      style={{ background: "rgba(217, 217, 217, 0.15)", backdropFilter: "blur(6px)" }}
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["salud", "mineria"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold tracking-widest transition-colors font-citizen ${
              activeTab === t
                ? "bg-[#1C2427] text-white"
                : "bg-white/10 text-white/50 hover:text-white/70"
            }`}
          >
            {t === "salud" ? "SÉCTOR SALUD" : "SÉCTOR MINERÍA"}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4 min-h-[146px]">
        {items.map(({ color, label, subtitle, shape }) => (
          <div key={label} className="flex items-center gap-4">
            {shape === "triangle" ? (
              <TriangleIcon color={color} />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
            )}
            <div>
              <p className="text-white font-bold text-sm tracking-widest font-citizen">{label}</p>
              {subtitle && <p className="text-white/60 text-xs font-elza mt-0.5">{subtitle}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
