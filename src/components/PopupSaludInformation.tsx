type Zona = "segura" | "riesgo" | "critica";

interface Props {
  zona: Zona;
  provincia: string;
  cantidadTotal: number;
  activo: number;
  desactivado: number;
  categoria: string;
  clasificacion: string;
}

const ZONA_STYLE: Record<Zona, { badgeBg: string; badgeText: string; border: string }> = {
  segura:  { badgeBg: "#F4F4F4",  badgeText: "#21292C", border: "rgba(255,255,255,0.35)" },
  riesgo:  { badgeBg: "#13A383",  badgeText: "#FFFFFF",  border: "#13A383" },
  critica: { badgeBg: "#C03583",  badgeText: "#FFFFFF",  border: "#C03583" },
};

export default function PopupSaludInformation({
  zona,
  provincia,
  cantidadTotal,
  activo,
  desactivado,
  categoria,
  clasificacion,
}: Props) {
  const { badgeBg, badgeText, border } = ZONA_STYLE[zona];

  return (
    <div
      className="relative rounded-2xl pt-10 pb-7 px-7 w-[min(420px,calc(100vw-2rem))]"
      style={{
        background: "rgba(217, 217, 217, 0.15)",
        backdropFilter: "blur(6px)",
        border: `1.5px solid ${border}`,
      }}
    >
      {/* Badge título */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-lg whitespace-nowrap"
        style={{ backgroundColor: badgeBg }}
      >
        <span className="text-sm font-bold font-citizen" style={{ color: badgeText }}>
          {provincia}
        </span>
      </div>

      {/* Estadísticas */}
      <div className="mb-5 space-y-0.5">
        <p className="text-white/50 text-sm font-elza">
          Cantidad total: {cantidadTotal}
        </p>
        <p className="text-white/80 text-sm font-elza">
          Activo: <span className="font-bold text-white">{activo} puestos</span>
        </p>
        <p className="text-white/80 text-sm font-elza">
          Desactivado: <span className="font-bold text-white">{desactivado} puestos</span>
        </p>
      </div>

      {/* Categoría y clasificación */}
      <div className="space-y-1">
        <p className="text-white/50 text-xs font-elza leading-snug">
          Categoría: {categoria}
        </p>
        <p className="text-white/50 text-xs font-elza leading-snug">
          Clasificación: {clasificacion}
        </p>
      </div>
    </div>
  );
}
