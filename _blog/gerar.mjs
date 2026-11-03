/* Gerador do blog da VCA Company — sem dependências (só Node).
   Lê os artigos de _blog/posts/*.md e escreve páginas estáticas, que o Google lê sem precisar rodar JavaScript:
     blog/<slug>.html   → www.vcacompany.com/blog/<slug>   (cleanUrls no vercel.json tira o .html)
     blog/index.html    → www.vcacompany.com/blog
     blog/feed.xml      → RSS
     404.html, sitemap.xml e llms.txt na raiz
     index.html         → os 3 artigos mais novos entre <!-- BLOG:INICIO --> e <!-- BLOG:FIM -->
   Uso: node _blog/gerar.mjs   (rodar na raiz do repositório ou em qualquer pasta; os caminhos saem deste arquivo) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NICHOS } from "./nichos.mjs";
import { REVENDA } from "./revenda.mjs";
import { TERMOS, PRIVACIDADE, EMAIL_CONTATO } from "./legais.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.vcacompany.com";
const OG_PADRAO = "/imagens/og-vca.png";
const RASTREIO = '<script defer src="https://dashboard.vcacompany.com/p.js" data-site="s_5c30880f08d74c9bb3b6"></script>';
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const semAcento = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugify = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const dataBR = (iso) => { const [a, m, d] = iso.split("-").map(Number); return d + " de " + MESES[m - 1] + " de " + a; };
const jsonLd = (o) => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, "\\u003c") + "</script>";
const escreve = (rel, txt) => { const f = path.join(RAIZ, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt, "utf8"); };

/* ---------- leitura dos artigos ---------- */
function lerPost(arq) {
  const bruto = fs.readFileSync(arq, "utf8").replace(/\r\n/g, "\n");
  const m = bruto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("sem cabeçalho --- em " + arq);
  const meta = {};
  for (const linha of m[1].split("\n")) {
    const i = linha.indexOf(":"); if (i < 0) continue;
    meta[linha.slice(0, i).trim()] = linha.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  for (const k of ["slug", "titulo", "descricao", "data", "categoria"]) if (!meta[k]) throw new Error(`falta "${k}" em ${arq}`);
  meta.titulo_seo = meta.titulo_seo || meta.titulo;
  meta.atualizado = meta.atualizado || meta.data;
  meta.resumo = meta.resumo || meta.descricao;
  if (meta.capa && !tamanhoImg(meta.capa)) throw new Error(`capa não encontrada (${meta.capa}) em ${arq}`);
  if (meta.nicho && !NICHOS.some((n) => n.slug === meta.nicho)) throw new Error(`nicho "${meta.nicho}" não existe em _blog/nichos.mjs (${arq})`);
  const corpo = mdParaHtml(m[2], meta);
  const palavras = m[2].replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/[#>*\-\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return { ...meta, ...corpo, palavras, minutos: Math.max(2, Math.round(palavras / 200)) };
}

/* ---------- imagens ----------
   Largura e altura saem do próprio arquivo (WebP, PNG ou JPEG): com elas no <img>, a página não pula enquanto carrega. */
function tamanhoImg(src) {
  const f = path.join(RAIZ, decodeURI(src).replace(/^\//, ""));
  if (!fs.existsSync(f)) return null;
  const b = fs.readFileSync(f);
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const tipo = b.toString("ascii", 12, 16);
    if (tipo === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (tipo === "VP8L") { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
    if (tipo === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i < b.length - 9;) {
      if (b[i] !== 0xff) { i++; continue; }
      const mk = b[i + 1];
      if (mk >= 0xc0 && mk <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(mk)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}
function figura(src, alt, legenda, { classe = "post-fig", prioridade = false } = {}) {
  const t = tamanhoImg(src);
  if (!t) throw new Error("imagem não encontrada: " + src);
  const img = `<img src="${esc(src)}" alt="${esc(alt)}" width="${t.w}" height="${t.h}"${prioridade ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  return `<figure class="${classe}"><a href="${esc(src)}" target="_blank" rel="noopener" aria-label="Abrir a imagem em tamanho maior">${img}</a>${legenda ? `<figcaption>${legenda}</figcaption>` : ""}</figure>`;
}

/* ---------- Markdown simples → HTML ----------
   ## título · ### subtítulo · - lista · 1. lista numerada · > citação · **negrito** · *itálico* · [texto](link) · `código`
   ![texto alternativo](/blog/img/<slug>/arquivo.webp "legenda") numa linha sozinha = imagem com legenda
   [[cta]] = caixa do diagnóstico gratuito. "## Perguntas frequentes" + "### pergunta" vira também o FAQPage do Google. */
function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => /^https?:/.test(u) && !u.startsWith(SITE) ? `<a href="${u}" target="_blank" rel="noopener">${t}</a>` : `<a href="${u}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
const textoPuro = (s) => s.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/(^|[^*])\*([^*]+)\*/g, "$1$2");

function mdParaHtml(md, meta) {
  const out = [], toc = [], faq = [];
  let par = [], lista = null, emFaq = false, pergunta = null;
  const fechaPar = () => {
    if (!par.length) return;
    const t = par.join(" ");
    out.push("<p>" + inline(t) + "</p>");
    if (emFaq && pergunta) pergunta.resposta.push(textoPuro(t));
    par = [];
  };
  const fechaLista = () => { if (lista) { out.push(`<${lista.tag}>` + lista.itens.map((i) => "<li>" + inline(i) + "</li>").join("") + `</${lista.tag}>`); if (emFaq && pergunta) pergunta.resposta.push(lista.itens.map(textoPuro).join("; ")); lista = null; } };
  const fechaTudo = () => { fechaPar(); fechaLista(); };
  for (const linha of md.split("\n")) {
    const l = linha.trimEnd();
    if (!l.trim()) { fechaTudo(); continue; }
    let r;
    if ((r = l.match(/^## (.+)/))) {
      fechaTudo();
      const id = slugify(r[1]); emFaq = /^perguntas frequentes/i.test(r[1]); pergunta = null;
      toc.push({ id, texto: r[1] });
      out.push(`<h2 id="${id}">${inline(r[1])}</h2>`);
    } else if ((r = l.match(/^### (.+)/))) {
      fechaTudo();
      out.push(`<h3 id="${slugify(r[1])}">${inline(r[1])}</h3>`);
      if (emFaq) { pergunta = { pergunta: textoPuro(r[1]), resposta: [] }; faq.push(pergunta); }
    } else if ((r = l.match(/^[-*] (.+)/)) || (r = l.match(/^\d+\. (.+)/))) {
      fechaPar();
      const tag = /^\d/.test(l) ? "ol" : "ul";
      if (lista && lista.tag !== tag) fechaLista();
      if (!lista) lista = { tag, itens: [] };
      lista.itens.push(r[1]);
    } else if ((r = l.match(/^> (.+)/))) {
      fechaTudo(); out.push("<blockquote><p>" + inline(r[1]) + "</p></blockquote>");
    } else if (l.trim() === "[[cta]]") {
      fechaTudo(); out.push(caixaCta(false, meta.nicho));
    } else if ((r = l.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/))) {
      fechaTudo(); out.push(figura(r[2], r[1], r[3] ? inline(r[3]) : ""));
      (meta.imagens = meta.imagens || []).push(r[2]);
    } else if (lista && /^\s+\S/.test(linha)) {
      lista.itens[lista.itens.length - 1] += " " + l.trim();
    } else { fechaLista(); par.push(l.trim()); }
  }
  fechaTudo();
  return { html: out.join("\n"), toc: toc.filter((t) => !/^perguntas frequentes/i.test(t.texto)).concat(toc.filter((t) => /^perguntas frequentes/i.test(t.texto))), faq: faq.filter((f) => f.resposta.length) };
}

/* ---------- pedaços comuns ---------- */
const ICONE = {
  sol: '<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
  lua: '<svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16"></path><path d="M4 6h16"></path><path d="M4 18h16"></path></svg>',
  fechar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
  fone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  pino: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  conversa: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>',
  insta: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>',
};

function cabecaComum({ titulo, descricao, url, imagem, tipo = "website", extra = "" }) {
  const img = SITE + imagem;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    ${RASTREIO}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="theme-color" content="#F6F7F9">
    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/svg+xml" href="/Camada%202.svg">
    <link rel="alternate" type="application/rss+xml" title="Blog da VCA Company" href="${SITE}/blog/feed.xml">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="VCA Company">
    <meta property="og:type" content="${tipo}">
    <meta property="og:title" content="${esc(titulo)}">
    <meta property="og:description" content="${esc(descricao)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${img}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(titulo)}">
    <meta name="twitter:description" content="${esc(descricao)}">
    <meta name="twitter:image" content="${img}">
${extra}
    <script>/* modo claro é o padrão; só fica escuro quem escolheu escuro no botão */(function(){var t=null;try{t=localStorage.getItem('vca-theme');}catch(e){}if(t!=='dark'){document.documentElement.setAttribute('data-theme','light');}})();</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap">
    <link rel="stylesheet" href="/style.css">
</head>`;
}

function topo(ativo, nicho) {
  const links = [["/solucoes", "Soluções"], ["/#metodo", "Método"], ["/#depoimentos", "Depoimentos"], ["/blog", "Blog"], ["/#agendar", "Agendar"], ["/#faq", "Dúvidas"]];
  const lk = (cls) => links.map(([h, t]) => `<a href="${h}" class="${cls}${t === ativo ? " is-active" : ""}"${t === ativo ? ' aria-current="page"' : ""}>${t}</a>`).join("\n                ");
  // "Seja revendedor" logo depois do Diagnóstico Gratuito (02/11, o João: "quero um seja revendedor depois de diagnóstico gratuito")
  const rev = (estilo) => `<a href="/revendedores" class="btn btn-outline nav-revenda${ativo === "Revenda" ? " is-active" : ""}"${ativo === "Revenda" ? ' aria-current="page"' : ""} style="${estilo}">Seja revendedor</a>`;
  // os pontinhos dourados ligados por linhas do fundo da página inicial, em todas as páginas (só no computador; blog.js desenha)
  return `
    <canvas id="particleCanvas" aria-hidden="true"></canvas>
    <nav class="navbar">
        <div class="container">
            <a href="/" class="logo"><img src="/imagens/logo-vca.webp" alt="VCA Company" width="123" height="42" style="height: 42px; width: auto;"></a>
            <div class="nav-links">
                ${lk("nav-link")}
            </div>
            <div class="nav-actions">
                <a href="${linkDiag(nicho)}" class="btn btn-primary" style="padding: 0.75rem 2rem;" data-cta="diagnostico">Diagnóstico Gratuito</a>
                ${rev("padding: 0.75rem 1.5rem;")}
                <button class="theme-toggle" type="button" aria-label="Alternar modo claro/escuro">${ICONE.sol}${ICONE.lua}</button>
            </div>
            <button class="theme-toggle theme-toggle-mobile" type="button" aria-label="Alternar modo claro/escuro">${ICONE.sol}${ICONE.lua}</button>
            <button class="nav-toggle" id="menuToggle" type="button" aria-label="Abrir o menu">${ICONE.menu}</button>
        </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-header">
            <a href="/" class="logo"><img src="/imagens/logo-vca.webp" alt="VCA Company" width="117" height="40" style="height: 40px; width: auto;"></a>
            <button class="menu-close" id="menuClose" type="button" aria-label="Fechar o menu">${ICONE.fechar}</button>
        </div>
        <div class="mobile-menu-links">
            ${lk("mobile-nav-link")}
            <a href="${linkDiag(nicho)}" class="btn btn-primary" style="width: 100%; margin-top: 2rem;" data-cta="diagnostico">Diagnóstico Gratuito</a>
            ${rev("width: 100%; margin-top: 0.75rem; justify-content: center;")}
        </div>
    </div>`;
}

function rodape() {
  return `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <img src="/imagens/logo-vca.webp" alt="VCA Company" class="footer-logo" width="123" height="42" loading="lazy">
                    <p class="footer-slogan">Sistemas, automação e CRM com inteligência artificial que colocam o atendimento e as vendas da sua empresa no automático.</p>
                    <div class="footer-social">
                        <a href="https://www.instagram.com/vcacompany_/" aria-label="Instagram" target="_blank" rel="noopener">${ICONE.insta}</a>
                        <a href="https://wa.me/5512974030135?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20VCA%20e%20quero%20saber%20mais%20sobre%20o%20sistema." aria-label="WhatsApp" target="_blank" rel="noopener">${ICONE.conversa}</a>
                        <a href="mailto:vcacompanyofficial@gmail.com" aria-label="E-mail">${ICONE.email}</a>
                    </div>
                </div>
                <div class="footer-col">
                    <p class="footer-heading">Navegação</p>
                    <a href="/solucoes" class="footer-nav-link">Soluções</a>
                    <a href="/#metodo" class="footer-nav-link">Método VCA</a>
                    <a href="/blog" class="footer-nav-link">Blog</a>
                    <a href="/revendedores" class="footer-nav-link">Seja revendedor</a>
                    <a href="/#agendar" class="footer-nav-link">Agendar</a>
                    <a href="/#faq" class="footer-nav-link">Dúvidas</a>
                </div>
                <div class="footer-col">
                    <p class="footer-heading">Sistemas por nicho</p>
                    ${NICHOS.map((n) => `<a href="/${n.slug}" class="footer-nav-link">${esc(n.nome)}</a>`).join("\n                    ")}
                </div>
                <div class="footer-col footer-contact">
                    <p class="footer-heading">Fale conosco</p>
                    <a href="mailto:vcacompanyofficial@gmail.com" class="footer-contact-line">${ICONE.email} vcacompanyofficial@gmail.com</a>
                    <a href="https://wa.me/5512974030135?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20VCA%20e%20quero%20saber%20mais%20sobre%20o%20sistema." class="footer-contact-line">${ICONE.fone} (12) 97403-0135</a>
                    <span class="footer-contact-line">${ICONE.pino} Caraguatatuba e Litoral Norte de SP</span>
                    <a href="https://wa.me/5512974030135?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20VCA%20e%20quero%20saber%20mais%20sobre%20o%20sistema." class="btn btn-primary footer-cta-btn">Fale com nossos especialistas</a>
                </div>
            </div>
            <div class="footer-base">
                <span class="footer-copyright">© <span id="year">${new Date().getFullYear()}</span> VCA Company. Todos os direitos reservados. <span class="footer-legal">· <a href="/termos">Termos</a> · <a href="/privacidade">Privacidade</a></span></span>
                <span class="footer-cnpj">CNPJ: 65.431.552/0001-08</span>
            </div>
        </div>
    </footer>
    <script src="/blog/blog.js" defer></script>
</body>
</html>
`;
}

/* nicho = slug de uma página de _blog/nichos.mjs: o botão já leva o nicho escolhido para o formulário e a caixa
   aponta também para a página do sistema daquele nicho (o caminho artigo → página de venda → diagnóstico) */
const nichoDe = (slug) => slug ? NICHOS.find((n) => n.slug === slug) : null;
const linkDiag = (n) => n ? `/?nicho=${n.id}#agendar` : "/#agendar";
function caixaCta(final, nichoSlug) {
  const n = nichoDe(nichoSlug);
  return `<aside class="post-cta${final ? " post-cta-final" : ""}">
    <span class="post-cta-tag">Diagnóstico gratuito</span>
    <p class="post-cta-tit">${final ? (n ? `Quer ver o sistema funcionando em ${esc(n.curto)}?` : "Quer ver isso funcionando na sua empresa?") : "Quer saber o que dá para automatizar na sua empresa?"}</p>
    <p>Em 30 minutos, por vídeo, olhamos a sua operação e mostramos onde a automação traz mais resultado. Sem compromisso.</p>
    <div class="post-cta-botoes"><a class="btn btn-primary" href="${linkDiag(n)}" data-cta="diagnostico">Agendar diagnóstico gratuito</a>${n ? `<a class="post-cta-link" href="/${n.slug}">Conhecer o sistema para ${esc(n.curto)} →</a>` : ""}</div>
</aside>`;
}

const ORG = {
  "@type": "Organization", "@id": SITE + "/#organizacao", name: "VCA Company", url: SITE + "/",
  logo: { "@type": "ImageObject", url: SITE + "/imagens/logo-vca.png" },
};
const capaDe = (p) => fs.existsSync(path.join(RAIZ, "blog/og", p.slug + ".png")) ? "/blog/og/" + p.slug + ".png" : OG_PADRAO;

function cartao(p, nivel = "h3") {
  const t = p.capa && tamanhoImg(p.capa);
  return `<article class="blog-card" data-cat="${esc(slugify(p.categoria))}">
    <a class="blog-card-link" href="/blog/${p.slug}">
        ${t ? `<span class="blog-card-img"><img src="${esc(p.capa)}" alt="" width="${t.w}" height="${t.h}" loading="lazy" decoding="async"></span>` : ""}
        <span class="blog-card-cat">${esc(p.categoria)}</span>
        <${nivel} class="blog-card-tit">${esc(p.titulo)}</${nivel}>
        <p class="blog-card-resumo">${esc(p.resumo)}</p>
        <span class="blog-card-meta"><time datetime="${p.data}">${dataBR(p.data)}</time> · ${p.minutos} min de leitura</span>
    </a>
</article>`;
}

/* ---------- página do artigo ---------- */
function paginaPost(p, todos) {
  const url = `${SITE}/blog/${p.slug}`;
  const capa = capaDe(p);
  const ld = [
    jsonLd({
      "@context": "https://schema.org", "@type": "BlogPosting", headline: p.titulo, description: p.descricao,
      image: [...(p.capa ? [p.capa] : []), capa, ...(p.imagens || [])].map((i) => SITE + i), datePublished: p.data + "T09:00:00-03:00", dateModified: p.atualizado + "T09:00:00-03:00",
      author: { "@type": "Organization", name: "Equipe VCA Company", url: SITE + "/" }, publisher: ORG,
      mainEntityOfPage: { "@type": "WebPage", "@id": url }, inLanguage: "pt-BR", articleSection: p.categoria,
      keywords: p.palavra_chave || p.categoria, wordCount: p.palavras,
    }),
    jsonLd({
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog" },
        { "@type": "ListItem", position: 3, name: p.titulo, item: url },
      ],
    }),
  ];
  if (p.faq.length) ld.push(jsonLd({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta.join(" ") } })),
  }));
  const extra = [
    `    <meta property="article:published_time" content="${p.data}T09:00:00-03:00">`,
    `    <meta property="article:modified_time" content="${p.atualizado}T09:00:00-03:00">`,
    `    <meta property="article:section" content="${esc(p.categoria)}">`,
    ...ld.map((x) => "    " + x),
  ].join("\n");
  const perto = (o) => (p.nicho && o.nicho === p.nicho ? 2 : 0) + (o.categoria === p.categoria ? 1 : 0);
  const relacionados = todos.filter((o) => o.slug !== p.slug).sort((a, b) => perto(b) - perto(a) || b.data.localeCompare(a.data)).slice(0, 3);
  return cabecaComum({ titulo: `${p.titulo_seo} | VCA Company`, descricao: p.descricao, url, imagem: capa, tipo: "article", extra }) + `
<body class="blog-page">
${topo("Blog")}
    <main class="blog-main">
        <article class="post">
            <header class="post-cab">
                <nav class="post-trilha" aria-label="Você está em">
                    <a href="/">Início</a><span aria-hidden="true">/</span><a href="/blog">Blog</a><span aria-hidden="true">/</span><span>${esc(p.categoria)}</span>
                </nav>
                <span class="post-cat">${esc(p.categoria)}</span>
                <h1 class="post-tit">${esc(p.titulo)}</h1>
                <p class="post-lead">${esc(p.descricao)}</p>
                <p class="post-meta">Por <strong>Equipe VCA Company</strong> · <time datetime="${p.data}">${dataBR(p.data)}</time> · ${p.minutos} min de leitura</p>
            </header>
            ${p.capa ? figura(p.capa, p.capa_alt || "", p.capa_credito ? (p.capa_link ? `<a href="${esc(p.capa_link)}" target="_blank" rel="noopener">${esc(p.capa_credito)}</a>` : esc(p.capa_credito)) : "", { classe: "post-capa", prioridade: true }) : ""}
            <div class="post-corpo">
${p.html}
${caixaCta(true, p.nicho)}
            </div>
        </article>
        <section class="post-rel" aria-labelledby="leia-tambem">
            <h2 id="leia-tambem" class="post-rel-tit">Leia também</h2>
            <div class="blog-grid">
                ${relacionados.map((r) => cartao(r)).join("\n                ")}
            </div>
        </section>
    </main>
${rodape()}`;
}

/* ---------- lista do blog ---------- */
function paginaLista(posts) {
  const url = SITE + "/blog";
  const titulo = "Blog da VCA Company | Automação, CRM e sistemas para empresas";
  const descricao = "Guias práticos sobre automação de WhatsApp, CRM, funil de vendas e sistemas para clínicas, restaurantes, contabilidade e empresas do Litoral Norte.";
  const cats = [...new Set(posts.map((p) => p.categoria))];
  const extra = [
    jsonLd({
      "@context": "https://schema.org", "@type": "Blog", "@id": url + "#blog", name: "Blog da VCA Company", url, description: descricao, inLanguage: "pt-BR", publisher: ORG,
      blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.titulo, url: `${SITE}/blog/${p.slug}`, datePublished: p.data, image: SITE + (p.capa || capaDe(p)) })),
    }),
    jsonLd({
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: url },
      ],
    }),
  ].map((x) => "    " + x).join("\n");
  return cabecaComum({ titulo, descricao, url, imagem: OG_PADRAO, extra }) + `
<body class="blog-page">
${topo("Blog")}
    <main class="blog-main">
        <header class="blog-cab">
            <span class="section-badge">Blog</span>
            <h1 class="blog-cab-tit">Conteúdo para organizar e vender mais</h1>
            <p class="blog-cab-sub">Guias práticos sobre automação, CRM, WhatsApp e gestão, escritos por quem implanta esses sistemas todos os dias em empresas de verdade.</p>
        </header>
        <div class="blog-filtros" role="toolbar" aria-label="Filtrar por assunto">
            <button type="button" class="blog-filtro is-active" data-filtro="">Todos</button>
            ${cats.map((c) => `<button type="button" class="blog-filtro" data-filtro="${esc(slugify(c))}">${esc(c)}</button>`).join("\n            ")}
        </div>
        <div class="blog-grid blog-grid-lista">
            ${posts.map((p) => cartao(p, "h2")).join("\n            ")}
        </div>
        <div class="blog-lista-cta">${caixaCta(true)}</div>
    </main>
${rodape()}`;
}

/* ---------- 404 ---------- */
function pagina404(posts) {
  return cabecaComum({ titulo: "Página não encontrada | VCA Company", descricao: "Essa página não existe ou mudou de endereço.", url: SITE + "/404", imagem: OG_PADRAO, extra: '    <meta name="robots" content="noindex">' })
    .replace('<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n', "")
    .replace(/\s*<link rel="canonical"[^>]*>/, "") + `
<body class="blog-page">
${topo("")}
    <main class="blog-main">
        <header class="blog-cab">
            <span class="section-badge">Erro 404</span>
            <h1 class="blog-cab-tit">Essa página não existe</h1>
            <p class="blog-cab-sub">O endereço pode ter mudado. Volte para o <a href="/">início</a> ou veja os artigos mais recentes do blog.</p>
        </header>
        <div class="blog-grid">
            ${posts.slice(0, 3).map((p) => cartao(p, "h2")).join("\n            ")}
        </div>
    </main>
${rodape()}`;
}

/* ---------- páginas por nicho (www.vcacompany.com/<slug>) ----------
   Página de venda para quem pesquisa "sistema para <nicho>": o problema, como funciona, telas reais, implantação,
   perguntas frequentes, artigos do mesmo assunto e o diagnóstico com o nicho já escolhido. */
const IMPLANTACAO = [
  ["Diagnóstico gratuito", "Em 30 minutos, por vídeo, olhamos a sua operação e onde a automação traz mais resultado."],
  ["Montagem sob medida", "Estruturamos o sistema, as integrações e as automações para o jeito de trabalhar do seu negócio."],
  ["Ativação e treinamento", "Colocamos tudo no ar junto com a sua equipe, migrando o que você já usa sem travar o dia a dia."],
  ["Acompanhamento", "Ajustamos as automações com os primeiros dados e expandimos mês após mês."],
];
const SELOS = ["WhatsApp oficial (API da Meta)", "Implantação e treinamento pela VCA", "Diagnóstico gratuito de 30 minutos"];
const artigosDo = (n, posts) => posts.filter((p) => p.nicho === n.slug || p.categoria === n.categoria);

function paginaNicho(n, posts) {
  const url = `${SITE}/${n.slug}`;
  const artigos = artigosDo(n, posts);
  const diag = linkDiag(n);
  const ld = [
    jsonLd({
      "@context": "https://schema.org", "@type": "Service", "@id": url + "#servico", name: n.h1, serviceType: `Sistema para ${n.curto}`,
      description: n.descricao, url, provider: { "@id": SITE + "/#organizacao" }, image: SITE + n.hero[0],
      audience: { "@type": "BusinessAudience", audienceType: n.nome },
      areaServed: [{ "@type": "Country", name: "Brasil" }, { "@type": "AdministrativeArea", name: "Litoral Norte de São Paulo" }],
    }),
    jsonLd({
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Soluções", item: SITE + "/solucoes" },
        { "@type": "ListItem", position: 3, name: n.nome, item: url },
      ],
    }),
    jsonLd({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: n.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    }),
  ].map((x) => "    " + x).join("\n");
  const recurso = ([t, p, img, alt], i) => img
    ? `<div class="nicho-rec${i % 2 ? " inverte" : ""}">
                    <div class="nicho-rec-txt"><h3>${esc(t)}</h3><p>${esc(p)}</p></div>
                    ${figura(img, alt, "Tela real do sistema, com dados de exemplo.", { classe: "post-fig nicho-rec-fig" })}
                </div>`
    : `<div class="nicho-rec so-texto"><div class="nicho-rec-txt"><h3>${esc(t)}</h3><p>${esc(p)}</p></div></div>`;
  return cabecaComum({ titulo: `${n.titulo_seo} | VCA Company`, descricao: n.descricao, url, imagem: OG_PADRAO, extra: ld }) + `
<body class="blog-page nicho-page">
${topo("Soluções", n)}
    <main class="nicho-main">
        <section class="nicho-hero">
            <div class="nicho-hero-txt">
                <nav class="post-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><a href="/solucoes">Soluções</a><span aria-hidden="true">/</span><span>${esc(n.nome)}</span></nav>
                <span class="post-cat">Sistema para ${esc(n.curto)}</span>
                <h1 class="nicho-tit">${esc(n.h1)}</h1>
                <p class="nicho-sub">${esc(n.sub)}</p>
                <div class="nicho-botoes"><a class="btn btn-primary" href="${diag}" data-cta="diagnostico">Agendar diagnóstico gratuito</a><a class="btn btn-outline" href="#como-funciona">Ver como funciona</a></div>
                <ul class="nicho-selos">${SELOS.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
            </div>
            ${figura(n.hero[0], n.hero[1], "Tela real do sistema, com dados de exemplo.", { classe: "post-fig nicho-hero-fig", prioridade: true })}
        </section>

        <section class="nicho-sec" aria-labelledby="dores">
            <h2 id="dores" class="nicho-h2">O que trava ${esc(n.curto)} hoje</h2>
            <div class="nicho-dores">
                ${n.dores.map(([t, p]) => `<div class="nicho-dor"><h3>${esc(t)}</h3><p>${esc(p)}</p></div>`).join("\n                ")}
            </div>
        </section>

        <section class="nicho-sec" id="como-funciona" aria-labelledby="como-funciona-tit">
            <h2 id="como-funciona-tit" class="nicho-h2">Como o sistema funciona em ${esc(n.curto)}</h2>
            <ol class="nicho-passos">
                ${n.passos.map(([t, p]) => `<li><h3>${esc(t)}</h3><p>${esc(p)}</p></li>`).join("\n                ")}
            </ol>
        </section>

        <section class="nicho-sec" aria-labelledby="recursos">
            <h2 id="recursos" class="nicho-h2">O que muda no dia a dia</h2>
            <div class="nicho-recs">
                ${n.recursos.map(recurso).join("\n                ")}
            </div>
        </section>

        <section class="nicho-sec" aria-labelledby="conexoes">
            <h2 id="conexoes" class="nicho-h2">Conecta com o que você já usa</h2>
            <ul class="nicho-conexoes">${n.conexoes.map((c) => `<li>${esc(c)}</li>`).join("")}<li>E outras ferramentas com integração</li></ul>
        </section>

        <section class="nicho-sec" aria-labelledby="implantacao">
            <h2 id="implantacao" class="nicho-h2">Como é a implantação</h2>
            <ol class="nicho-passos nicho-passos-impl">
                ${IMPLANTACAO.map(([t, p]) => `<li><h3>${esc(t)}</h3><p>${esc(p)}</p></li>`).join("\n                ")}
            </ol>
            ${caixaCta(true, n.slug).replace(/<a class="post-cta-link"[^>]*>.*?<\/a>/, "")}
        </section>

        <section class="nicho-sec nicho-faq" aria-labelledby="duvidas">
            <h2 id="duvidas" class="nicho-h2">Perguntas frequentes</h2>
            ${n.faq.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join("\n            ")}
        </section>
${artigos.length ? `
        <section class="nicho-sec" aria-labelledby="artigos">
            <h2 id="artigos" class="nicho-h2">Artigos para ${esc(n.curto)}</h2>
            <div class="blog-grid">
                ${artigos.slice(0, 6).map((p) => cartao(p)).join("\n                ")}
            </div>
        </section>` : ""}
    </main>
    <div class="nicho-fixo"><a class="btn btn-primary" href="${diag}" data-cta="diagnostico">Agendar diagnóstico gratuito</a></div>
${rodape()}`;
}

function paginaSolucoes(posts) {
  const url = SITE + "/solucoes";
  const titulo = "Sistemas por nicho: clínicas, restaurantes e mais | VCA Company";
  const descricao = "Sistema, CRM e automação montados para o seu nicho: clínicas, estética, restaurantes, contabilidade, advocacia e casas de eventos. Diagnóstico gratuito.";
  const extra = [
    jsonLd({
      "@context": "https://schema.org", "@type": "CollectionPage", name: "Sistemas por nicho", url, description: descricao, inLanguage: "pt-BR",
      mainEntity: { "@type": "ItemList", itemListElement: NICHOS.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n.h1, url: `${SITE}/${n.slug}` })) },
    }),
    jsonLd({
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Soluções", item: url },
      ],
    }),
  ].map((x) => "    " + x).join("\n");
  const card = (n) => {
    const t = tamanhoImg(n.hero[0]);
    return `<article class="blog-card">
    <a class="blog-card-link" href="/${n.slug}">
        <span class="blog-card-img"><img src="${esc(n.hero[0])}" alt="" width="${t.w}" height="${t.h}" loading="lazy" decoding="async"></span>
        <span class="blog-card-cat">${esc(n.nome)}</span>
        <h2 class="blog-card-tit">${esc(n.h1)}</h2>
        <p class="blog-card-resumo">${esc(n.sub)}</p>
        <span class="blog-card-meta">Ver como funciona →</span>
    </a>
</article>`;
  };
  return cabecaComum({ titulo, descricao, url, imagem: OG_PADRAO, extra }) + `
<body class="blog-page">
${topo("Soluções")}
    <main class="blog-main">
        <header class="blog-cab">
            <span class="section-badge">Soluções</span>
            <h1 class="blog-cab-tit">Um sistema montado para o seu nicho</h1>
            <p class="blog-cab-sub">O mesmo sistema da VCA, com agenda, CRM, WhatsApp oficial, financeiro e relatórios, montado para o jeito de trabalhar de cada tipo de negócio.</p>
        </header>
        <div class="blog-grid blog-grid-lista">
            ${NICHOS.map(card).join("\n            ")}
        </div>
        <div class="blog-lista-cta"><aside class="post-cta post-cta-final">
    <span class="post-cta-tag">Seu negócio não está na lista?</span>
    <p class="post-cta-tit">O sistema se adapta a qualquer nicho</p>
    <p>Imobiliárias, lojas, academias, estúdios, agências e outros negócios também usam o sistema. No diagnóstico gratuito mostramos como ele fica no seu.</p>
    <div class="post-cta-botoes"><a class="btn btn-primary" href="/#agendar" data-cta="diagnostico">Agendar diagnóstico gratuito</a></div>
</aside></div>
    </main>
${rodape()}`;
}

