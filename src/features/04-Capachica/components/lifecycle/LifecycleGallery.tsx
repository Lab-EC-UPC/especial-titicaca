import { useLifecycle } from "../../hooks/useLifecycle";
import { LIFECYCLE_SCENES } from "../../constants/lifecycle.constants";
import { LifecycleSceneCard } from "./LifecycleSceneCard";
import { LifecycleNav } from "./LifecycleNav";

export const LifecycleGallery = () => {
  const { current, goTo } = useLifecycle();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {LIFECYCLE_SCENES.map((scene, index) => (
        <LifecycleSceneCard
          key={scene.id}
          src={scene.gif}
          alt={`Lifecycle ${scene.label}`}
          description={scene.description}
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