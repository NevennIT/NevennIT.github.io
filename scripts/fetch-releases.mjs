// Versions des projets, lues au build : écrit src/data/releases.json (version latest, changelog, fichiers à télécharger).
//   npm run releases            (token dans GH_TOKEN ou GITHUB_TOKEN ; en local : GH_TOKEN=$(gh auth token) npm run releases)
// Dépôts lus : le `repo` de chaque projet (privés compris) et chaque `download.releases` (dépôt public de téléchargement).
// Dépôt privé : ni lien vers la release ni URL de fichier (elles exigent une authentification), seulement nom et taille.
// Sans token, ou si GitHub ne répond pas, le fichier existant est gardé : le build n'échoue jamais pour ça.
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Projets : content/projects/*.json (même source que le site).
const DIR = fileURLToPath(new URL('../content/projects/', import.meta.url))
const projects = await Promise.all((await readdir(DIR)).filter((f) => f.endsWith('.json')).map(async (f) => {
  const p = JSON.parse(await readFile(DIR + f, 'utf8'))
  return { ...p, download: p.download && p.download.mode === 'free' ? { releases: p.download.releases } : null }
}))

const OUT = fileURLToPath(new URL('../src/data/releases.json', import.meta.url))
const API = 'https://api.github.com'
const KEEP = 5
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN

const warn = (msg) => console.warn('[releases] ' + msg)

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'))
  } catch {
    return null
  }
}

async function save(data) {
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

// Appel API ; 404 → null (dépôt absent ou pas encore créé), autre erreur → exception.
async function api(path) {
  const res = await fetch(API + path, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'nevennit-portfolio-build',
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(path + ' → HTTP ' + res.status)
  return res.json()
}

async function fetchRepo(repo) {
  const meta = await api('/repos/' + repo)
  if (!meta) {
    warn(repo + ' : dépôt introuvable (404), liste vide.')
    return []
  }
  const pub = meta.private === false
  const list = (await api('/repos/' + repo + '/releases?per_page=20')) || []
  return list
    .filter((r) => !r.draft)
    .slice(0, KEEP)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      published_at: r.published_at,
      prerelease: !!r.prerelease,
      body: r.body || '',
      ...(pub ? { html_url: r.html_url } : {}),
      assets: (r.assets || []).map((a) => ({
        name: a.name,
        size: a.size,
        ...(pub ? { browser_download_url: a.browser_download_url } : {}),
      })),
    }))
}

async function main() {
  const existing = await readExisting()
  if (!token) {
    warn('aucun token (GH_TOKEN / GITHUB_TOKEN) : fichier existant conservé.')
    if (!existing) await save({ generatedAt: null, repos: {} })
    return
  }

  const repos = new Set()
  for (const p of projects) {
    if (p.repo) repos.add(p.repo)
    if (p.download && p.download.releases) repos.add(p.download.releases)
  }

  const out = { generatedAt: new Date().toISOString(), repos: {} }
  let failed = 0
  for (const repo of repos) {
    try {
      out.repos[repo] = await fetchRepo(repo)
    } catch (e) {
      failed++
      warn(repo + ' : ' + e.message + ' — données précédentes conservées.')
      out.repos[repo] = (existing && existing.repos && existing.repos[repo]) || []
    }
  }
  // Tout a échoué (réseau, token refusé) : on ne touche pas au fichier.
  if (failed === repos.size && existing) {
    warn('aucun dépôt lu : fichier existant conservé.')
    return
  }
  await save(out)
  console.log('[releases] ' + OUT + ' : ' + [...repos].map((r) => r + ' (' + out.repos[r].length + ')').join(', '))
}

main().catch(async (e) => {
  warn('échec : ' + e.message)
  if (!(await readExisting())) await save({ generatedAt: null, repos: {} }).catch(() => {})
})