/* ---------- revenda, termos e privacidade (02/11/2026) ----------
   Pedido do João: "quero uma página assim no meu site [revenda da Food Sistemas] e as políticas de privacidade e
   termos clicáveis". Textos em _blog/revenda.mjs e _blog/legais.mjs; o visual reaproveita o das páginas de nicho
   (.nicho-*) e o do texto do blog (.post-corpo), com o que falta no fim do style.css (seção REVENDA E LEGAIS). */
const migalha = (nome, url) => jsonLd({
  "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: nome, item: url },
  ],
});
const linkWa = (href, txt, cls, cta) => `<a class="${cls}" href="${href}" target="_blank" rel="noopener" data-cta="${cta}">${txt}</a>`;

function paginaRevenda() {
  const R = REVENDA, url = `${SITE}/${R.slug}`;
  const ld = [
    jsonLd({ "@context": "https://schema.org", "@type": "WebPage", name: R.h1.join(" "), url, description: R.descricao, inLanguage: "pt-BR", about: { "@id": SITE + "/#organizacao" } }),
    migalha("Seja revendedor", url),
    // vídeo "Como funciona" (03/11, roteiro do João): feito em HyperFrames em VCA Company/videos/parceiros-vca
    jsonLd({ "@context": "https://schema.org", "@type": "VideoObject", name: R.video.titulo, description: R.video.descricao, thumbnailUrl: SITE + R.video.capa, contentUrl: SITE + R.video.src, uploadDate: R.video.data, duration: R.video.duracao, inLanguage: "pt-BR", publisher: { "@id": SITE + "/#organizacao" } }),
    jsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: R.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }),
  ].map((x) => "    " + x).join("\n");
  const titSec = (olho, [a, b, c = ""], id) => `<span class="rv-olho">${esc(olho)}</span>
            <h2 id="${id}" class="rv-h2">${esc(a)}<span class="rv-ouro">${esc(b)}</span>${esc(c)}</h2>`;
  return cabecaComum({ titulo: `${R.titulo_seo} | VCA Company`, descricao: R.descricao, url, imagem: OG_PADRAO, extra: ld }) + `
<body class="blog-page revenda-page">
${topo("Revenda")}
    <main class="rv-main">
        <section class="rv-hero">
            <nav class="rv-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span>Seja revendedor</span></nav>
            <h1 class="rv-h1">${esc(R.h1[0])}<span class="rv-ouro">${esc(R.h1[1])}</span></h1>
            <p class="rv-sub">${esc(R.sub)}</p>
            <div class="rv-botoes">${linkWa(R.wa_quero, "Quero ser revendedor", "btn btn-primary", "revenda")}<a class="btn btn-outline" href="#como-funciona">Ver como funciona</a></div>
            <ul class="rv-numeros">
                ${R.numeros.map(([n, t]) => `<li><strong>${esc(n)}</strong><span>${esc(t)}</span></li>`).join("\n                ")}
            </ul>
        </section>

        <p class="rv-destaque">${esc(R.destaque)}</p>

        <section class="rv-sec" id="como-funciona" aria-labelledby="como-funciona-tit">
            ${titSec("Como funciona", ["Do cadastro à ", "primeira comissão"], "como-funciona-tit")}
            <figure class="rv-video">
                <video controls playsinline preload="none" poster="${R.video.capa}" width="1920" height="1080" aria-label="${esc(R.video.titulo)}"><source src="${R.video.src}" type="video/mp4"></video>
            </figure>
            <div class="steps-grid rv-passos-metodo">
                ${R.passos.map(([t, p], i) => `<div class="step-card">
                    <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
                    <h3 class="step-title">${esc(t)}</h3>
                    <p class="step-desc">${esc(p)}</p>
                </div>`).join("\n                ")}
            </div>
        </section>

        <section class="rv-sec" aria-labelledby="duvidas">
            ${titSec("Dúvidas frequentes", ["Perguntas sobre a ", "revenda"], "duvidas")}
            <div class="rv-faq">
                ${R.faq.map(([q, a]) => `<details><summary><h3>${esc(q)}</h3><span class="rv-mais" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join("\n                ")}
            </div>
        </section>

        <section class="rv-final">
            <h2 class="rv-h2">${esc(R.final.tit)}</h2>
            <p class="rv-sec-sub">${esc(R.final.sub)}</p>
            <div class="rv-botoes">${linkWa(R.wa_quero, "Quero ser revendedor", "btn btn-primary", "revenda")}${linkWa(R.wa_duvida, "Tirar uma dúvida antes", "btn btn-outline", "revenda-duvida")}</div>
        </section>
    </main>
    <div class="nicho-fixo">${linkWa(R.wa_quero, "Quero ser revendedor", "btn btn-primary", "revenda")}</div>
