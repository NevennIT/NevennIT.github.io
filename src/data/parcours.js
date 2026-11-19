// Contenu de « 02 — Parcours ». La section est masquée sur le site publié tant que `sections.parcours`
// (src/config.js) ne vaut pas `true` : on peut compléter ce fichier tranquillement, il n'apparaît qu'en `npm run dev`.
//
// Les entrées `todo: true` sont des exemples à remplacer : elles s'affichent en pointillés « à compléter »
// pour être repérées. Retirer `todo` une fois l'entrée réelle saisie.
// Textes : { fr, en } (une chaîne seule vaut pour les deux langues).

// Expériences professionnelles, de la plus récente à la plus ancienne.
export const experiences = [
  {
    todo: true,
    period: { fr: '2022 — aujourd’hui', en: '2022 — present' },
    role: { fr: 'Intitulé du poste', en: 'Job title' },
    org: 'Entreprise',
    place: { fr: 'Ville', en: 'City' },
    text: {
      fr: 'Deux lignes sur les missions et ce que vous y avez construit.',
      en: 'Two lines about your responsibilities and what you built there.',
    },
    tags: ['Tag'],
  },
  {
    todo: true,
    period: '2019 — 2022',
    role: { fr: 'Intitulé du poste', en: 'Job title' },
    org: 'Entreprise',
    place: { fr: 'Ville', en: 'City' },
    text: {
      fr: 'Par exemple : outils de planification de production sous Excel/VBA à partir de données SAP.',
      en: 'For example: production planning tools in Excel/VBA built on SAP data.',
    },
    tags: ['VBA', 'Excel', 'SAP'],
  },
]

// Formation : diplômes, certifications.
export const education = [
  {
    todo: true,
    period: '20XX',
    title: { fr: 'Diplôme ou certification', en: 'Degree or certification' },
    org: 'École / organisme',
  },
]

// Compétences par familles, tirées des projets présentés (à ajuster).
export const skills = [
  { group: { fr: 'Langages', en: 'Languages' }, items: ['Rust', 'TypeScript', 'JavaScript', 'VBA'] },
  { group: { fr: 'Interfaces', en: 'Front-end' }, items: ['Vue 3', 'Pinia', 'Vite', 'HTML / CSS', 'Canvas'] },
  { group: { fr: 'Applications de bureau', en: 'Desktop apps' }, items: ['Tauri 2', 'API Win32', 'Installateurs NSIS'] },
  { group: { fr: 'Sécurité', en: 'Security' }, items: ['Argon2id', 'XChaCha20-Poly1305'] },
  { group: { fr: 'Outils', en: 'Tooling' }, items: ['Git', 'GitHub Actions', 'Vitest', 'Excel', 'SAP'] },
]
