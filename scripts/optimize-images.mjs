// Convertit les captures de public/projects/ (PNG, JPG) en WebP 1600 × 1000 (16:10), qualité 82.
// Usage : npm run images            → convertit les images qui n'ont pas encore leur .webp
//         npm run images -- --force → reconvertit tout
// Les originaux ne sont pas supprimés : à retirer à la main une fois la conversion vérifiée.
// Une image qui n'est pas en 16:10 est recadrée sur son haut (là où sont les barres de titre et menus).
import { readdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const DIR = new URL('../public/projects/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')
const force = process.argv.includes('--force')

for (const file of await readdir(DIR)) {
  const { name, ext } = parse(file)
  if (!/^\.(png|jpe?g)$/i.test(ext)) continue
  const out = join(DIR, name + '.webp')
  if (!force && (await stat(out).catch(() => null))) continue
  const info = await sharp(join(DIR, file))
    .resize(1600, 1000, { fit: 'cover', position: 'top' })
    .webp({ quality: 82, effort: 6 })
    .toFile(out)
  const before = (await stat(join(DIR, file))).size
  console.log(`${file} → ${name}.webp  ${(before / 1024).toFixed(0)} Ko → ${(info.size / 1024).toFixed(0)} Ko`)
}
