// Optimiza la portada larga (assets/Portada.png) al estilo "documental":
// la reduce a un ancho razonable, la parte en bandas WebP y genera un
// placeholder borroso (base64) por banda. Salida:
//   - src/features/01-Header/assets/cover/band-XX.webp
//   - src/features/01-Header/cover-data.ts  (importa las bandas + placeholders)
//
// Uso:  npm run optimize:cover
import sharp from "sharp";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const HEADER = path.join(root, "src/features/01-Header");
const SRC = path.join(HEADER, "assets/Portada.png");
const OUT_DIR = path.join(HEADER, "assets/cover");
const DATA_FILE = path.join(HEADER, "cover-data.ts");

// Ancho de salida (sube esto si la quieres más nítida; pesará más).
const TARGET_WIDTH = 2048;
// En cuántas bandas se parte la tira (más bandas = carga más granular).
const BAND_COUNT = 8;
const QUALITY = 80;

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  // 1) Reduce la imagen a TARGET_WIDTH una sola vez (PNG en memoria, sin límite
  //    de tamaño de WebP) y trabajamos los recortes sobre ese buffer.
  const resized = await sharp(SRC)
    .resize({ width: TARGET_WIDTH })
    .png()
    .toBuffer({ resolveWithObject: true });

  const width = resized.info.width;
  const height = resized.info.height;
  const bandHeight = Math.ceil(height / BAND_COUNT);

  const entries = [];

  for (let i = 0; i < BAND_COUNT; i++) {
    const top = i * bandHeight;
    if (top >= height) break;
    const h = Math.min(bandHeight, height - top);
    const region = { left: 0, top, width, height: h };
    const fileName = `band-${String(i).padStart(2, "0")}.webp`;

    // Banda nítida.
    await sharp(resized.data)
      .extract(region)
      .webp({ quality: QUALITY })
      .toFile(path.join(OUT_DIR, fileName));

    // Placeholder diminuto y borroso (se incrusta como base64 en el TS).
    const lqip = await sharp(resized.data)
      .extract(region)
      .resize({ width: 24 })
      .webp({ quality: 35 })
      .toBuffer();

    entries.push({
      fileName,
      width,
      height: h,
      placeholder: `data:image/webp;base64,${lqip.toString("base64")}`,
    });
  }

  // 2) Genera el módulo TS que importa las bandas (Vite les pone URL con hash)
  //    y expone los placeholders.
  const imports = entries
    .map((e, i) => `import band${i} from "./assets/cover/${e.fileName}";`)
    .join("\n");

  const rows = entries
    .map(
      (e, i) =>
        `  { src: band${i}, width: ${e.width}, height: ${e.height}, placeholder: "${e.placeholder}" },`,
    )
    .join("\n");

  const ts = `// Generado por scripts/optimize-cover.mjs — no editar a mano.
${imports}

export type CoverBand = {
  src: string;
  width: number;
  height: number;
  placeholder: string;
};

export const COVER_BANDS: CoverBand[] = [
${rows}
];
`;

  await writeFile(DATA_FILE, ts, "utf8");

  // Reporte de pesos.
  let totalBytes = 0;
  for (const e of entries) {
    const { size } = await stat(path.join(OUT_DIR, e.fileName));
    totalBytes += size;
  }
  const srcSize = (await stat(SRC)).size;
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`Origen:  ${kb(srcSize)} (PNG ${TARGET_WIDTH < width ? "" : ""}7680px)`);
  console.log(`Salida:  ${entries.length} bandas WebP, ${kb(totalBytes)} en total (${width}px ancho)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
