// Réglages du site : textes d'en-tête, liens, service d'envoi du formulaire.
export const site = {
  name: 'NevennIT',
  tagline: "Projets informatiques réalisés, de l'idée à la mise en ligne.",
  github: 'https://github.com/NevennIT',
  repository: 'https://github.com/NevennIT/NevennIT.github.io',

  // GitHub Pages est statique : le formulaire poste vers un service tiers.
  // Formspree : créer un formulaire sur formspree.io et coller son URL, ex. 'https://formspree.io/f/abcdwxyz'.
  // Vide = le formulaire affiche qu'il n'est pas encore relié, rien n'est envoyé.
  formEndpoint: '',
}

export const navLinks = [
  { href: '#projets', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
]
