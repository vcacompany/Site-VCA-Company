/* Gera as imagens do site e do blog com o Edge (ou Chrome) sem janela:
     imagens/logo-vca.webp e .png → o logo oficial em 245×84 (o PNG original tem 1042×357 e 160 KB)
     imagens/og-vca.png           → imagem de compartilhamento do site (1200×630)
     blog/og/<slug>.png           → imagem de compartilhamento de cada artigo (1200×630)
   Uso: node _blog/imagens.mjs   (depois rode node _blog/gerar.mjs para as páginas usarem as capas)
   Precisa do puppeteer-core: PUPPETEER=<caminho do puppeteer-core.js> e, se quiser, NAVEGADOR=<caminho do Edge/Chrome>. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUP = process.env.PUPPETEER;
if (!PUP) { console.error("defina PUPPETEER com o caminho do puppeteer-core.js"); process.exit(1); }
const NAV = process.env.NAVEGADOR || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const { default: puppeteer } = await import(pathToFileURL(PUP).href);

const logo64 = "data:image/png;base64," + fs.readFileSync(path.join(RAIZ, "Logo VCA oficial.png")).toString("base64");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const nav = await puppeteer.launch({ executablePath: NAV, headless: true });
const p = await nav.newPage();

/* 1) logo leve: reduz em duas etapas para não serrilhar */
const logo = await p.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const passo = (orig, w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(orig, 0, 0, w, h); return c; };
  const meio = passo(img, 521, 179), fim = passo(meio, 245, 84);
  return { webp: fim.toDataURL("image/webp", 0.92), png: fim.toDataURL("image/png") };
}, logo64);
fs.writeFileSync(path.join(RAIZ, "imagens/logo-vca.webp"), Buffer.from(logo.webp.split(",")[1], "base64"));
fs.writeFileSync(path.join(RAIZ, "imagens/logo-vca.png"), Buffer.from(logo.png.split(",")[1], "base64"));

/* 2) imagens de compartilhamento 1200×630 */
await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
const quadro = ({ etiqueta, titulo, sub, rodape }) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Plus+Jakarta+Sans:wght@400;600;700&display=block">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;background:#0A0D13;color:#F4F6F9;font-family:"Plus Jakarta Sans",sans-serif;position:relative}
  .brilho{position:absolute;inset:0;background:radial-gradient(900px 520px at 88% 112%,rgba(202,158,53,.30),transparent 60%),radial-gradient(700px 420px at -5% -20%,rgba(232,211,163,.10),transparent 60%)}
  .grade{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px;mask-image:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent)}
  .caixa{position:absolute;inset:64px 72px;display:flex;flex-direction:column}
  .logo{height:46px;width:auto;align-self:flex-start}
  .etq{margin-top:auto;color:#D8B86B;font-weight:700;font-size:18px;letter-spacing:.32em;text-transform:uppercase}
  h1{font-family:"Space Grotesk",sans-serif;font-weight:500;letter-spacing:-.02em;line-height:1.1;margin-top:18px;font-size:${titulo.length > 70 ? 50 : titulo.length > 48 ? 58 : 66}px;max-width:1000px}
  .sub{margin-top:18px;color:#9AA4B2;font-size:24px;line-height:1.4;max-width:900px}
  .pe{margin-top:34px;display:flex;align-items:center;gap:14px;color:#9AA4B2;font-size:20px;font-weight:600}
  .pe i{width:36px;height:2px;background:linear-gradient(90deg,#CA9E35,#E8D3A3)}
</style></head><body><div class="brilho"></div><div class="grade"></div>
<div class="caixa"><img class="logo" src="${logo64}" alt="">
<p class="etq">${esc(etiqueta)}</p><h1>${esc(titulo)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
<p class="pe"><i></i>${esc(rodape)}</p></div></body></html>`;
const foto = async (html, destino) => {
  await p.setContent(html, { waitUntil: "load", timeout: 60000 });
  await p.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 8000))]));
  const ok = await p.evaluate(() => document.fonts.check('500 40px "Space Grotesk"'));
  if (!ok) console.warn("aviso: a fonte Space Grotesk não carregou em " + destino);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  await p.screenshot({ path: destino, type: "png" });
};
await foto(quadro({ etiqueta: "VCA Company", titulo: "Sistemas, automação e CRM com IA para empresas", sub: "Atendimento, vendas e gestão no automático, para qualquer nicho.", rodape: "vcacompany.com · Caraguatatuba e todo o Brasil" }), path.join(RAIZ, "imagens/og-vca.png"));

for (const f of fs.readdirSync(path.join(RAIZ, "_blog/posts")).filter((f) => f.endsWith(".md"))) {
  const cab = fs.readFileSync(path.join(RAIZ, "_blog/posts", f), "utf8").replace(/\r\n/g, "\n").split("\n---\n")[0];
  const m = {}; for (const l of cab.split("\n")) { const i = l.indexOf(":"); if (i > 0) m[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"(.*)"$/, "$1"); }
  await foto(quadro({ etiqueta: "Blog · " + m.categoria, titulo: m.titulo, rodape: "vcacompany.com/blog" }), path.join(RAIZ, "blog/og", m.slug + ".png"));
  console.log("capa:", m.slug);
}
await nav.close();
console.log("ok — logo-vca.webp/png, og-vca.png e capas do blog");
