// Écran de chargement (posé en dur dans index.html) : il part une fois l'appli montée, les polices prêtes
// et le remplissage du logo terminé. pageReady se résout pendant la montée du bandeau : les apparitions
// de l'accueil et le défilement attendent ce moment.
import { reducedMotion } from './motion'

const FILL_END = 1450 // fin du remplissage (délai + durée de l'animation CSS), depuis le début de la navigation
const HOLD = 180 // logo plein, un instant, avant de partir
const LIFT = 1150 // durée de la montée (transition CSS)

let release
export const pageReady = new Promise((r) => (release = r))

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export async function dismissLoader() {
  const el = document.getElementById('nv-loader'), root = document.documentElement
  if (!el || el.classList.contains('is-out')) {
    root.classList.remove('nv-loading')
    release()
    return
  }
  const fonts = document.fonts ? Promise.race([document.fonts.ready, wait(2500)]) : null
  await Promise.all([fonts, reducedMotion ? null : wait(FILL_END + HOLD - performance.now())])

  if (!location.hash) scrollTo(0, 0)
  el.classList.add('is-out')
  root.classList.remove('nv-loading')
  // Les apparitions démarrent quand le bandeau dégage le haut de l'accueil.
  setTimeout(release, reducedMotion ? 0 : LIFT * 0.35)
  setTimeout(() => el.remove(), reducedMotion ? 400 : LIFT + 100)
}
