/* Prepara as imagens dos artigos: corta, reduz e salva em WebP (leve para o celular e para o Google).
   Uso: PUPPETEER=<caminho do puppeteer-core.js> node _blog/preparar-imagens.mjs lista.json
   lista.json = [{ "de": "foto.jpg", "para": "blog/img/<slug>/capa.webp",
                   "recorte": [x, y, largura, altura]   ← opcional, em pixels da imagem original
                   "proporcao": 1.7778, "foco": 0.4,     ← opcional: corta no formato pedido (16:9), foco vertical 0–1
                   "largura": 1600, "qualidade": 0.82 }]
   As telas do sistema podem vir dos vídeos (telas reais com dados inventados). Nunca usar tela com marca ou dado de cliente. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const PUP = process.env.PUPPETEER;
if (!PUP || !process.argv[2]) { console.error("uso: PUPPETEER=<puppeteer-core.js> node _blog/preparar-imagens.mjs lista.json"); process.exit(1); }
const NAV = process.env.NAVEGADOR || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const { default: puppeteer } = await import(pathToFileURL(PUP).href);
const lista = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const base = path.dirname(path.resolve(process.argv[2]));

const nav = await puppeteer.launch({ executablePath: NAV, headless: true });
const p = await nav.newPage();
for (const t of lista) {
  const de = path.resolve(base, t.de);
  const tipo = /\.png$/i.test(de) ? "image/png" : /\.webp$/i.test(de) ? "image/webp" : "image/jpeg";
  const src = `data:${tipo};base64,` + fs.readFileSync(de).toString("base64");
  const r = await p.evaluate(async ({ src, t }) => {
    const img = new Image(); img.src = src; await img.decode();
    let [x, y, w, h] = t.recorte || [0, 0, img.naturalWidth, img.naturalHeight];
    if (t.proporcao) {
      if (w / h > t.proporcao) { const nw = Math.round(h * t.proporcao); x += Math.round((w - nw) / 2); w = nw; }
      else { const nh = Math.round(w / t.proporcao); y += Math.round((h - nh) * (t.foco ?? 0.5)); h = nh; }
    }
    const larg = Math.min(t.largura || 1600, w), alt = Math.round(h * larg / w);
    // reduz em etapas de no máximo metade, para o texto das telas não serrilhar
    let fonte = img, sx = x, sy = y, sw = w, sh = h;
    while (sw / 2 > larg) {
      const c = document.createElement("canvas"); c.width = Math.round(sw / 2); c.height = Math.round(sh / 2);
      const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(fonte, sx, sy, sw, sh, 0, 0, c.width, c.height);
      fonte = c; sx = 0; sy = 0; sw = c.width; sh = c.height;
    }
    const c = document.createElement("canvas"); c.width = larg; c.height = alt;
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(fonte, sx, sy, sw, sh, 0, 0, larg, alt);
    return { url: c.toDataURL("image/webp", t.qualidade || 0.82), larg, alt };
  }, { src, t });
  const para = path.resolve(base, t.para);
  fs.mkdirSync(path.dirname(para), { recursive: true });
  fs.writeFileSync(para, Buffer.from(r.url.split(",")[1], "base64"));
  console.log(`${t.para}  ${r.larg}×${r.alt}  ${Math.round(fs.statSync(para).size / 1024)} KB`);
}
await nav.close();
