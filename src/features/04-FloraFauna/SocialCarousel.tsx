import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type SocialImage = {
  src: string;
  alt: string;
  description: string;
  subtext: string;
};

type SocialCarouselProps = {
  title: string;
  images: SocialImage[];
  /** Píxeles de scroll que la imagen permanece centrada (hold). */
  hold?: number;
  /** Píxeles de scroll de la transición entre una imagen y la siguiente. */
  transition?: number;
};

// Carrusel guiado por scroll (mismo lenguaje que la galería de Juliaca):
// la sección se "pinea" y, al hacer scroll, las imágenes se deslizan en
// horizontal una a una con escala/opacidad, dando sensación de documental.
export const SocialCarousel = ({
  title,
  images,
  hold = 420,
  transition = 200,
}: SocialCarouselProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const imageEls = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-social-image]"),
      );
      const count = imageEls.length;
      if (count === 0) return;

      // Una sola imagen no necesita scroll horizontal.
      const perImage = hold + transition;
      const totalScroll = count > 1 ? (count - 1) * perImage + hold : 0;

      const state = { pos: 0 };

      const render = () => {
        const vw = window.innerWidth;
        const spread = vw < 768 ? 0.5 : 0.42;

        imageEls.forEach((el, i) => {
          const dist = i - state.pos;
          const absDist = Math.abs(dist);

          if (absDist >= 1.5) {
            el.style.opacity = "0";
            return;
          }

          const x = dist * vw * spread;
          const scale = 1 - absDist * 0.4;
          const opacity = 1 - absDist * 0.65;

          el.style.opacity = String(opacity);
          el.style.transform = `translateX(calc(-50% + ${x}px)) translateY(-50%) scale(${scale})`;
          el.style.zIndex = String(Math.round((1.5 - absDist) * 10));

          const textEl = el.querySelector<HTMLElement>("[data-social-text]");
          if (textEl) {
            textEl.style.opacity = absDist < 0.3 ? "1" : "0";
          }
        });
      };

      render();

      if (count < 2) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          start: "top top",
          end: `+=${totalScroll}`,
          onUpdate: render,
        },
      });

      const holdDur = hold / totalScroll;
      const transDur = transition / totalScroll;

      for (let i = 0; i < count; i++) {
        const cycleStart = i * (holdDur + transDur);
        tl.to(state, { pos: i, duration: holdDur }, cycleStart);
        if (i < count - 1) {
          tl.to(state, { pos: i + 1, duration: transDur }, cycleStart + holdDur);
        }
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [images.length, hold, transition] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[100dvh] w-full flex-col items-center overflow-hidden pt-[14vh] md:justify-center md:pt-0"
      style={{
        background: "linear-gradient(to bottom, #586A74 50%, #2e3440 100%)",
      }}
    >
      <h3
        className="text-center uppercase font-semibold text-white"
        style={{
          fontSize: "clamp(14px, 1.9vw, 21px)",
          letterSpacing: "clamp(2px, 0.5vw, 5px)",
          marginBottom: "clamp(16px, 3vh, 40px)",
          maxWidth: "80%",
        }}
      >
        {title}
      </h3>

      <div className="relative w-screen overflow-hidden" style={{ height: "60vh" }}>
        {images.map((img, i) => (
          <div
            key={i}
            data-social-image={i}
            className="absolute left-1/2 top-1/2 flex flex-col items-center will-change-transform"
            style={{ width: "min(620px, 88vw)", opacity: 0 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="max-h-[52vh] w-full rounded-md object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            />

            <div
              data-social-text
              className="mt-4 flex w-full flex-col items-start text-left opacity-0"
            >
              <p
                className="text-white"
                style={{ fontSize: "clamp(14px, 1.6vw, 18px)", margin: 0 }}
              >
                {img.description}
              </p>
              <h5
                className="uppercase font-light"
                style={{
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.55)",
                  margin: "4px 0 0",
                }}
              >
                {img.subtext}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