${rodape()}`;
}

/* termos e privacidade: o e-mail vira link e "Política de Privacidade" aponta para /privacidade */
const legalTexto = (s) => esc(s)
  .replace(EMAIL_CONTATO, `<a href="mailto:${EMAIL_CONTATO}">${EMAIL_CONTATO}</a>`)
  .replace("Política de Privacidade", '<a href="/privacidade">Política de Privacidade</a>');
function paginaLegal(d) {
  const url = `${SITE}/${d.slug}`;
  const ld = [
    jsonLd({ "@context": "https://schema.org", "@type": "WebPage", name: d.nome, url, description: d.descricao, inLanguage: "pt-BR", dateModified: d.atualizado, publisher: { "@id": SITE + "/#organizacao" } }),
    migalha(d.nome, url),
  ].map((x) => "    " + x).join("\n");
  const outro = d.slug === "termos" ? ["/privacidade", "Política de Privacidade"] : ["/termos", "Termos de uso"];
  return cabecaComum({ titulo: `${d.titulo_seo} | VCA Company`, descricao: d.descricao, url, imagem: OG_PADRAO, extra: ld }) + `
<body class="blog-page legal-page">
${topo("")}
    <main class="blog-main legal-main">
        <header class="blog-cab legal-cab">
            <nav class="post-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span>${esc(d.nome)}</span></nav>
            <h1 class="blog-cab-tit">${esc(d.nome)}</h1>
            <p class="legal-data">Última atualização: ${dataBR(d.atualizado)}</p>
            <ul class="nicho-selos legal-selos">${d.selos.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        </header>
        <article class="post-corpo legal-corpo">
            <p>${legalTexto(d.intro)}</p>
${d.secoes.map(([t, ps, lis]) => `            <h2>${esc(t)}</h2>
${ps.map((p) => `            <p>${legalTexto(p)}</p>`).join("\n")}${ps.length && lis.length ? "\n" : ""}${lis.length ? `            <ul>
${lis.map((l) => `                <li>${legalTexto(l)}</li>`).join("\n")}
            </ul>` : ""}`).join("\n")}
            <aside class="post-cta post-cta-final">
                <span class="post-cta-tag">Dúvidas</span>
                <p class="post-cta-tit">Ficou alguma dúvida?</p>
                <p>Fale com a gente pelo WhatsApp (12) 97403-0135 ou pelo e-mail ${EMAIL_CONTATO}. Veja também a página de <a href="${outro[0]}">${outro[1]}</a>.</p>
                <div class="post-cta-botoes"><a class="btn btn-primary" href="https://wa.me/5512974030135?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre " + (d.slug === "termos" ? "os termos de uso" : "a política de privacidade") + " da VCA Company.")}" target="_blank" rel="noopener">Falar no WhatsApp</a><a class="post-cta-link" href="mailto:${EMAIL_CONTATO}">Mandar um e-mail →</a></div>
            </aside>
        </article>
    </main>
