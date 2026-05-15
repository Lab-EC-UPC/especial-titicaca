import lifecycle1 from "/src/assets/lifecycle/lifecycle-animation-1.gif";
import lifecycle2 from "/src/assets/lifecycle/lifecycle-animation-2.gif";
import lifecycle3 from "/src/assets/lifecycle/lifecycle-animation-3.gif";
import lifecycle4 from "/src/assets/lifecycle/lifecycle-animation-4.gif";

export interface LifecycleScene {
  id: string;
  gif: string;
  label: string;
}

export const LIFECYCLE_SCENES: LifecycleScene[] = [
  { id: "A", label: "A", gif: lifecycle1 },
  { id: "B", label: "B", gif: lifecycle2 },
  { id: "C", label: "C", gif: lifecycle3 },
  { id: "D", label: "D", gif: lifecycle4 },
];