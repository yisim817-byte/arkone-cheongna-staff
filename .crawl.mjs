import { chromium } from "playwright";
const sites = { 직원A:"http://localhost:8080", 직원B:"http://localhost:8081", 아크원푸르지오:"http://localhost:8093", 청라아크원:"http://localhost:8091", 청라푸르지오:"http://localhost:8092" };
const KW = /공식\s?홈페이지|공식홈|arkone-prugio\.com|사업주체\s?(?:분양\s?)?홈페이지|사업주체 공개자료|공식 사이트|공식 분양/;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const out = {};
for (const [name, base] of Object.entries(sites)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("prereg_hide_until", String(Date.now()+9e7)); localStorage.setItem("prereg_popup_until_v8", String(Date.now()+9e7)); localStorage.setItem("arkone-staff-apt-event-day", new Date().toISOString().slice(0,10)); } catch {} });
  const p = await ctx.newPage();
  const seen = new Set(), queue = ["/"], links = new Map(), texts = new Map();
  while (queue.length && seen.size < 40) {
    const path = queue.shift(); if (seen.has(path)) continue; seen.add(path);
    try { await p.goto(base + path, { waitUntil: "load", timeout: 30000 }); await p.waitForTimeout(1200); } catch { continue; }
    const r = await p.evaluate((kw) => {
      const re = new RegExp(kw);
      const as = [...document.querySelectorAll("a[href]")].map(a => ({ href: a.href, text: (a.innerText||a.getAttribute("aria-label")||"").trim().slice(0,60) }));
      const tx = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const s = w.currentNode.textContent.trim(); const el = w.currentNode.parentElement; if (s && re.test(s) && el && !el.closest("script,style")) tx.push(s.slice(0,160)); }
      const metas = [...document.querySelectorAll('meta[name="description"],meta[property="og:description"],title')].map(m => m.content || m.textContent).filter(s => re.test(s||"")).map(s=>"[meta] "+s.slice(0,120));
      return { as, tx: tx.concat(metas) };
    }, KW.source);
    for (const a of r.as) {
      const u = new URL(a.href, base);
      if (u.origin === new URL(base).origin) { const pth = u.pathname; if (!seen.has(pth) && !/\.(pdf|jpg|png|webp|mp4|xml|txt)$/.test(pth) && !pth.startsWith("/admin") && !pth.startsWith("/login")) queue.push(pth); }
      else if (/arkone-prugio\.com|prugio\.com/.test(u.hostname)) { const k = a.href + " | " + a.text; links.set(k, (links.get(k)||new Set()).add(path)); }
    }
    for (const t of r.tx) texts.set(t, (texts.get(t)||new Set()).add(path));
  }
  console.log(`\n===== ${name} (${seen.size} pages)`);
  console.log("-- 공식사이트 링크:");
  for (const [k, ps] of links) console.log("  ", k, " @", [...ps].slice(0,4).join(","), ps.size>4?`(+${ps.size-4})`:"");
  console.log("-- 공식사이트 언급 문구:");
  for (const [k, ps] of texts) console.log("  ", k, " @", [...ps].slice(0,3).join(","), ps.size>3?`(+${ps.size-3})`:"");
  await ctx.close();
}
await b.close();
