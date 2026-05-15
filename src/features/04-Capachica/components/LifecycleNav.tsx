import type { LifecycleScene } from "../constants/lifecycle.constants";

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
    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg
      transition-all duration-300 z-10 relative
      ${isActive
        ? "bg-[#b05040] scale-110 shadow-lg"
        : "bg-[#2c1a1a]/80 hover:bg-[#3d2020]/90"
      }`}
  >
    {label}
  </button>
);

const NavConnector = () => (
  <div className="flex-1 h-1 bg-[#7a3030]/60 min-w-[60px] max-w-[120px]" />
);

export const LifecycleNav = ({ scenes, current, onSelect }: LifecycleNavProps) => (
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center z-20">
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