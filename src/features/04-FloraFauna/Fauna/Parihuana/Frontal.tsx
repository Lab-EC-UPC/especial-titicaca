import type { CSSProperties } from "react";

export const ParihuanaFrontal = ({ style }: { style?: CSSProperties }) => (
  <svg
    viewBox="405 10 170 285"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <defs>
      <clipPath id="clip-par-front" clipPathUnits="userSpaceOnUse">
        <path d="M 0,238.944 H 449.825 V 0 H 0 Z" />
      </clipPath>
    </defs>

    <g transform="matrix(1.3333333,0,0,-1.3333333,0,318.592)">

      {/* Pata derecha frontal */}
      <g transform="translate(384.4834,87.5322)">
        <path style={{ fill: "#171b15", stroke: "none" }} d="m 0,0 h 5.884 l -0.377,-55.106 1.358,-2.64 12.069,-8.826 -11.579,5.695 -1.433,-0.641 -1.962,-11.24 -2.527,10.938 -0.98,0.679 -11.655,-4.639 11.428,7.242 1.962,4.073 -1.019,31.872 -2.942,7.015 2.15,1.924 z" />
      </g>

      {/* Pata izquierda frontal */}
      <g transform="translate(347.5402,87.5322)">
        <path style={{ fill: "#171b15", stroke: "none" }} d="m 0,0 h -5.884 l 0.377,-55.106 -1.358,-2.64 -12.069,-8.826 11.579,5.695 1.433,-0.641 1.962,-11.24 2.527,10.938 0.98,0.679 11.655,-4.639 -11.428,7.242 -1.962,4.073 1.019,31.872 2.942,7.015 -2.15,1.924 z" />
      </g>

      {/* Cuerpo y cabeza frontales */}
      <g clipPath="url(#clip-par-front)">
        {/* Cuerpo frontal */}
        <g transform="translate(366.0118,163.8671)">
          <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 h -9.587 l -20.392,-12.967 -4.212,-9.531 -1.607,-13.3 3.381,-16.402 5.597,-7.537 -1.33,-3.103 0.055,-2.826 3.861,-10.915 h 5.781 l 2.272,2.326 7.148,-10.03 -0.886,-13.244 5.486,5.431 4.433,-4.711 4.433,4.711 5.486,-5.431 -0.886,13.244 7.148,10.03 2.272,-2.326 h 5.781 l 3.861,10.915 0.055,2.826 -1.33,3.103 5.597,7.537 3.381,16.402 -1.607,13.3 -4.212,9.531 L 9.587,0 Z" />
        </g>
        {/* Cuello / cabeza frontal */}
        <g transform="translate(366.0118,217.3551)">
          <path style={{ fill: "#31271d", stroke: "none" }} d="m 0,0 h -3.913 l -5.538,-3.557 -0.559,-7.774 0.838,-1.372 -1.346,-2.236 2.693,-8.842 -1.982,-30.132 9.807,-9.655 9.807,9.655 -1.982,30.132 2.693,8.842 -1.346,2.236 0.838,1.372 L 9.451,-3.557 3.913,0 Z" />
        </g>
      </g>

      {/* Cuello exterior (plumas) */}
      <g transform="translate(366.0118,143.9211)">
        <path style={{ fill: "#76424d", stroke: "none" }} d="m 0,0 3.62,41.513 3.055,11.348 v 2.208 l 0.642,1.283 -0.077,0.565 1.746,1.541 V 59.69 L 8.755,60.306 6.88,58.252 5.109,58.227 1.13,56.84 0,56.815 -1.13,56.84 -5.109,58.227 -6.88,58.252 -8.755,60.306 -8.986,59.69 v -1.232 l 1.746,-1.541 -0.077,-0.565 0.642,-1.283 V 52.861 L -3.62,41.513 Z" />
      </g>

      {/* Ojos frontales */}
      <g transform="translate(360.4945,197.7254)">
        <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 0.22,-2.547 1.971,-3.29 -0.673,2.703 z" />
      </g>
      <g transform="translate(371.5291,197.7254)">
        <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 -0.22,-2.547 -1.971,-3.29 0.673,2.703 z" />
      </g>

      {/* Picos / narinas frontales */}
      <g transform="translate(356.2951,205.5653)">
        <path style={{ fill: "#963138", stroke: "none" }} d="M 0,0 H 0.76 L 1.24,-0.36 1.08,-2.3 0.52,-2.4 l -0.62,1 z" />
      </g>
      <g transform="translate(356.6952,204.9048)">
        <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 -0.08,-0.84 h 0.26 l 0.18,0.2 V 0 Z" />
      </g>
      <g transform="translate(375.7285,205.5653)">
        <path style={{ fill: "#963138", stroke: "none" }} d="m 0,0 h -0.76 l -0.48,-0.36 0.16,-1.94 0.56,-0.1 0.62,1 z" />
      </g>
      <g transform="translate(374.9688,204.9048)">
        <path style={{ fill: "#03161b", stroke: "none" }} d="m 0,0 v -0.64 l 0.18,-0.2 H 0.44 L 0.36,0 Z" />
      </g>

    </g>
  </svg>
);


