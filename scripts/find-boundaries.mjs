import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1280,height:800}, reducedMotion:"reduce" });
const page = await ctx.newPage();
await page.goto("http://localhost:5174/", { waitUntil:"load" });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const ids = ["inicio","juliaca","mapatiti","cuencas","florafauna","capachica","denuncias","footer","proyectos-lupa","imas","proyeccion"];
  const out = {};
  for (const id of ids){ const el=document.getElementById(id); if(el){const r=el.getBoundingClientRect(); out[id]={top:Math.round(r.top+window.scrollY), h:Math.round(r.height)};}}
  return out;
});
console.log(JSON.stringify(info,null,1));
await browser.close();
