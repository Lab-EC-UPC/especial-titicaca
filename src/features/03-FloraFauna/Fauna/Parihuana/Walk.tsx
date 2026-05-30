import type { CSSProperties } from "react";
import { useBirdWalk } from "../useBirdWalk";

export const ParihuanaWalk = ({ style }: { style?: CSSProperties }) => {
  const svgRef = useBirdWalk(
    { legA: "#pata-a-par", legB: "#pata-b-par", body: "#cuerpo-par" },
    { pivotA: "141 168", pivotB: "130 168", rotation: 8, stepDuration: 0.8, bobDuration: 1.45, delay: 0.25 },
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 15 335 270"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <clipPath id="clip-par-lat" clipPathUnits="userSpaceOnUse">
          <path d="M 0,238.944 H 449.825 V 0 H 0 Z" />
        </clipPath>
      </defs>

      <g transform="matrix(1.3333333,0,0,-1.3333333,0,318.592)">

        {/* Pata A (lateral) */}
        <g id="pata-a-par">
          <g transform="translate(105.5512,93.8062)">
            <path style={{ fill: "#171b15", stroke: "none" }} d="m 0,0 5.274,-0.429 -0.493,-12.827 2.776,-3.246 -2.978,-6.889 3.339,-32.329 3.455,-2.507 11.186,1.291 14.53,-8.106 -13.547,4.737 -10.904,-1.228 10.77,-8.645 -14.163,7.335 -3.481,-0.196 -8.614,-8.098 7.629,11.607 -0.212,3.008 -4.61,37.203 z" />
          </g>
        </g>

        {/* Pata B (lateral) */}
        <g id="pata-b-par">
          <g transform="translate(97.7508,93.5287)">
            <path style={{ fill: "#171b15", stroke: "none" }} d="m 0,0 5.135,-1.279 -2.567,-12.577 2.212,-3.653 -4.055,-6.315 -1.949,-32.443 3.003,-3.033 11.247,-0.541 13.023,-10.356 -12.6,6.872 -10.958,0.557 9.225,-10.277 -12.785,9.534 -3.468,0.372 -9.813,-6.594 9.411,10.216 0.278,3.002 1.485,37.458 z" />
          </g>
        </g>

        {/* Cuerpo + cabeza lateral */}
        <g id="cuerpo-par">
          <g clipPath="url(#clip-par-lat)">
            {/* Cuerpo */}
            <g transform="translate(50.3297,119.8049)">
              <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 c 0.962,0.885 1.534,1.411 1.534,1.411 l -26.431,-10.892 15.612,25.052 20.113,11.4 13.506,14.595 44.004,21.784 34.418,-0.363 14.668,-7.77 c 0,0 29.03,-19.313 30.778,-20.476 C 147.028,32.68 133.689,9.253 133.689,9.253 l -24.398,-12.416 -41.607,-15.249 -0.653,-5.809 -6.172,-7.407 -6.1,0.654 -2.178,-1.815 -5.083,1.161 -3.558,8.06 0.799,5.446 -14.886,3.558 -50.974,-4.865 c 0,0 16.028,14.744 21.121,19.429" />
            </g>
            {/* Cabeza / cuello */}
            <g transform="translate(198.5581,154.9687)">
              <path style={{ fill: "#31271d", stroke: "none" }} d="m 0,0 -14.69,-25.991 -16.245,46.19 -3.107,21.895 7.486,16.526 15.397,3.814 8.475,-5.156 L 5.438,50.569 4.661,45.06 -0.141,31.994 -3.602,31.146 Z" />
            </g>
          </g>

          {/* Pico */}
          <g transform="translate(189.4092,199.4843)">
            <path style={{ fill: "#76424d", stroke: "none" }} d="m 0,0 1.375,4.559 10.058,-3.98 2.533,0.145 24.748,-23.446 14.545,-17.801 5.645,-14.545 -9.697,12.88 -11.289,12.374 -13.532,9.769 -15.558,7.671 -2.605,6.802 -2.243,1.447 z" />
          </g>
          <g transform="translate(195.4324,194.5309)">
            <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 h 1.829 l 18.7,-11.721 10.976,-8.605 12.466,-13.956 8.808,-15.38 -9.282,14.634 -12.67,13.822 -10.908,8.74 z" />
          </g>
          <g transform="translate(203.1561,196.0892)">
            <path style={{ fill: "#03161b", stroke: "none" }} d="M 0,0 1.355,-2.168 4.607,-4.201 2.778,-2.1 Z" />
          </g>

          {/* Ojo */}
          <g transform="translate(187.4665,204.1852)">
            <path style={{ fill: "#963138", stroke: "none" }} d="m 0,0 -1.005,-2.011 0.818,-2.127 2.502,-0.678 1.776,1.192 0.515,1.871 -2.058,1.987 z" />
          </g>
          <g transform="translate(188.2023,202.2424)">
            <path style={{ fill: "#03161b", stroke: "none" }} d="M 0,0 0.918,0.683 1.93,0.118 2.072,-0.824 1.201,-1.413 H 0.73 L 0,-0.918 Z" />
          </g>
        </g>

      </g>
    </svg>
  );
};

export default ParihuanaWalk;
