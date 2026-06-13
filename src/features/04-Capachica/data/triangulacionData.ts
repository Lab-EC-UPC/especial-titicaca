export type LegendTab = "salud" | "mineria";

export interface SaludMarker {
  x: number;
  y: number;
  tipo: "segura" | "riesgo" | "critica";
}

export interface MineriaMarker {
  x: number;
  y: number;
  tipo: "formal" | "informal";
  nombre: string;
  eessMasCercano: string;
  distanciaKm: number;
  descripcion?: string;
}

export interface SaludPopupData {
  zona: "segura" | "riesgo" | "critica";
  provincia: string;
  cantidadTotal: number;
  activo: number;
  desactivado: number;
  categoria: string;
  clasificacion: string;
}

export const PROVINCE_SALUD_POPUPS: Record<string, SaludPopupData[]> = {
  carabaya: [
    {
      zona: "critica", provincia: "Carabaya", cantidadTotal: 29, activo: 29, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Carabaya", cantidadTotal: 8, activo: 8, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Carabaya", cantidadTotal: 8, activo: 8, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
  ],
  "el-collao": [
    {
      zona: "critica", provincia: "El Collao", cantidadTotal: 39, activo: 39, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "Puestos de salud o postas de salud",
    },
    {
      zona: "riesgo", provincia: "El Collao", cantidadTotal: 14, activo: 14, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "El Collao", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  puno: [
    {
      zona: "critica", provincia: "Puno", cantidadTotal: 81, activo: 81, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Puno", cantidadTotal: 37, activo: 37, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Puno", cantidadTotal: 6, activo: 6, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  chucuito: [
    {
      zona: "critica", provincia: "Chucuito", cantidadTotal: 38, activo: 38, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Chucuito", cantidadTotal: 11, activo: 11, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Chucuito", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  yunguyo: [
    {
      zona: "critica", provincia: "Yunguyo", cantidadTotal: 7, activo: 7, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Yunguyo", cantidadTotal: 10, activo: 10, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Yunguyo", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  "san-roman": [
    {
      zona: "critica", provincia: "San Román", cantidadTotal: 24, activo: 24, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "San Román", cantidadTotal: 59, activo: 59, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "San Román", cantidadTotal: 9, activo: 9, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  lampa: [
    {
      zona: "critica", provincia: "Lampa", cantidadTotal: 21, activo: 21, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Lampa", cantidadTotal: 5, activo: 5, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Lampa", cantidadTotal: 2, activo: 2, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  huancane: [
    {
      zona: "critica", provincia: "Huancané", cantidadTotal: 44, activo: 40, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Huancané", cantidadTotal: 8, activo: 8, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Huancané", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  moho: [
    {
      zona: "critica", provincia: "Moho", cantidadTotal: 13, activo: 13, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Moho", cantidadTotal: 3, activo: 3, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
  ],
  azangaro: [
    {
      zona: "critica", provincia: "Azángaro", cantidadTotal: 34, activo: 34, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Azángaro", cantidadTotal: 14, activo: 14, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Azángaro", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  "san-antonio-de-putina": [
    {
      zona: "critica", provincia: "San Antonio de Putina", cantidadTotal: 6, activo: 6, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "San Antonio de Putina", cantidadTotal: 3, activo: 3, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
  ],
  sandia: [
    {
      zona: "critica", provincia: "Sandia", cantidadTotal: 26, activo: 26, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Sandia", cantidadTotal: 9, activo: 9, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Sandia", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
  melgar: [
    {
      zona: "critica", provincia: "Melgar", cantidadTotal: 33, activo: 33, desactivado: 0,
      categoria: "Posta básica (I-1) y Puesto c/médico (I-2)",
      clasificacion: "PUESTOS DE SALUD O POSTAS DE SALUD",
    },
    {
      zona: "riesgo", provincia: "Melgar", cantidadTotal: 7, activo: 7, desactivado: 0,
      categoria: "Centro de Salud (I-3) y Centro c/especialidades (I-4)",
      clasificacion: "Centros de salud o centros médicos y/o centros de salud con camas de internamiento",
    },
    {
      zona: "segura", provincia: "Melgar", cantidadTotal: 1, activo: 1, desactivado: 0,
      categoria: "Hospitales (II-1/II-2/II-E)",
      clasificacion: "Hospitales o clínicas de atención general",
    },
  ],
};

export const PROVINCE_MARKERS: Record<string, { salud: SaludMarker[]; mineria: MineriaMarker[] }> = {
  carabaya: {
    mineria: [
      { x: 793,  y: 503, tipo: "informal", nombre: "Ollachea",      eessMasCercano: "KCANA (I-2)",         distanciaKm: 2.4, descripcion: "Con cobertura a 2.4 km del EESS más cercano" },
      { x: 1045, y: 615, tipo: "informal", nombre: "Carabaya Norte", eessMasCercano: "TAHUANA (I-1)",       distanciaKm: 0.3, descripcion: "Con cobertura a 0.3 km del EESS más cercano" },
      { x: 1012, y: 906, tipo: "informal", nombre: "Crucero",        eessMasCercano: "IPRESS CRUCERO (I-4)", distanciaKm: 0.8, descripcion: "Con cobertura a 0.8 km del EESS más cercano" },
    ],
    salud: [
      { x: 728,  y: 725, tipo: "segura"  },
      { x: 750,  y: 718, tipo: "riesgo"  },
      { x: 735,  y: 274, tipo: "riesgo"  },
      { x: 653,  y: 313, tipo: "riesgo"  },
      { x: 688,  y: 530, tipo: "riesgo"  },
      { x: 651,  y: 623, tipo: "riesgo"  },
      { x: 1009, y: 779, tipo: "riesgo"  },
      { x: 1030, y: 679, tipo: "riesgo"  },
      { x: 1035, y: 777, tipo: "riesgo"  },
      { x: 860,  y: 848, tipo: "riesgo"  },
      { x: 743,  y:  86, tipo: "critica" },
      { x: 797,  y: 142, tipo: "critica" },
      { x: 800,  y: 288, tipo: "critica" },
      { x: 810,  y: 186, tipo: "critica" },
      { x: 797,  y: 242, tipo: "critica" },
      { x: 511,  y: 447, tipo: "critica" },
      { x: 535,  y: 447, tipo: "critica" },
      { x: 560,  y: 447, tipo: "critica" },
      { x: 765,  y: 438, tipo: "critica" },
      { x: 778,  y: 546, tipo: "critica" },
      { x: 780,  y: 565, tipo: "critica" },
      { x: 505,  y: 685, tipo: "critica" },
      { x: 555,  y: 697, tipo: "critica" },
      { x: 555,  y: 582, tipo: "critica" },
      { x: 648,  y: 750, tipo: "critica" },
      { x: 661,  y: 622, tipo: "critica" },
      { x: 765,  y: 612, tipo: "critica" },
      { x: 838,  y: 824, tipo: "critica" },
      { x: 961,  y: 595, tipo: "critica" },
      { x: 1000, y: 677, tipo: "critica" },
      { x: 1067, y: 640, tipo: "critica" },
      { x: 1074, y: 599, tipo: "critica" },
      { x: 1097, y: 642, tipo: "critica" },
      { x: 1131, y: 644, tipo: "critica" },
      { x: 1144, y: 598, tipo: "critica" },
      { x: 1039, y: 779, tipo: "critica" },
      { x: 1068, y: 942, tipo: "critica" },
      { x: 1076, y: 960, tipo: "critica" },
      { x: 1072, y: 981, tipo: "critica" },
    ],
  },
  "el-collao":           { salud: [], mineria: [] },
  puno:                  { salud: [], mineria: [] },
  chucuito:              { salud: [], mineria: [] },
  yunguyo:               { salud: [], mineria: [] },
  "san-roman":           { salud: [], mineria: [] },
  lampa:                 { salud: [], mineria: [] },
  huancane:              { salud: [], mineria: [] },
  moho:                  { salud: [], mineria: [] },
  azangaro:              { salud: [], mineria: [] },
  "san-antonio-de-putina": { salud: [], mineria: [] },
   sandia: {
    salud: [
      { x:  820, y:  800, tipo: "segura"  },
      { x:  845, y:  790, tipo: "riesgo"  },
      { x:  700, y:  420, tipo: "riesgo"  },
      { x:  830, y:  560, tipo: "riesgo"  },
      { x:  670, y:  660, tipo: "riesgo"  },
      { x:  790, y:  720, tipo: "riesgo"  },
      { x: 1060, y:  210, tipo: "riesgo"  },
      { x: 1315, y:  309, tipo: "riesgo"  },
      { x: 1400, y:  310, tipo: "riesgo"  },
      { x:  920, y:  880, tipo: "riesgo"  },
      { x:  580, y:  430, tipo: "critica"  },
      { x:  660, y:  470, tipo: "critica"  },
      { x: 1435, y:  516, tipo: "critica"  },
      { x: 1421, y:  476, tipo: "critica"  },
      { x:  763, y:  550, tipo: "critica"  },
      { x: 1452, y:  551, tipo: "critica"  },
      { x:  568, y:  570, tipo: "critica"  },
      { x:  593, y:  577, tipo: "critica"  },
      { x:  600, y:  645, tipo: "critica"  },
      { x:  614, y:  654, tipo: "critica"  },
      { x:  643, y:  728, tipo: "critica"  },
      { x:  660, y:  638, tipo: "critica"  },
      { x:  672, y:  648, tipo: "critica"  },
      { x:  681, y:  698, tipo: "critica"  },
      { x:  696, y:  704, tipo: "critica"  },
      { x:  718, y:  657, tipo: "critica"  },
      { x:  726, y:  664, tipo: "critica"  },
      { x:  734, y:  724, tipo: "critica"  },
      { x:  762, y:  764, tipo: "critica"  },
      { x:  788, y:  763, tipo: "critica"  },
      { x:  810, y:  789, tipo: "critica"  },
      { x:  838, y:  765, tipo: "critica"  },
      { x:  852, y:  790, tipo: "critica"  },
      { x:  866, y:  781, tipo: "critica"  },
      { x:  894, y:  778, tipo: "critica"  },
      { x:  864, y:  824, tipo: "critica"  },
    ],
    mineria: [

    ],
  },
  
  melgar:                { salud: [], mineria: [] },
};
