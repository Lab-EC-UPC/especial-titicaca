import type { CSSProperties, ReactElement } from "react";

export type AnimalComponent = (props: { style?: CSSProperties }) => ReactElement;

export type AnimalItem = {
  nombre: string;
  cientifico: string;
  numero: number;
  estado: string;
  img?: string;
  FrontalComponent?: AnimalComponent;
  WalkComponent?: AnimalComponent;
};

export type TabKey = "aves" | "peces";
