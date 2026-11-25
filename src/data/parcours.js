// Contenu de « 02 — Parcours » : content/parcours.json.
// `visible` : affiche la section sur le site publié (en `npm run dev`, elle est toujours visible).
// Les entrées `todo: true` sont des exemples à remplacer : elles s'affichent en pointillés « à compléter ».
import data from '/content/parcours.json'

export const visible = !!data.visible
export const experiences = data.experiences || []
export const education = data.education || []
export const skills = data.skills || []
