import Boga    from "../../../assets/BOGA.png";
import Orestia from "../../../assets/Orestia-cuvieri.png";
import Suche   from "../../../assets/SUCHE.png";

import { FlamencoWalk }     from "./Flamenco/Walk";
import { FlamencoFrontal }  from "./Flamenco/Frontal";
import { ParihuanaWalk }    from "./Parihuana/Walk";
import { ParihuanaFrontal } from "./Parihuana/Frontal";
import { ZampullinWalk }    from "./Zampullin/Walk";
import { ZampullinFrontal } from "./Zampullin/Frontal";

import type { AnimalItem } from "./types";

export const aves: AnimalItem[] = [
  { nombre: "Flamenco chileno",       cientifico: "Nombre cientifico", numero: 259,  estado: "Peligro menor", FrontalComponent: FlamencoFrontal,  WalkComponent: FlamencoWalk  },
  { nombre: "Parihuana negra",        cientifico: "Nombre cientifico", numero: 581,  estado: "Peligro medio", FrontalComponent: ParihuanaFrontal, WalkComponent: ParihuanaWalk },
  { nombre: "Zampullín del Titicaca", cientifico: "Nombre cientifico", numero: 1766, estado: "Peligro Alto",  FrontalComponent: ZampullinFrontal, WalkComponent: ZampullinWalk },
];

export const peces: AnimalItem[] = [
  { nombre: "Boga",            cientifico: "Nombre cientifico", img: Boga,    numero: 120, estado: "Peligro menor" },
  { nombre: "Orestia cuvieri", cientifico: "Nombre cientifico", img: Orestia, numero: 340, estado: "Peligro medio" },
  { nombre: "Suche",           cientifico: "Nombre cientifico", img: Suche,   numero: 890, estado: "Peligro Alto"  },
];
