const fs = require('fs');
const { PNG } = require('pngjs');

const src = 'ChatGPT Image 14 de jun. de 2026, 13_37_44.png';
const out = 'imagens/google-meta.png';

const png = PNG.sync.read(fs.readFileSync(src));
const { width, height, data } = png;

// sample corner colors
const corners = [[2,2],[width-3,2],[2,height-3],[width-3,height-3]];
corners.forEach(([x,y])=>{
  const i=(y*width+x)*4;
  console.log('canto', x, y, '=>', data[i], data[i+1], data[i+2]);
});

let removed = 0, kept = 0;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i+1], b = data[i+2];
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  // fundo = claro e acinzentado (branco ou cinza do xadrez)
  const isBg = r >= 205 && g >= 205 && b >= 205 && (max - min) <= 14;
  if (isBg) { data[i+3] = 0; removed++; }
  else { data[i+3] = 255; kept++; }
}

fs.mkdirSync('imagens', { recursive: true });
fs.writeFileSync(out, PNG.sync.write(png));
console.log('removidos(transparentes):', removed, '| mantidos:', kept, '| %fundo:', (removed/(removed+kept)*100).toFixed(1)+'%');
console.log('salvo em', out);
