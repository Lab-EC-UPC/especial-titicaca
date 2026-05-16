import lifecycle1 from "/src/assets/lifecycle/lifecycle-animation-1.gif";
import lifecycle2 from "/src/assets/lifecycle/lifecycle-animation-2.gif";
import lifecycle3 from "/src/assets/lifecycle/lifecycle-animation-3.gif";
import lifecycle4 from "/src/assets/lifecycle/lifecycle-animation-4.gif";

export interface LifecycleScene {
  id: string;
  label: string;
  gif: string;
  description: string;
}

export const LIFECYCLE_SCENES: LifecycleScene[] = [
  {
    id: "A",
    label: "A",
    gif: lifecycle1,
    description: "El agua contamina la totora, la cual se pudre y es consumida por la oveja.",
  },
  {
    id: "B",
    label: "B",
    gif: lifecycle2,
    description: "La oveja tiene efectos físicos (ceguera, legañas, lagrimeo y cojeo).",
  },
  {
    id: "C",
    label: "C",
    gif: lifecycle3,
    description: "Los pobladores deciden sacrificarla y consumir su carne.",
  },
  {
    id: "D",
    label: "D",
    gif: lifecycle4,
    description: "Los pobladores se enferman y les da diarrea.",
  },
];