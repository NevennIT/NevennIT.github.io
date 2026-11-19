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
      fr: "Coffre-fort chiffré pour la vie administrative d'un foyer : patrimoine, assurances, contrats. Tout reste sur le PC, sans compte ni cloud.",
      en: 'Encrypted vault for household paperwork: assets, insurance, contracts. Everything stays on the PC, no account, no cloud.',
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
      fr: "Retrouve et rapatrie les fenêtres perdues sur un écran débranché ou éteint, et restaure la disposition de vos fenêtres en un clic.",
      en: 'Finds and brings back windows lost on an unplugged or turned-off monitor, and restores your window layout in one click.',
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
      fr: "Planning de fabrication en Gantt vertical, refonte en application de bureau de l'add-in Excel Schedule : interface modulable qui s'adapte aux données.",
      en: 'Vertical Gantt production schedule, a desktop rewrite of the Excel Schedule add-in: a flexible interface that adapts to the data.',
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
      fr: 'Application de gestion de collection de dés.',
      en: 'An app to manage a dice collection.',
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
      fr: 'Ce site : une page en Vue 3, une scène de particules en Canvas et un défilement Lenis, déployée sur GitHub Pages.',
      en: 'This site: a single page in Vue 3, a Canvas particle scene and Lenis smooth scrolling, deployed on GitHub Pages.',
    },
    tags: ['Vue.js', 'Vite', 'Canvas', 'GitHub Pages'],
    repo: 'NevennIT/NevennIT.github.io',
    publicRepo: true,
    image: ['./projects/portfolio-preview.webp', './projects/portfolio-preview-project.webp', './projects/portfolio-preview-contact.webp'],
    download: null,
  },
]

export const repoUrl = (repo) => 'https://github.com/' + repo
