interface LifecycleSceneProps {
  src: string;
  alt: string;
  isActive: boolean;
}

export const LifecycleScene = ({ src, alt, isActive }: LifecycleSceneProps) => (
  <img
    src={src}
    alt={alt}
    className={`
      w-full h-auto
      md:absolute md:inset-0 md:h-full md:object-cover
      transition-opacity duration-700
      ${isActive ? "opacity-100 block" : "opacity-0 hidden md:block"}
    `}
  />
);