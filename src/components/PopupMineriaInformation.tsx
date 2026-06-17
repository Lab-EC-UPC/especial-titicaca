type TipoMineria = "formal" | "informal";

interface Props {
  tipo: TipoMineria;
  nombre: string;
  eessMasCercano: string;
  distanciaKm: number;
  descripcion?: string;
}

const TIPO_STYLE: Record<TipoMineria, { badgeBg: string; accent: string; border: string }> = {
  formal:   { badgeBg: "#13A383", accent: "#13A383", border: "#13A383" },
  informal: { badgeBg: "#C03583", accent: "#C03583", border: "#C03583" },
};

const TIPO_LABEL: Record<TipoMineria, string> = {
  formal:   "Minería formal registrada",
  informal: "Minería informal (REINFO)",
};

export default function PopupMineriaInformation({
  tipo,
  nombre,
  eessMasCercano,
  distanciaKm,
  descripcion,
}: Props) {
  const { badgeBg, accent, border } = TIPO_STYLE[tipo];

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
        <span className="text-sm font-bold font-citizen text-white">{nombre}</span>
      </div>

      {/* Campos */}
      <div className="mb-5 space-y-1">
        <p className="text-white/60 text-sm font-elza">
          Tipo:{" "}
          <span className="font-bold" style={{ color: accent }}>
            {TIPO_LABEL[tipo]}
          </span>
        </p>
        <p className="text-white/60 text-sm font-elza">
          EESS más cercano:{" "}
          <span className="font-bold" style={{ color: accent }}>
            {eessMasCercano}
          </span>
        </p>
        <p className="text-white/60 text-sm font-elza">
          Distancia:{" "}
          <span className="font-bold" style={{ color: accent }}>
            {distanciaKm} km
          </span>
        </p>
      </div>

      {/* Descripción opcional */}
      {descripcion && (
        <p className="text-white/40 text-xs font-elza leading-snug">{descripcion}</p>
      )}
    </div>
  );
}