${rodape()}`;
}

/* ---------- RSS, sitemap, llms.txt e o bloco da página inicial ---------- */
const rfc822 = (iso) => new Date(iso + "T09:00:00-03:00").toUTCString();
function feed(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>Blog da VCA Company</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Automação, CRM e sistemas para empresas.</description>
    <language>pt-BR</language>
${posts.map((p) => `    <item>
        <title>${esc(p.titulo)}</title>
        <link>${SITE}/blog/${p.slug}</link>
        <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
        <pubDate>${rfc822(p.data)}</pubDate>
        <category>${esc(p.categoria)}</category>
        <description>${esc(p.descricao)}</description>
    </item>`).join("\n")}
</channel>
</rss>
`;
}

function sitemap(posts) {
  const hoje = new Date().toISOString().slice(0, 10);
  const maisNovo = posts.reduce((m, p) => (p.atualizado > m ? p.atualizado : m), "");
  const urls = [
    [SITE + "/", hoje, "1.0"],
    [SITE + "/solucoes", hoje, "0.9"],
    ...NICHOS.map((n) => [`${SITE}/${n.slug}`, hoje, "0.9"]),
    [SITE + "/revendedores", hoje, "0.8"],
    [SITE + "/termos", TERMOS.atualizado, "0.3"],
    [SITE + "/privacidade", PRIVACIDADE.atualizado, "0.3"],
    [SITE + "/blog", maisNovo, "0.8"],
    ...posts.map((p) => [`${SITE}/blog/${p.slug}`, p.atualizado, "0.7"]),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d, pr]) => `    <url><loc>${u}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join("\n")}
</urlset>
`;
}

