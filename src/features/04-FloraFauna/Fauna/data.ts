import Boga from "../assets/BOGA.webp";
import Orestia from "../assets/Orestia-cuvieri.webp";
import Suche from "../assets/SUCHE.webp";

import { FlamencoWalk } from "./Flamenco/Walk";
import { FlamencoFrontal } from "./Flamenco/Frontal";
import { ParihuanaWalk } from "./Parihuana/Walk";
import { ParihuanaFrontal } from "./Parihuana/Frontal";
import { ZampullinWalk } from "./Zampullin/Walk";
import { ZampullinFrontal } from "./Zampullin/Frontal";

import type { AnimalItem } from "./types";

export const aves: AnimalItem[] = [
  { nombre: "PUNA IBIS", cientifico: "Plegadis ridgwayi", numero: 259, estado: "PELIGRO MENOR", FrontalComponent: ParihuanaFrontal, WalkComponent: ParihuanaWalk },
  { nombre: "FLAMENCO CHILENO", cientifico: "Phoenicopterus chilensis", numero: 581, estado: "PELIGRO MEDIO", FrontalComponent: FlamencoFrontal, WalkComponent: FlamencoWalk },
  { nombre: "ZAMPULLIN DEL TITICACA", cientifico: "Rollandia microptera", numero: 1766, estado: "PELIGRO ALTO", FrontalComponent: ZampullinFrontal, WalkComponent: ZampullinWalk },
];

export const peces: AnimalItem[] = [
  { nombre: "SUCHE", cientifico: "Trichomycterus rivulatus", img: Suche, numero: 3000, estado: "PELIGRO MEDIO" },
  { nombre: "BOGA", cientifico: "Orestias pentlandii", img: Boga, numero: 1200, estado: "PELIGRO ALTO" },
  { nombre: "UMANTO", cientifico: "Orestias cuvieri", img: Orestia, numero: 0, estado: "EXTINTO" },

];
