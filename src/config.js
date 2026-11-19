// Réglages du site : liens, service d'envoi du formulaire, sections affichées.
// Les textes de l'interface sont dans src/i18n/messages/ (français et anglais).
export const site = {
  name: 'NevennIT',
  github: 'https://github.com/NevennIT',
  repository: 'https://github.com/NevennIT/NevennIT.github.io',
  email: 'daniel.hamet@outlook.com',

  // GitHub Pages est statique : le formulaire poste vers un service tiers.
  // Formspree : créer un formulaire sur formspree.io et coller son URL, ex. 'https://formspree.io/f/abcdwxyz'.
  // Vide = le formulaire affiche qu'il n'est pas encore relié, rien n'est envoyé.
  formEndpoint: 'https://formspree.io/f/xkjjjwaa',
}

// Sections facultatives.
//   parcours : « 02 — Parcours ». Par défaut, visible en développement (npm run dev) et masquée sur le site publié,
//              tant que son contenu (src/data/parcours.js) n'est pas complété. Une fois prêt : mettre `true`.
export const sections = {
  parcours: import.meta.env.DEV,
}

// Liens de la navigation, dans l'ordre ; `key` renvoie au texte nav.<key> des traductions.
export const navLinks = [
  { href: '#projets', key: 'projects' },
  sections.parcours && { href: '#parcours', key: 'parcours' },
  { href: '#contact', key: 'contact' },
].filter(Boolean)
