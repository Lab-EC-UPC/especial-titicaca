import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type SocialImage = {
  src: string;
  alt: string;
  description: string;
  subtext: string;
};

type SocialCarouselProps = {
  title: string;
  images: SocialImage[];
};

// Carrusel por click: muestra la imagen actual con su descripción y la siguiente
// asomando a la derecha. Al hacer click (en la imagen, en la que asoma o en un
// punto) avanza con una transición.
export const SocialCarousel = ({ title, images }: SocialCarouselProps) => {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goTo = (i: number) => setIndex((i + count) % count);
  const next = () => goTo(index + 1);

  const current = images[index];
  const upcoming = images[(index + 1) % count];

  return (
    <section
      className="relative flex w-full flex-col items-center overflow-x-hidden px-4 sm:px-6"
      style={{
        background: "linear-gradient(to bottom, #586A74 50%, #2e3440 100%)",
        paddingTop: "clamp(80px, 16vh, 180px)",
        paddingBottom: "clamp(80px, 16vh, 180px)",
      }}
    >
      <p
        className="text-center uppercase font-semibold text-white"
        style={{
          fontSize: "clamp(14px, 1.9vw, 21px)",
          letterSpacing: "clamp(2px, 0.5vw, 5px)",
          marginBottom: "clamp(28px, 5vh, 56px)",
        }}
      >
        {title}
      </p>

      <div
        className="relative flex w-full justify-center"
        style={{ maxWidth: "min(900px, 96vw)" }}
      >
        {/* Imagen siguiente asomando a la derecha (click = avanzar) */}
        {count > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente imagen"
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[55%] cursor-pointer border-0 bg-transparent p-0 transition-opacity hover:opacity-60 sm:block"
            style={{ width: "clamp(120px, 22vw, 260px)", opacity: 0.35 }}
          >
            <img
              src={upcoming.src}
              alt=""
              aria-hidden="true"
              className="h-auto w-full rounded-md object-cover"
            />
          </button>
        )}

        {/* Imagen actual + descripción (click = avanzar) */}
        <div
          className="relative flex w-full flex-col items-center"
          style={{ maxWidth: "min(620px, 92vw)" }}
        >
          <AnimatePresence mode="wait">
            <motion.button
              type="button"
              key={index}
              onClick={next}
              aria-label={`Imagen ${index + 1} de ${count}: ${current.description}`}
              className="block w-full cursor-pointer border-0 bg-transparent p-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <img
                src={current.src}
                alt={current.alt}
                className="h-auto w-full rounded-md object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              />
            </motion.button>
          </AnimatePresence>

          <div className="mt-4 self-start text-left">
            <p
              className="font-light text-white"
              style={{ fontSize: "clamp(14px, 1.6vw, 18px)", margin: 0 }}
            >
              {current.description}
            </p>
            <p
              className="uppercase font-light"
              style={{
                fontSize: "clamp(11px, 1.2vw, 14px)",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.55)",
                margin: "4px 0 0",
              }}
            >
              {current.subtext}
            </p>
            {count > 1 && (
              <p
                className="font-light"
                style={{
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  color: "rgba(255,255,255,0.4)",
                  margin: "10px 0 0",
                }}
              >
                Haz clic para ver la siguiente →
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores (click = ir a esa imagen) */}
      {count > 1 && (
        <div
          className="flex items-center gap-2"
          style={{ marginTop: "clamp(20px, 4vh, 36px)" }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === index ? "24px" : "8px",
                height: "8px",
                background:
                  i === index ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                border: 0,
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
