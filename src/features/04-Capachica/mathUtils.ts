// linear interpolation
export const lerp = (
  a: number,
  b: number,
  t: number
): number => a + (b - a) * t;

// keeps value inside range
export const clamp = (
  v: number,
  lo: number,
  hi: number
): number => Math.max(lo, Math.min(hi, v));

// normalizes value between 0 and 1
export const norm = (
  v: number,
  lo: number,
  hi: number
): number => clamp((v - lo) / (hi - lo), 0, 1);

// interpolates between two colors
export function lerpColor(
  hex1: string,
  hex2: string,
  t: number
): string {
  // converts hex to rgb
  const p = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];

  const [r1, g1, b1] = p(hex1);
  const [r2, g2, b2] = p(hex2);

  return `rgb(${Math.round(
    lerp(r1, r2, t)
  )},${Math.round(
    lerp(g1, g2, t)
  )},${Math.round(lerp(b1, b2, t))})`;
}