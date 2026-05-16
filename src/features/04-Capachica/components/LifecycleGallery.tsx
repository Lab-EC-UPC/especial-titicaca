import { useLifecycle } from "../hooks/useLifecycle";
import { LIFECYCLE_SCENES } from "../constants/lifecycle.constants";
import { LifecycleScene } from "./LifecycleScene";
import { LifecycleNav } from "./LifecycleNav";

export const LifecycleGallery = () => {
  const { current, goTo } = useLifecycle();

  return (
    <div className="w-screen overflow-x-hidden md:h-screen md:overflow-hidden relative">
      {LIFECYCLE_SCENES.map((scene, index) => (
        <LifecycleScene
          key={scene.id}
          src={scene.gif}
          alt={`Lifecycle ${scene.label}`}
          isActive={index === current}
        />
      ))}
      <LifecycleNav
        scenes={LIFECYCLE_SCENES}
        current={current}
        onSelect={goTo}
      />
    </div>
  );
};