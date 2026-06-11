import { useEffect, useRef } from "react";
import gsap from "gsap";

type Selectors = {
  legA: string;
  legB: string;
  body: string;
};

type Config = {
  pivotA: string;
  pivotB: string;
  rotation: number;
  stepDuration: number;
  bobDuration: number;
  delay?: number;
};

export const useBirdWalk = (selectors: Selectors, config: Config) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const legA = svg.querySelector<SVGGElement>(selectors.legA);
    const legB = svg.querySelector<SVGGElement>(selectors.legB);
    const body = svg.querySelector<SVGGElement>(selectors.body);
    if (!legA || !legB || !body) return;

    gsap.set(legA, { svgOrigin: config.pivotA });
    gsap.set(legB, { svgOrigin: config.pivotB });

    const bob = gsap.to(body, {
      y: 2,
      duration: config.bobDuration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const { rotation, stepDuration, delay = 0 } = config;
    const walk = gsap.timeline({ repeat: -1, delay });
    walk
      .to(legA, { rotation,  duration: stepDuration, ease: "sine.inOut" })
      .to(legB, { rotation: -rotation, duration: stepDuration, ease: "sine.inOut" }, "<")
      .to(legA, { rotation: -rotation, duration: stepDuration, ease: "sine.inOut" })
      .to(legB, { rotation,  duration: stepDuration, ease: "sine.inOut" }, "<");

    return () => { bob.kill(); walk.kill(); };
  }, [selectors.legA, selectors.legB, selectors.body, config.pivotA, config.pivotB, config.rotation, config.stepDuration, config.bobDuration, config.delay]);

  return svgRef;
};
