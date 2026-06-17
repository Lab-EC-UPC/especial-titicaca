// Convierte a WebP los PNG pesados (personajes, fondos, fauna) conservando
// dimensiones y transparencia. Ejecutar: node scripts/optimize-images.mjs
import sharp from "sharp";
import { stat } from "node:fs/promises";
import path from "node:path";

const QUALITY = 80;

const FILES = [
  // Capachica · testimonios
  "src/features/05-Capachica/assets/testimonials/images/testimonials-background.png",
  "src/features/05-Capachica/assets/testimonials/images/testimonials-background-mobile.png",
  "src/features/05-Capachica/assets/testimonials/images/capachica-landscape-background.png",
  "src/features/05-Capachica/assets/testimonials/images/capachica-landscape-background-mobile.png",
  "src/features/05-Capachica/assets/testimonials/images/feliciana-character.png",
  "src/features/05-Capachica/assets/testimonials/images/juliana-character.png",
  "src/features/05-Capachica/assets/testimonials/images/victor-character.png",
  "src/features/05-Capachica/assets/testimonials/images/juliana-seated.png",
  "src/features/05-Capachica/assets/testimonials/images/feliciana-seated.png",
  "src/features/05-Capachica/assets/testimonials/images/victor-stand.png",
  // FloraFauna
  "src/features/04-FloraFauna/assets/BOGA.png",
  "src/features/04-FloraFauna/assets/Orestia-cuvieri.png",
  "src/features/04-FloraFauna/assets/SUCHE.png",
  "src/features/04-FloraFauna/assets/Muestra1.png",
  "src/features/04-FloraFauna/assets/Muestra2.png",
  "src/features/04-FloraFauna/assets/Muestra3.png",
];

let before = 0;
let after = 0;

for (const rel of FILES) {
  const out = rel.replace(/\.png$/i, ".webp");
  try {
    const s1 = (await stat(rel)).size;
    await sharp(rel).webp({ quality: QUALITY, alphaQuality: 90 }).toFile(out);
    const s2 = (await stat(out)).size;
    before += s1;
    after += s2;
    const pct = (100 * (1 - s2 / s1)).toFixed(0);
    console.log(
      `${(s1 / 1024).toFixed(0).padStart(6)}KB → ${(s2 / 1024)
        .toFixed(0)
        .padStart(5)}KB  (-${pct}%)  ${path.basename(out)}`,
    );
  } catch (err) {
    console.error(`✗ ${rel}: ${err.message}`);
  }
}

console.log(
  `\nTOTAL  ${(before / 1048576).toFixed(2)}MB → ${(after / 1048576).toFixed(
    2,
  )}MB  (-${(100 * (1 - after / before)).toFixed(0)}%)`,
);
