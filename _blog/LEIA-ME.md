# Blog da VCA Company

As páginas do blog são HTML pronto (o Google lê sem rodar JavaScript), geradas a partir dos textos desta pasta.
Esta pasta `_blog` fica no GitHub, mas não vai para o site (`.vercelignore`).

## Publicar um artigo novo

1. Crie `_blog/posts/<endereco-do-artigo>.md` copiando o cabeçalho de um artigo existente:

   ```
   ---
   slug: endereco-do-artigo            ← vira www.vcacompany.com/blog/endereco-do-artigo
   titulo: Título que aparece no artigo (H1)
   titulo_seo: Título curto para o Google (até uns 48 caracteres; o site junta " | VCA Company")
   descricao: Resumo para o Google, até 155 caracteres
   resumo: Frase curta para o cartão da lista
   categoria: Automação
   palavra_chave: busca principal que o artigo quer ganhar
   capa: /blog/img/endereco-do-artigo/capa.webp
   capa_alt: Descrição da foto para quem não enxerga e para o Google
   capa_credito: Foto: Nome do fotógrafo / Pexels
   capa_link: https://www.pexels.com/photo/<número>/
   data: 2026-11-02
   atualizado: 2026-12-01             ← opcional, quando revisar o texto
   ---
   ```

2. Escreva o texto em Markdown simples:
   - `## Título de seção` e `### Subtítulo`
   - `- item` e `1. item`
   - `**negrito**`, `*itálico*`, `[link](/blog/outro-artigo)`
   - imagem com legenda, em uma linha sozinha:
     `![descrição da imagem](/blog/img/endereco-do-artigo/tela.webp "Legenda que aparece embaixo")`
   - `[[cta]]` em uma linha sozinha põe a caixa "Diagnóstico gratuito" no meio do texto
   - termine com `## Perguntas frequentes` e cada pergunta em `### Pergunta?` (vira também o FAQ do Google)
   - escreva "em um" / "em uma", nunca "num" / "numa"

   **Imagens:**
   - Fotos: só de bancos com licença livre para uso comercial (Pexels ou Unsplash). Imagem tirada direto do Google
     costuma ter direitos autorais. Dê o crédito do fotógrafo na capa.
   - Telas do sistema: telas reais com dados de exemplo (as dos vídeos em `VCA Company/videos/*/assets/telas` servem).
     Nunca use tela com marca, logo, cardápio ou dado de cliente de verdade; corte a barra lateral quando ela mostrar o logo.
   - Prepare tudo em WebP com `_blog/preparar-imagens.mjs` (corta, reduz e converte). A largura e a altura de cada
     imagem o gerador lê do próprio arquivo.

3. Gere as páginas (na pasta do site):

   ```
   node _blog/gerar.mjs
   ```

   Isso atualiza `blog/`, a lista do blog, os 3 artigos da página inicial, `sitemap.xml`, `blog/feed.xml`, `llms.txt` e `404.html`.

4. (Opcional) Imagem de compartilhamento do artigo, 1200×630, com o título:

   ```
   PUPPETEER=<caminho do puppeteer-core.js> node _blog/imagens.mjs
   node _blog/gerar.mjs
   ```

   Sem ela, o artigo usa `imagens/og-vca.png`.

5. Commit e push no `main`. A Vercel publica sozinha.

## Apagar um artigo

Apague o `.md` em `_blog/posts` e rode `node _blog/gerar.mjs`: a página sai do site, da lista e do sitemap.

## Arquivos

- `posts/*.md`: os textos
- `gerar.mjs`: o gerador (só Node, sem dependências)
- `preparar-imagens.mjs`: corta, reduz e converte fotos e telas para WebP (`blog/img/<slug>/`)
- `imagens.mjs`: logo leve (`imagens/logo-vca.webp`) e imagens de compartilhamento
- `../vercel.json`: `cleanUrls` (endereços sem `.html`)
- O visual do blog fica no fim do `style.css` (seção "BLOG") e o comportamento em `blog/blog.js`
