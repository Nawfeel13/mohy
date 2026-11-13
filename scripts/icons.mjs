// Génère les favicons PNG à partir de public/favicon.svg : node scripts/icons.mjs
import sharp from 'sharp';

const src = new URL('../public/favicon.svg', import.meta.url);
const out = (f) => new URL(`../public/${f}`, import.meta.url).pathname;

for (const [file, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(src.pathname, { density: 600 }).resize(size, size).png().toFile(out(file));
  console.log('✓', file);
}
