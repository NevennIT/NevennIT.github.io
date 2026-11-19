// Projets affichés dans « 01 — Projets », dans l'ordre. Un seul `feature: true` (carte pleine largeur en tête).
//
// Champs :
//   id           identifiant, aussi utilisé dans l'URL de la fiche (#/projet/<id>) et pour src/data/details/<id>.js
//   title, year
//   type         'desktop' | 'web' | 'addin'                    → filtre « Type »
//   status       'available' | 'in-progress' | 'archived'      → filtre « Statut » ; 'in-progress' affiche le badge « en cours »
//   description  { fr, en } : une ou deux phrases pour la carte (la fiche détaillée est dans src/data/details/)
//   tags         technologies                                  → filtre « Technologie »
//   repo         'NevennIT/<dépôt>' : lu au build pour la version latest et le changelog (dépôts privés compris)
//   publicRepo   true si le dépôt est public : la fiche affiche alors un lien vers le code (sinon aucun lien, pas de 404)
//   image        captures 1600 × 1000 (16:10) en WebP dans public/projects/ (`npm run images` convertit les PNG/JPG).
//                Plusieurs = carrousel, une = image fixe, [] = motif d'attente.
//   download     null (rien) | { releases: 'NevennIT/<dépôt public>', asset: '<regex du fichier>' } (téléchargement gratuit)
//                | { soon: true } (« Bientôt disponible ») | { buy: 'https://…' } (lien d'achat, plus tard)
export const projects = [
  {
    id: 'mylegark',
    title: 'MyLegArk',
    year: '2026',
    type: 'desktop',
    status: 'in-progress',
    description: {
      fr: "Coffre-fort chiffré pour la vie administrative d'un foyer : patrimoine, assurances, papiers et rappels. Tout reste sur le PC, sans compte ni cloud.",
      en: "Encrypted vault for a household's paperwork: assets, insurance, documents and reminders. Everything stays on the PC, with no account and no cloud.",
    },
    tags: ['Rust', 'Tauri', 'Vue.js', 'TypeScript'],
    repo: 'NevennIT/MyLegArk',
    publicRepo: false,
    image: [],
    download: { soon: true },
    feature: true,
  },
  {
    id: 'lost-desktop',
    title: 'Lost Desktop',
    year: '2026',
    type: 'desktop',
    status: 'available',
    description: {
      fr: "Rapatrie les fenêtres perdues sur un écran débranché ou éteint, et restaure la disposition de vos fenêtres, applications fermées comprises.",
      en: "Brings back windows lost on an unplugged or turned-off monitor, and restores your window layout, closed apps included.",
    },
    tags: ['Rust', 'Tauri', 'Vue.js', 'Win32'],
    repo: 'NevennIT/lost-desktop',
    publicRepo: false,
    image: ['./projects/lost-desktop-1.webp', './projects/lost-desktop-2.webp'],
    download: { releases: 'NevennIT/lost-desktop-releases', asset: '_x64-setup\\.exe$' },
  },
  {
    id: 'gantt-v',
    title: 'Gantt-V',
    year: '2026',
    type: 'desktop',
    status: 'in-progress',
    description: {
      fr: "Planning de fabrication en Gantt vertical : importe une extraction de tableur, signale les chevauchements, se réorganise à la souris et s'exporte en PDF ou Excel.",
      en: "Vertical Gantt production schedule: imports a spreadsheet export, flags overlaps, can be rearranged with the mouse and exports to PDF or Excel.",
    },
    tags: ['Rust', 'Tauri', 'Vue.js', 'TypeScript'],
    repo: 'NevennIT/ScheduleExcel',
    publicRepo: false,
    image: [],
    download: { soon: true },
  },
  {
    id: 'digitabulo',
    title: 'Digitabulo',
    year: '2026',
    type: 'desktop',
    status: 'in-progress',
    description: {
      fr: "Inventaire d'une collection de dés à coudre : fiches, photos, import depuis Excel, recherche, catalogues HTML et PDF, et même un modèle 3D tiré des photos.",
      en: "Inventory for a thimble collection: records, photos, Excel import, search, HTML and PDF catalogues, and even a 3D model built from photos.",
    },
    tags: ['Rust', 'Tauri', 'Vue.js'],
    repo: 'NevennIT/digitabulo',
    publicRepo: false,
    image: [],
    download: { soon: true },
  },
  {
    id: 'portfolio',
    title: 'Portfolio NevennIT',
    year: '2026',
    type: 'web',
    status: 'available',
    description: {
      fr: "Ce site : une page Vue 3 avec une sphère de particules en Canvas, un triskell qui traverse la page en éclatant, et un défilement Lenis.",
      en: "This site: a single Vue 3 page with a Canvas particle sphere, a triskelion that shatters its way down the page, and Lenis smooth scrolling.",
    },
    tags: ['Vue.js', 'Vite', 'Canvas', 'GitHub Pages'],
    repo: 'NevennIT/NevennIT.github.io',
    publicRepo: true,
    image: ['./projects/portfolio-preview.webp', './projects/portfolio-preview-project.webp', './projects/portfolio-preview-contact.webp'],
    download: null,
  },
]

export const repoUrl = (repo) => 'https://github.com/' + repo