function llms(posts) {
  return `# VCA Company

> A VCA Company implanta sistemas, automação e CRM com inteligência artificial para empresas: atendimento automático no WhatsApp (API oficial), funil de vendas, agenda, gestão financeira e portais para os clientes. Fica em Caraguatatuba (SP), atende o Litoral Norte de São Paulo de perto e empresas de todo o Brasil de forma online.

## Serviços
- Sistemas e CRM com IA sob medida para o nicho de cada empresa (clínicas, restaurantes, escritórios de contabilidade, advocacia, casas de eventos, comércio e serviços)
- Automação de atendimento e vendas no WhatsApp, pela API oficial do WhatsApp Business
- Automação de processos e integração com as ferramentas que a empresa já usa (Google Drive, Gmail, Google Agenda, planilhas, cobrança)
- Site integrado ao sistema, com captura de contatos e agendamento

## Sistemas por nicho
${NICHOS.map((n) => `- [${n.h1}](${SITE}/${n.slug}): ${n.descricao}`).join("\n")}

## Programa de revenda
- [Seja revendedor](${SITE}/revendedores): ${REVENDA.descricao}

## Como contratar
- [Diagnóstico gratuito de 30 minutos](${SITE}/#agendar): conversa por vídeo, sem compromisso
- WhatsApp: +55 12 97403-0135
- E-mail: vcacompanyofficial@gmail.com

## Blog
${posts.map((p) => `- [${p.titulo}](${SITE}/blog/${p.slug}): ${p.descricao}`).join("\n")}
`;
}

