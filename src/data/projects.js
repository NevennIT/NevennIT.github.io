// Projets affichés dans « 01 — Projets », dans l'ordre. Un seul `feature: true` (pleine largeur).
// image : capture 1600 × 1000 (16:10) en WebP ≤ 200 Ko, placée dans public/projets/ → '/projets/nom.webp'. null = motif d'attente.
// Les entrées marquées « exemple » sont à remplacer par vos projets.
export const projects = [
  {
    id: 'portfolio',
    title: 'Portfolio NevennIT',
    year: '2026',
    kind: 'Site web',
    description: "Ce site : une page en Vue 3, une scène de particules en Canvas et un défilement Lenis, déployée sur GitHub Pages.",
    tags: ['Vue.js', 'Vite', 'Canvas', 'GitHub Pages'],
    href: 'https://github.com/NevennIT/NevennIT.github.io',
    image: null,
    feature: true,
  },
  {
    id: 'exemple-1', // exemple
    title: 'Nom du projet',
    year: '2025',
    kind: 'Application web',
    description: 'Le problème que le projet résout, et pour qui, en une phrase.',
    tags: ['JavaScript', 'Node.js', 'SQLite'],
    href: 'https://github.com/NevennIT',
    image: null,
  },
  {
    id: 'exemple-2', // exemple
    title: 'Nom du projet',
    year: '2025',
    kind: 'Infrastructure',
    description: 'Une phrase : ce qui a été mis en place et ce que cela change.',
    tags: ['Linux', 'Docker'],
    href: 'https://github.com/NevennIT',
    image: null,
  },
]
