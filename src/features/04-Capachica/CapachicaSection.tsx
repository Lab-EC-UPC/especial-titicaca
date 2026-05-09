import React, { useEffect, useRef, useState } from "react";

import { SceneRenderer } from "./SceneRenderer";
import { CAPTIONS, TOTAL_FRAMES } from "./constants";
import { clamp } from "./mathUtils";

export const CapachicaSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    // Updates current frame based on scroll progress
    const handleScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const scrollTop = -section.getBoundingClientRect().top;

      const scrollableHeight =
        section.offsetHeight - window.innerHeight;

      if (scrollableHeight <= 0) return;

      const progress = clamp(
        scrollTop / scrollableHeight,
        0,
        1,
      );

      setFrameIndex(
        Math.round(progress * (TOTAL_FRAMES - 1)),
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  // Timeline progress (0 → 1)
  const timelineProgress =
    frameIndex / (TOTAL_FRAMES - 1);

  // Active caption for current scene
  const currentCaption =
    CAPTIONS.find(
      (caption) =>
        timelineProgress >= caption.lo &&
        timelineProgress < caption.hi,
    ) || CAPTIONS[CAPTIONS.length - 1];

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        height: `${TOTAL_FRAMES * 90}px`,
      }}
    >
      {/* Sticky cinematic viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Main animated scene */}
        <div className="absolute inset-0 z-0">
          <SceneRenderer t={timelineProgress} />
        </div>

        {/* Scene caption */}
        <div className="absolute left-1/2 top-[12%] z-20 w-full max-w-3xl -translate-x-1/2 px-6 text-center">
          <h4 className="font-serif text-3xl font-bold tracking-tight text-[#2d4a2d] drop-shadow-md transition-all duration-500 md:text-5xl">
            {currentCaption.title}
          </h4>

          <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-relaxed text-[#4a3a30] drop-shadow-sm md:text-lg">
            {currentCaption.desc}
          </p>
        </div>

        {/* Initial scroll hint */}
        {frameIndex < 2 && (
          <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 animate-bounce text-xs uppercase tracking-[0.3em] text-[#2d4a2d]/40">
            Scroll
          </div>
        )}
      </div>
    </section>
  );
};