// Réglages du site. Les valeurs modifiables (e-mail, formulaire, textes d'accueil) sont dans content/site.json,
// à modifier à la main ; les autres textes de l'interface sont dans src/i18n/messages/ (français et anglais).
import data from '/content/site.json'
import { visible as parcoursVisible } from './data/parcours'

export const site = {
  name: 'NevennIT',
  github: 'https://github.com/NevennIT',
  repository: 'https://github.com/NevennIT/NevennIT.github.io',
  email: data.email || '',

  // GitHub Pages est statique : le formulaire poste vers un service tiers (Formspree : formspree.io).
  // Vide = le formulaire affiche qu'il n'est pas encore relié, rien n'est envoyé.
  formEndpoint: data.formEndpoint || '',
}

// Sections facultatives.
//   parcours : « 02 — Parcours ». Toujours visible en développement (npm run dev) ; sur le site publié,
//              seulement si `visible` vaut true dans content/parcours.json.
export const sections = {
  parcours: import.meta.env.DEV || parcoursVisible,
}

// Liens de la navigation, dans l'ordre ; `key` renvoie au texte nav.<key> des traductions.
export const navLinks = [
  { href: '#projets', key: 'projects' },
  sections.parcours && { href: '#parcours', key: 'parcours' },
  { href: '#contact', key: 'contact' },
].filter(Boolean)
