import { useEffect, useRef } from "react";
import gsap from "gsap";

export const FlamencoWalk = ({ style }: { style?: React.CSSProperties }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const piernaA = svg.querySelector<SVGGElement>("#pierna-a");
    const piernaB = svg.querySelector<SVGGElement>("#pierna-b");
    const cuerpo = svg.querySelector<SVGGElement>("#cuerpo-lat");

    if (!piernaA || !piernaB || !cuerpo) return;

    gsap.set(piernaA, { svgOrigin: "197 257" });
    gsap.set(piernaB, { svgOrigin: "211 258" });

    const bob = gsap.to(cuerpo, {
      y: 2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const walk = gsap.timeline({ repeat: -1 });
    walk
      .to(piernaA, { rotation: 10, duration: 0.35, ease: "sine.inOut" })
      .to(piernaB, { rotation: -10, duration: 0.35, ease: "sine.inOut" }, "<")
      .to(piernaA, { rotation: -10, duration: 0.35, ease: "sine.inOut" })
      .to(piernaB, { rotation: 10, duration: 0.35, ease: "sine.inOut" }, "<");

    return () => { bob.kill(); walk.kill(); };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 599.16266 549.00269"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <clipPath id="clip-lat" clipPathUnits="userSpaceOnUse">
          <path d="M 0,411.752 H 449.372 V 0 H 0 Z" />
        </clipPath>
      </defs>

      <g transform="matrix(1.3333333,0,0,-1.3333333,0,549.00267)">
        {/* ── Pata A (lateral) ── */}
        <g id="pierna-a">
          <g transform="translate(147.6839,218.7039)">
            <path
              style={{ fill: "#d8bbbc", stroke: "none" }}
              d="m 0,0 0.326,1.415 h 7.237 l -4.462,-15.235 -5.604,-21.818 -4.026,-15.833 -1.524,-5.768 1.105,-5.93 -0.343,-3.537 -1.959,-5.767 -0.435,-3.809 -6.094,-41.732 -4.026,-26.987 -4.19,-25.736 0.545,-1.523 -2.394,-0.327 -6.421,2.34 1.959,4.788 0.598,2.829 2.231,12.242 6.203,31.503 3.972,37.978 0.544,4.299 0.326,17.411 1.796,3.319 1.251,5.495 7.781,29.055 z"
            />
          </g>
          <g transform="translate(141.3153,168.0317)">
            <path
              style={{ fill: "#a94950", stroke: "none" }}
              d="m 0,0 -1.662,-6.604 1.181,-5.992 -0.35,-3.499 -1.968,-5.511 -0.394,-3.893 -3.061,-0.35 -2.45,1.225 -1.618,-1.443 0.262,17.582 1.75,3.28 1.312,5.38 0.787,-1.531 0.132,-1.574 2.055,1.793 0.438,-2.406 2.536,3.062 z"
            />
          </g>
          <g transform="translate(117.6536,55.1464)">
            <path
              style={{ fill: "#bc707a", stroke: "none" }}
              d="m 0,0 0.787,-2.362 v -2.362 l 4.33,-3.63 h 1.444 l 0.656,-1.706 33.94,-9.272 H 26.111 l 3.28,-2.886 -31.971,7.785 -1.794,2.274 v 0.875 l 4.112,9.316 z"
            />
          </g>
        </g>

        {/* ── Pata B (lateral) ── */}
        <g id="pierna-b">
          <g transform="translate(158.1384,218.6112)">
            <path
              style={{ fill: "#d8bbbc", stroke: "none" }}
              d="m 0,0 -1.383,-53.92 1.63,-5.432 1.58,-3.506 0.296,-4.444 -0.395,-0.888 0.099,-5.926 2.074,-25.084 2.518,-41.131 2.42,-31.75 1.975,-1.876 -10.123,1.926 0.395,5.974 0.297,17.233 -3.111,46.316 -3.605,24.442 -1.223,7.186 -1.789,3.134 -1.284,8.937 1.136,6.765 2.469,52.587 z"
            />
          </g>
          <g transform="translate(149.4504,166.5884)">
            <path
              style={{ fill: "#a94950", stroke: "none" }}
              d="m 0,0 1.356,-1.924 1.093,0.962 0.656,-1.269 0.438,-1.618 1.924,1.531 1.225,1.487 0.612,0.044 0.612,-3.062 1.269,-4.024 1.659,-3.63 v -3.668 l -0.27,-0.47 0.01,-6.271 -2.143,-1.444 H 5.686 l -2.187,-3.98 -1.225,8.092 -1.837,3.411 -1.399,8.835 z"
            />
          </g>
          <g transform="translate(159.1163,52.6971)">
            <path
              style={{ fill: "#bc707a", stroke: "none" }}
              d="m 0,0 1.749,-3.193 v -0.612 l 6.08,-2.493 1.881,-1.706 18.369,-3.105 12.596,-5.861 -11.765,2.537 -2.405,-0.569 -3.937,-2.274 3.018,-4.593 -7.566,2.1 -18.326,8.266 -1.925,1.356 1.925,4.111 z"
            />
          </g>
        </g>

        {/* ── Cuerpo + cabeza lateral ── */}
        <g id="cuerpo-lat">
          <g transform="translate(289.9336,324.9207)">
            <path
              style={{ fill: "#b05a53", stroke: "none" }}
              d="m 0,0 -0.91,2.565 -1.821,10.676 -1.324,2.152 -14.234,8.358 -18.868,-7.614 -6.29,-16.137 2.152,-28.385 2.731,-12.827 1.241,-9.021 -5.627,-16.468 -15.31,-1.076 -5.213,22.841 -1.076,6.868 -25.986,26.151 -41.377,3.393 -37.158,-11.337 -71.269,-47.916 -31.117,-36.675 11.813,8.879 -6.177,-11.813 19.844,22.623 5.869,1.622 25.712,2.471 10.424,-1.931 25.789,-3.861 27.179,-5.636 8.339,-12.509 0.496,-1.965 0.768,1.006 0.185,-1.165 1.297,0.98 0.291,-1.271 1.032,1.323 0.132,-1.687 1.085,1.396 0.212,-1.396 0.82,0.92 0.476,-0.92 1.455,1.343 0.239,-1.343 0.979,1.185 0.608,-1.185 0.635,0.973 0.371,-0.973 0.661,1.105 2.435,1.985 9.922,9.049 25.858,4.21 58.711,5.397 12.955,35.46 -11.709,37.784 2.491,9.799 1.495,0.166 1.91,-1.079 3.654,-3.405 6.145,-3.82 5.232,-1.661 z"
            />
          </g>
          <g transform="translate(277.9586,327.8044)">
            <path
              style={{ fill: "#d7b9b9", stroke: "none" }}
              d="m 0,0 3.078,2.12 5.198,-4.514 3.693,-0.342 5.676,-15.115 0.548,-6.634 H 2.531 l -1.368,7.934 -2.121,3.83 1.916,2.53 -0.069,5.198 -2.12,1.437 z"
            />
          </g>
          <g transform="translate(286.9865,317.8873)">
            <path
              style={{ fill: "#070f1e", stroke: "none" }}
              d="m 0,0 2.873,-2.667 1.299,-2.052 v -0.889 l -2.736,2.12 z"
            />
          </g>
          <g transform="translate(280.8995,319.2552)">
            <path
              style={{ fill: "#070f1e", stroke: "none" }}
              d="m 0,0 h 0.752 l 7.421,-7.728 2.086,-3.899 h 4.637 l 0.356,-2.325 v -2.12 L 3.83,-35.359 0.547,-38.3 h -3.146 v 3.83 l 1.641,4.787 0.411,13.884 3.556,4.241 5.164,-0.069 -0.581,1.505 z"
            />
          </g>
          <g transform="translate(275.381,331.4704)">
            <path
              style={{ fill: "#9f8077", stroke: "none" }}
              d="M 0,0 1.103,1.241 2.344,1.746 3.906,1.471 5.561,0 5.79,-2.022 4.641,-3.447 2.895,-3.952 0,-2.482 Z"
            />
          </g>
          <g transform="translate(276.018,331.0063)">
            <path
              style={{ fill: "#a38157", stroke: "none" }}
              d="M 0,0 0.861,0.882 2.646,1.05 3.801,0 V -1.68 L 3.066,-2.373 H 1.491 l -1.323,0.798 z"
            />
          </g>
          <g clipPath="url(#clip-lat)">
            <g transform="translate(278.6847,330.2504)">
              <path
                style={{ fill: "#282622", stroke: "none" }}
                d="m 0,0 c 0,-0.354 -0.287,-0.64 -0.64,-0.64 -0.354,0 -0.641,0.286 -0.641,0.64 0,0.354 0.287,0.64 0.641,0.64 C -0.287,0.64 0,0.354 0,0"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default FlamencoWalk;
