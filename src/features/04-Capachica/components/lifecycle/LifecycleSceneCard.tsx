interface LifecycleSceneCardProps {
  src: string;
  alt: string;
  description: string;
  isActive: boolean;
}

export const LifecycleSceneCard = ({
  src,
  alt,
  description,
  isActive,
}: LifecycleSceneCardProps) => (
  <div
    className={`
      absolute inset-0
      transition-opacity duration-1000 ease-out
      ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />

    <div
      className={`
        absolute inset-0
        bg-linear-to-b from-black/80 via-black/20 to-transparent
        transition-opacity duration-700 delay-300
        ${isActive ? "opacity-100" : "opacity-0"}
      `}
    />

    <div
      className={`
        absolute top-0 left-0 right-0
        px-6 pt-16 pb-20
        md:px-12 md:pt-24 md:pb-24
        transition-opacity duration-700 delay-500
        ${isActive ? "opacity-100" : "opacity-0"}
      `}
    >
      <p
        className="
          text-white font-semibold text-center leading-snug
          text-sm sm:text-base md:text-2xl
          max-w-2xl mx-auto
          drop-shadow-lg
        "
      >
        {description}
      </p>
    </div>
  </div>
);