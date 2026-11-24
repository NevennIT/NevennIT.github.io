// Projets affichés dans « 01 — Projets » : un fichier par projet dans content/projects/<id>.json,
// modifiable depuis Pages CMS (app.pagescms.org) ou à la main. Ici, on les lit et on les met en forme pour le site.
//
// Champs d'un projet (voir aussi content/README.md) :
//   id           identifiant, aussi utilisé dans l'URL de la fiche (#/projet/<id>) et pour content/fiches/<id>.json
//   order        rang dans la grille (10, 20, 30… : on peut glisser un projet entre deux avec 15)
//   title, year
//   type         'desktop' | 'web' | 'addin'                    → filtre « Type »
//   status       'available' | 'in-progress' | 'archived'      → filtre « Statut » ; 'in-progress' affiche le badge « en cours »
//   feature      true pour la carte pleine largeur en tête (un seul projet)
//   description  { fr, en } : une ou deux phrases pour la carte
//   tags         technologies                                  → filtre « Technologie »
//   images       captures 16:10 dans public/projects/ (PNG/JPG convertis en WebP au déploiement)
//   repo         'NevennIT/<dépôt>' : lu au build pour la version latest et le changelog (dépôts privés compris)
//   publicRepo   true si le dépôt est public : la fiche affiche alors un lien vers le code
//   download     { mode: 'none' | 'free' | 'soon' | 'buy', releases, asset, buy }

const files = import.meta.glob('/content/projects/*.json', { eager: true, import: 'default' })

// Ancien format des téléchargements, attendu par la fiche : null | { releases, asset } | { soon: true } | { buy }.
function download(d) {
  if (!d || d.mode === 'none') return null
  if (d.mode === 'free' && d.releases) return { releases: d.releases, asset: d.asset || '' }
  if (d.mode === 'buy' && d.buy) return { buy: d.buy }
  if (d.mode === 'soon') return { soon: true }
  return null
}

export const projects = Object.values(files)
  .filter((p) => p && p.id && p.title)
  .map((p) => ({
    ...p,
    tags: p.tags || [],
    image: (p.images || []).filter(Boolean),
    download: download(p.download),
  }))
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

export const repoUrl = (repo) => 'https://github.com/' + repo
