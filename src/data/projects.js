// Projets affichés dans « 01 — Projets », dans l'ordre. Un seul `feature: true` (pleine largeur).
// image : tableau de captures 1600 × 1000 (16:10), idéalement en WebP ≤ 200 Ko, placées dans public/projects/
//   → ['./projects/nom-1.webp', './projects/nom-2.webp']. Plusieurs = carrousel (défilement auto), une seule = image fixe,
//   [] ou absent = motif d'attente.
// Les entrées marquées « exemple » sont à remplacer par vos projets.
export const projects = [

  {
    id: 'lost-desktop', // exemple
    title: 'Lost Desktop',
    year: '2026',
    kind: 'Webapp',
    description: 'Application Windows permettant la gestion des fenêtres d\'application sur multiécrans.',
    tags: ['Rust', 'Vue.js', 'Tauri', 'Win32'],
    href: 'https://github.com/NevennIT/lost-desktop',
    image: ['./projects/lost-desktop-1.png'],
    feature: true,
  },
  {
    id: 'portfolio',
    title: 'Portfolio NevennIT',
    year: '2026',
    kind: 'Site web',
    description: "Ce site : une page en Vue 3, une scène de particules en Canvas et un défilement Lenis, déployée sur GitHub Pages.",
    tags: ['Vue.js', 'Vite', 'Canvas', 'GitHub Pages'],
    href: 'https://github.com/NevennIT/NevennIT.github.io',
    image: ['./projects/portfolio-preview.png'],
    feature: false,
  },
  {
    id: 'excel-schedule', // exemple
    title: 'Excel Schedule',
    year: '2021',
    kind: 'AddIn',
    description: 'Graphique de Gantt sous forme verticale. Planning de fabrication à partir d\'une feuille Excel extrait de SAP.',
    tags: ['VBA', 'Excel', 'SAP'],
    href: 'https://github.com/NevennIT',
    image: ['./projects/Excel-Schedule-1.png'],
  },
]
