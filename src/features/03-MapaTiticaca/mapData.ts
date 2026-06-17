export const LEVELS = {
  critical: {
    color: "#E91E8C",
    label: "CRÍTICO",
    sub: "Relaves mineros, drenaje ácido",
  },
  high: { color: "#F06292", label: "ALTO", sub: "Daño bacteriológico" },
  moderate: {
    color: "#CE93D8",
    label: "MODERADO",
    sub: "Excedencias menores de uso urbano",
  },
  sin: {
    color: "#90A4AE",
    label: "SIN EXCEDENCIAS",
    sub: "No se registran excedencias",
  },
} as const;

export const SCALE = 2.2;
export const MAX_T = parseFloat((((1 - 1 / SCALE) / 2) * 100).toFixed(1));
export const clampT = (v: number) => Math.max(-MAX_T, Math.min(MAX_T, v));
export const clampDot = (v: number) => Math.max(0, Math.min(100, v));
export const DESKTOP_RATIO = 1920 / 1080;
export const MOBILE_RATIO = 412 / 917;
export const MOBILE_BP = 768;

export type LevelKey = keyof typeof LEVELS;
export type CuencaId =
  | "azangaro"
  | "lagunillas"
  | "pucara"
  | "ilave"
  | "illpa"
  | "suches"
  | "ramis"
  | "huancane";

export interface XY {
  x: number;
  y: number;
}

export type ZoomTargets = Record<CuencaId, XY>;
export type DotPositions = Record<CuencaId, XY>;

export interface Cuenca {
  id: CuencaId;
  name: string;
  shortName: string;
  contaminant: string;
  value: string;
  excede: string;
  level: LevelKey;
}

export const CUENCAS: Cuenca[] = [
  {
    id: "azangaro",
    name: "Cuenca Azángaro",
    shortName: "Azángaro",
    contaminant: "Mercurio",
    value: "2.15 mg/L",
    excede: "2153 veces",
    level: "critical",
  },
  {
    id: "lagunillas",
    name: "Cuenca Lagunillas",
    shortName: "Lagunillas",
    contaminant: "Hierro",
    value: "2.67 mg/L",
    excede: "0.6 veces",
    level: "sin",
  },
  {
    id: "pucara",
    name: "Cuenca Pucará",
    shortName: "Pucará",
    contaminant: "Hierro",
    value: "128.07 mg/L",
    excede: "25.6 veces",
    level: "high",
  },
  {
    id: "ilave",
    name: "Cuenca Ilave",
    shortName: "Ilave",
    contaminant: "Arsénico",
    value: "0.03 mg/L",
    excede: "3.4 veces",
    level: "moderate",
  },
  {
    id: "illpa",
    name: "Cuenca Illpa",
    shortName: "Illpa",
    contaminant: "Aluminio",
    value: "13.13 mg/L",
    excede: "2.6 veces",
    level: "moderate",
  },
  {
    id: "suches",
    name: "Cuencas Suches",
    shortName: "Suches",
    contaminant: "Aluminio",
    value: "40.28 mg/L",
    excede: "5.0 veces",
    level: "high",
  },
  {
    id: "ramis",
    name: "Intercuenca Ramis",
    shortName: "Ramis",
    contaminant: "Hierro",
    value: "178.05 mg/L",
    excede: "35.6 veces",
    level: "critical",
  },
  {
    id: "huancane",
    name: "Cuenca Huancané",
    shortName: "Huancané",
    contaminant: "Cobre",
    value: "3.00 mg/L",
    excede: "15 veces",
    level: "high",
  },
];

export const ZOOM_DESKTOP: ZoomTargets = {
  azangaro: { x: 21.2, y: 27.2 },
  lagunillas: { x: 21.7, y: -15.3 },
  pucara: { x: 21.7, y: 27.2 },
  ilave: { x: 11.2, y: -27.3 },
  illpa: { x: 19.7, y: 11.2 },
  suches: { x: 3.2, y: 27.2 },
  ramis: { x: 18.7, y: 24.2 },
  huancane: { x: 2.7, y: 27.2 },
};

export const DOTS_DESKTOP: DotPositions = {
  azangaro: { x: 30.5, y: 8.5 },
  lagunillas: { x: 30.5, y: 57.0 },
  pucara: { x: 25.5, y: 11.5 },
  ilave: { x: 41.5, y: 81.5 },
  illpa: { x: 26.5, y: 41.5 },
  suches: { x: 45.5, y: 7.0 },
  ramis: { x: 35.5, y: 24.0 },
  huancane: { x: 47.0, y: 12.5 },
};

export const ZOOM_MOBILE: ZoomTargets = {
  azangaro: { x: 27.2, y: 7.7 },
  lagunillas: { x: 22.7, y: -8.8 },
  pucara: { x: 23.2, y: 13.2 },
  ilave: { x: 11.2, y: -9.3 },
  illpa: { x: 20.7, y: 5.2 },
  suches: { x: 6.2, y: 11.7 },
  ramis: { x: 19.2, y: 8.7 },
  huancane: { x: 4.2, y: 10.7 },
};

export const DOTS_MOBILE: DotPositions = {
  azangaro: { x: 19.0, y: 27.5 },
  lagunillas: { x: 20.5, y: 54.5 },
  pucara: { x: 9.0, y: 29.0 },
  ilave: { x: 45.0, y: 85.5 },
  illpa: { x: 26.0, y: 43.0 },
  suches: { x: 45.0, y: 13.5 },
  ramis: { x: 34.0, y: 29.5 },
  huancane: { x: 47.0, y: 20.0 },
};
