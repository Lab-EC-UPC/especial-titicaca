interface LifecycleSceneProps {
  src: string;
  alt: string;
  isActive: boolean;
}

export const LifecycleScene = ({ src, alt, isActive }: LifecycleSceneProps) => (
  <img
    src={src}
    alt={alt}
    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
      isActive ? "opacity-100" : "opacity-0"
    }`}
  />
);