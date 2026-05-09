export const TOTAL_FRAMES = 50;

export interface Caption {
  lo: number;
  hi: number;
  title: string;
  desc: string;
}

export const CAPTIONS: Caption[] = [
  { lo: 0, hi: 0.16, title: "El agua contamina la totora", desc: "El agua del lago llega contaminada a los totorales, haciendo que se pudran." },
  { lo: 0.16, hi: 0.33, title: "La oveja consume la totora", desc: "La oveja se acerca y consume la totora podrida y contaminada." },
  { lo: 0.33, hi: 0.56, title: "La oveja muestra efectos físicos", desc: "Ceguera, lagrimeo y cojeo: la oveja camina hacia la derecha debilitándose." },
  { lo: 0.56, hi: 0.68, title: "Los pobladores sacrifican la oveja", desc: "Los pobladores deciden sacrificarla y consumir su carne." },
  { lo: 0.68, hi: 0.83, title: "El poblador evidencia síntomas", desc: "El poblador camina de izquierda a derecha mostrando signos de enfermedad." },
  { lo: 0.83, hi: 1.01, title: "Los pobladores se enferman", desc: "Los pobladores se enferman gravemente y les da diarrea." },
];