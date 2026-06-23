import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "D:/Comercio/especial-titicaca/.tmp-frames";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce", // desactiva Lenis → scroll nativo determinista
    deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:5174/", { waitUntil: "load" });
await page.waitForTimeout(2500);

const total = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
);
console.log("scrollable px:", total);

const STEP = 350;
let i = 0;
const rows = [];
for (let y = 0; y <= total; y += STEP) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(220);
    const buf = await page.screenshot();
    // Brillo medio (0-255) de todo el frame.
    const stats = await sharp(buf).greyscale().stats();
    const mean = Math.round(stats.channels[0].mean);
    const name = `f_${String(i).padStart(4, "0")}_y${y}_b${mean}.png`;
    // Guardar solo frames oscuros + algunos de referencia, para no llenar disco.
    if (mean < 35 || i % 6 === 0) await sharp(buf).toFile(`${OUT}/${name}`);
    rows.push({ i, y, mean });
    i++;
}

// Reporte: secuencia de brillo y rachas oscuras.
console.log("BRIGHTNESS SERIES (i:y:mean):");
console.log(rows.map((r) => `${r.i}:${r.y}:${r.mean}`).join("  "));
const darkRuns = [];
let run = null;
for (const r of rows) {
    if (r.mean < 35) {
        if (!run) run = { from: r.y, to: r.y, min: r.mean };
        else {
            run.to = r.y;
            run.min = Math.min(run.min, r.mean);
        }
    } else if (run) {
        darkRuns.push(run);
        run = null;
    }
}
if (run) darkRuns.push(run);
console.log("\nDARK RUNS (mean<35):", JSON.stringify(darkRuns));
await browser.close();