function blocoInicio(posts) {
  const idx = path.join(RAIZ, "index.html");
  const html = fs.readFileSync(idx, "utf8");
  const ini = "<!-- BLOG:INICIO -->", fim = "<!-- BLOG:FIM -->";
  const a = html.indexOf(ini), b = html.indexOf(fim);
  if (a < 0 || b < 0) { console.warn("aviso: index.html sem os marcadores do blog; a página inicial não foi atualizada"); return; }
  const nl = html.includes("\r\n") ? "\r\n" : "\n";
  const miolo = posts.slice(0, 3).map((p) => cartao(p)).join("\n").split("\n").map((l) => "                    " + l).join(nl);
  fs.writeFileSync(idx, html.slice(0, a + ini.length) + nl + miolo + nl + "                    " + html.slice(b), "utf8");
}

/* ---------- roda ---------- */
const pasta = path.join(RAIZ, "_blog/posts");
const posts = fs.readdirSync(pasta).filter((f) => f.endsWith(".md")).map((f) => lerPost(path.join(pasta, f)))
  .sort((a, b) => b.data.localeCompare(a.data) || a.titulo.localeCompare(b.titulo, "pt-BR"));
fs.mkdirSync(path.join(RAIZ, "blog"), { recursive: true });
const slugs = new Set();
for (const p of posts) { if (slugs.has(p.slug)) throw new Error("slug repetido: " + p.slug); slugs.add(p.slug); }
for (const f of fs.readdirSync(path.join(RAIZ, "blog")).filter((f) => f.endsWith(".html") && f !== "index.html")) {
  if (!slugs.has(f.replace(/\.html$/, ""))) fs.unlinkSync(path.join(RAIZ, "blog", f));   // artigo apagado do _blog/posts sai do site
}
for (const p of posts) escreve(`blog/${p.slug}.html`, paginaPost(p, posts));
escreve("blog/index.html", paginaLista(posts));
escreve("blog/feed.xml", feed(posts));
for (const n of NICHOS) escreve(`${n.slug}.html`, paginaNicho(n, posts));
escreve("solucoes.html", paginaSolucoes(posts));
escreve("revendedores.html", paginaRevenda());
escreve("termos.html", paginaLegal(TERMOS));
escreve("privacidade.html", paginaLegal(PRIVACIDADE));
escreve("404.html", pagina404(posts));
escreve("sitemap.xml", sitemap(posts));
escreve("llms.txt", llms(posts));
blocoInicio(posts);
console.log(`ok — ${posts.length} artigos:`);
for (const p of posts) console.log(`  /blog/${p.slug}  (${p.palavras} palavras, ${p.minutos} min, ${p.faq.length} perguntas${p.nicho ? ", nicho " + p.nicho : ""})`);
console.log(`ok — ${NICHOS.length} páginas de nicho + /solucoes:`);
for (const n of NICHOS) console.log(`  /${n.slug}  (${artigosDo(n, posts).length} artigos ligados)`);
