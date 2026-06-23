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

  const { legA: selLegA, legB: selLegB, body: selBody } = selectors;
  const { pivotA, pivotB, rotation, stepDuration, bobDuration, delay = 0 } = config;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const legA = svg.querySelector<SVGGElement>(selLegA);
    const legB = svg.querySelector<SVGGElement>(selLegB);
    const body = svg.querySelector<SVGGElement>(selBody);
    if (!legA || !legB || !body) return;

    gsap.set(legA, { svgOrigin: pivotA });
    gsap.set(legB, { svgOrigin: pivotB });

    const bob = gsap.to(body, {
      y: 2,
      duration: bobDuration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const walk = gsap.timeline({ repeat: -1, delay });
    walk
      .to(legA, { rotation,  duration: stepDuration, ease: "sine.inOut" })
      .to(legB, { rotation: -rotation, duration: stepDuration, ease: "sine.inOut" }, "<")
      .to(legA, { rotation: -rotation, duration: stepDuration, ease: "sine.inOut" })
      .to(legB, { rotation,  duration: stepDuration, ease: "sine.inOut" }, "<");

    return () => { bob.kill(); walk.kill(); };
  }, [selLegA, selLegB, selBody, pivotA, pivotB, rotation, stepDuration, bobDuration, delay]);

  return svgRef;
};
