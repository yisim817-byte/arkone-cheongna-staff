import { chromium } from "playwright";
const out = process.argv[2];
const sites = [
  ["staffA", "https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/"],
  ["staffB", "https://www.xn--oi2b90bo0vusdbte57o.site/"],
  ["staffC", "https://xn--2w2b25ugxct7o.site/"],
  ["cheongnaPrugio", "https://www.xn--oi2bj1bo0vusd6seb8o.site/"],
  ["cheongnaArkone", "https://www.xn--oi2bj1bg5twzasy72kx8fj1ipxj.site/"],
  ["arkonePrugio", "https://www.xn--2w2b19sita0u67iz2mi7g.site/"],
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const [name, url] of sites) {
  for (const [vw, vh, tag] of [[1440, 900, "pc"], [390, 844, "mo"]]) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
    page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 120)); });
    try { await page.goto(url, { waitUntil: "load", timeout: 60000 }); } catch (e) { console.log(name, tag, "LOAD FAIL", e.message.slice(0, 80)); await ctx.close(); continue; }
    const seen = [];
    for (const t of [3, 6, 10, 14]) {
      await page.waitForTimeout(t === 3 ? 3000 : (t === 6 ? 3000 : 4000));
      const d = await page.evaluate(() => {
        const els = [...document.querySelectorAll('[role=dialog], [aria-modal=true], .prereg-popup, .prereg-modal, #prereg-popup, .popup, .layer-popup')];
        const vis = els.filter((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0.05; });
        return { n: els.length, vis: vis.length, intro: document.documentElement.getAttribute("data-om-intro") };
      });
      seen.push(`${t}s:${d.vis}/${d.n}${d.intro ? "(intro)" : ""}`);
    }
    await page.screenshot({ path: `${out}/live-${name}-${tag}.png` });
    console.log(name, tag, seen.join(" "), errs.length ? "ERR " + [...new Set(errs)].slice(0, 3).join(" | ") : "");
    await ctx.close();
  }
}
await browser.close();
