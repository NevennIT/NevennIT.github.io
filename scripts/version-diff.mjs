// Nouvelles versions depuis le dernier déploiement, pour les notifications.
//   node scripts/version-diff.mjs <versions-en-ligne.json>
// Lit src/data/releases.json (versions qui vont être publiées), écrit public/versions.json (publié avec le site,
// lu au déploiement suivant et par la page de suivi) et, dans GitHub Actions, la sortie `new` : liste JSON
// [{ repo, tag, title, id }] des dépôts dont la dernière version a changé. Sans fichier en ligne lisible
// (premier déploiement, site injoignable) : aucune notification, pour ne pas en envoyer en rafale.
import { readFile, writeFile, readdir, appendFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const releases = JSON.parse(await readFile(ROOT + 'src/data/releases.json', 'utf8'))

// Dépôt → projet (par son `repo` ou son dépôt public de téléchargement).
const byRepo = {}
for (const f of (await readdir(ROOT + 'content/projects')).filter((f) => f.endsWith('.json'))) {
  const p = JSON.parse(await readFile(ROOT + 'content/projects/' + f, 'utf8'))
  if (p.repo) byRepo[p.repo] = p
  if (p.download && p.download.releases) byRepo[p.download.releases] = byRepo[p.download.releases] || p
}

const now = {}
for (const [repo, list] of Object.entries(releases.repos || {})) {
  if (list && list[0]) now[repo] = { tag: list[0].tag, published_at: list[0].published_at }
}
await writeFile(ROOT + 'public/versions.json', JSON.stringify({ generatedAt: releases.generatedAt, repos: now }, null, 2) + '\n')

let live = null
try { live = JSON.parse(await readFile(process.argv[2], 'utf8')).repos } catch { /* pas de référence */ }

const fresh = []
if (live) {
  const seen = new Set()
  for (const [repo, v] of Object.entries(now)) {
    if (live[repo] && live[repo].tag === v.tag) continue
    const p = byRepo[repo]
    // Un projet suivi par deux dépôts (privé + public de téléchargement) : une seule notification.
    const key = (p ? p.id : repo) + '@' + v.tag
    if (seen.has(key)) continue
    seen.add(key)
    fresh.push({ repo, tag: v.tag, title: p ? p.title : repo, id: p ? p.id : '' })
  }
}
console.log(live ? `Nouvelles versions : ${fresh.map((x) => x.title + ' ' + x.tag).join(', ') || 'aucune'}` : 'Pas de versions en ligne de référence : aucune notification.')
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, 'new=' + JSON.stringify(fresh) + '\n')
