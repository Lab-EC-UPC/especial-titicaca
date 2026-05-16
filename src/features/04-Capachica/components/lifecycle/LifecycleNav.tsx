import type { LifecycleScene } from "../../constants/lifecycle.constants";

interface LifecycleNavProps {
  scenes: LifecycleScene[];
  current: number;
  onSelect: (index: number) => void;
}

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({ label, isActive, onClick }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={`
      w-10 h-10 text-sm
      md:w-14 md:h-14 md:text-lg
      rounded-full flex items-center justify-center font-bold text-white
      transition-all duration-300 z-10 relative shrink-0
      ${isActive
        ? "bg-[#b05040] scale-110 shadow-lg"
        : "bg-[#2c1a1a]/80 hover:bg-[#3d2020]/90"
      }
    `}
  >
    {label}
  </button>
);

const NavConnector = () => (
  <div className="h-1 bg-[#7a3030]/60 w-8 sm:w-12 md:w-16 lg:w-24 shrink-0" />
);

export const LifecycleNav = ({ scenes, current, onSelect }: LifecycleNavProps) => (
  <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center z-20 px-4">
    {scenes.map((scene, index) => (
      <div key={scene.id} className="flex items-center">
        {index > 0 && <NavConnector />}
        <NavButton
          label={scene.label}
          isActive={index === current}
          onClick={() => onSelect(index)}
        />
      </div>
    ))}
  </div>
);