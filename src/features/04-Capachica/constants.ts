export const TOTAL_FRAMES = 50;

export interface Caption {
  lo: number;
  hi: number;
  title: string;
  desc: string;
}

export const CAPTIONS: Caption[] = [
  {
    lo: 0,
    hi: 0.16,
    title: "El agua contamina la totora",
    desc: "El agua del lago llega contaminada a los totorales.",
  },
  {
    lo: 0.16,
    hi: 0.33,
    title: "La oveja consume la totora",
    desc: "La oveja consume la vegetación contaminada.",
  },
  {
    lo: 0.33,
    hi: 0.56,
    title: "La oveja muestra efectos físicos",
    desc: "La oveja empieza a debilitarse progresivamente.",
  },
  {
    lo: 0.56,
    hi: 0.68,
    title: "Los pobladores sacrifican la oveja",
    desc: "Los pobladores deciden consumir su carne.",
  },
  {
    lo: 0.68,
    hi: 0.83,
    title: "El poblador evidencia síntomas",
    desc: "Los síntomas comienzan a aparecer.",
  },
  {
    lo: 0.83,
    hi: 1.01,
    title: "Los pobladores se enferman",
    desc: "La enfermedad se propaga entre los pobladores.",
  },
];