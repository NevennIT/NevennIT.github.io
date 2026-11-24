// Convertit les images de public/projects/ (PNG, JPG) en WebP 1600 × 1000 (16:10), qualité 82,
// met à jour leurs références dans content/**/*.json, puis supprime les originaux.
// Lancé à chaque déploiement (les captures envoyées depuis Pages CMS en PNG/JPG sont donc optimisées en ligne),
// et utilisable en local : npm run images
// Une image qui n'est pas en 16:10 est recadrée sur son haut (là où sont les barres de titre et menus).
import { readdir, readFile, writeFile, stat, unlink } from 'node:fs/promises'
import { join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIR = join(ROOT, 'public', 'projects')
const CONTENT = join(ROOT, 'content')

const renamed = new Map() // '/projects/x.png' → '/projects/x.webp'
for (const file of await readdir(DIR)) {
  const { name, ext } = parse(file)
  if (!/^\.(png|jpe?g)$/i.test(ext)) continue
  const out = join(DIR, name + '.webp')
  const before = (await stat(join(DIR, file))).size
  const info = await sharp(join(DIR, file))
    .resize(1600, 1000, { fit: 'cover', position: 'top' })
    .webp({ quality: 82, effort: 6 })
    .toFile(out)
  await unlink(join(DIR, file))
  renamed.set('/projects/' + file, '/projects/' + name + '.webp')
  console.log(`${file} → ${name}.webp  ${(before / 1024).toFixed(0)} Ko → ${(info.size / 1024).toFixed(0)} Ko`)
}

// Références dans le contenu (avec ou sans « . » devant : ./projects/… ou /projects/…).
async function* jsonFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) yield* jsonFiles(join(dir, e.name))
    else if (e.name.endsWith('.json')) yield join(dir, e.name)
  }
}
if (renamed.size) {
  for await (const f of jsonFiles(CONTENT)) {
    let text = await readFile(f, 'utf8'), changed = false
    for (const [from, to] of renamed) {
      for (const prefix of ['', '.']) {
        if (text.includes('"' + prefix + from + '"')) { text = text.split('"' + prefix + from + '"').join('"' + prefix + to + '"'); changed = true }
      }
    }
    if (changed) { await writeFile(f, text); console.log('références mises à jour :', f.slice(ROOT.length)) }
  }
} else console.log('Aucune image PNG/JPG à convertir.')
