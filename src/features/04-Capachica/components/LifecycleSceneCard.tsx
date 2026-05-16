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
      transition-opacity duration-700
      ${isActive ? "relative block w-full" : "hidden"}
      md:block md:absolute md:inset-0
      ${isActive ? "md:opacity-100" : "md:opacity-0"}
    `}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-auto md:h-full md:object-cover"
    />

    <div className="
      absolute top-0 left-0 right-0
      px-6 pt-8 pb-20
      md:px-12 md:pt-12 md:pb-24
      bg-gradient-to-b from-black/70 via-black/30 to-transparent
    ">
      <p className="
        text-white font-semibold text-center leading-snug
        text-sm sm:text-base md:text-2xl
        max-w-xl mx-auto
        drop-shadow-md
      ">
        {description}
      </p>
    </div>
  </div>
);