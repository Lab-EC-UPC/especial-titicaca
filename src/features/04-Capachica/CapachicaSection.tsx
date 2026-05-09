import React, { useEffect, useRef, useState } from "react";
import { SceneRenderer } from "./SceneRenderer";
import { CAPTIONS, TOTAL_FRAMES } from "./constants";
import { clamp } from "./mathUtils";

export const CapachicaSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // current visible frame
  const [frameIndex, setFrameIndex] = useState(0);

  // text fade effect
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollTop = -rect.top;

      // total scroll distance
      const scrollableHeight =
        section.offsetHeight - window.innerHeight;

      if (scrollableHeight <= 0) return;

      // normalized progress
      const progress = clamp(
        scrollTop / scrollableHeight,
        0,
        1
      );

      // frame based on scroll
      const currentFrame = Math.round(
        progress * (TOTAL_FRAMES - 1)
      );

      setFrameIndex(currentFrame);

      // smooth fade in/out
      const nearStart = progress < 0.1 ? progress / 0.1 : 1;
      const nearEnd = progress > 0.9 ? 1 - (progress - 0.9) / 0.1 : 1;

      setOpacity(Math.min(nearStart, nearEnd));
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const timelineProgress =
    frameIndex / (TOTAL_FRAMES - 1);

  // active caption
  const currentCaption =
    CAPTIONS.find(
      (c) =>
        timelineProgress >= c.lo &&
        timelineProgress < c.hi
    ) || CAPTIONS[0];

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        // controls animation duration
        height: `${TOTAL_FRAMES * 100}px`,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* background frames */}
        <div className="absolute inset-0 z-0">
          <SceneRenderer frameIndex={frameIndex} />
        </div>

        {/* overlay content */}
        <div className="relative z-10 flex h-full items-start justify-center px-6 pt-[15vh] text-center">
          <div
            className="transition-all duration-500"
            style={{ opacity }}
          >
            <h2 className="text-3xl font-medium leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
              {currentCaption.title}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-lg md:text-xl lg:text-2xl">
              {currentCaption.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};