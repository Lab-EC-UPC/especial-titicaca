import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const OUT="D:/Comercio/especial-titicaca/.tmp-frames-dyn"; mkdirSync(OUT,{recursive:true});
const browser=await chromium.launch();
const ctx=await browser.newContext({viewport:{width:1280,height:800}}); // SIN reduced motion → Lenis activo
const page=await ctx.newPage();
await page.goto("http://localhost:5174/",{waitUntil:"load"});
await page.waitForTimeout(2500);
await page.mouse.move(640,400);
const series=[];
let i=0, prev=100;
for(let s=0;s<170;s++){
  await page.mouse.wheel(0,650);          // scrub rápido continuo
  await page.waitForTimeout(45);
  const buf=await page.screenshot();
  const st=await sharp(buf).greyscale().stats();
  const mean=Math.round(st.channels[0].mean);
  const y=await page.evaluate(()=>Math.round(window.scrollY));
  // Guarda si es muy oscuro o si cae bruscamente respecto al frame anterior (flash).
  if(mean<14 || prev-mean>28){ await sharp(buf).toFile(`${OUT}/d_${String(i).padStart(4,"0")}_y${y}_b${mean}.png`); }
  series.push(`${y}:${mean}`); prev=mean; i++;
}
console.log("SERIES y:mean →"); console.log(series.join("  "));
await browser.close();
