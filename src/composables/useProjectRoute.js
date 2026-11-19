import { ref } from 'vue'
import { pageReady } from '../lib/loader'

// Route des fiches projet : #/projet/<id>, partageable.
//   projectId      id de la fiche demandée par l'URL (null sinon), réactif ; lu seulement après l'écran de chargement
//   closeProject() revient à une URL sans route : Retour (autant de pas que de fiches ouvertes dans la page),
//                  sinon remplacement de l'URL par #projets (lien direct : pas d'entrée précédente à nous)
const PREFIX = '#/projet/'

export const projectHref = (id) => PREFIX + encodeURIComponent(id)
export const projectId = ref(null)

// depth : nombre d'entrées d'historique de fiches empilées par la page (chacune marquée dans history.state).
// unwinding : un retour est en route ; s'il aboutit encore sur une fiche (lien direct), l'URL est remplacée.
let depth = 0, unwinding = false, started = false, ready = false

function parse(hash) {
  if (!hash.startsWith(PREFIX)) return null
  try {
    return decodeURIComponent(hash.slice(PREFIX.length)).replace(/\/+$/, '') || null
  } catch (e) {
    return null
  }
}

function clearRoute() {
  history.replaceState(null, '', location.pathname + location.search + '#projets')
  depth = 0
  projectId.value = null
}

function onHashChange() {
  if (!ready) return
  const id = parse(location.hash)
  if (unwinding) {
    unwinding = false
    if (id) { clearRoute(); return }
  }
  if (id) {
    const st = history.state
    // Entrée déjà vue (Retour / Suivant) : sa profondeur est dans son état ; nouvelle entrée : on la marque.
    if (st && st.nvRoute) depth = st.nvRoute
    else {
      depth = projectId.value ? depth + 1 : 1
      history.replaceState({ ...(st || {}), nvRoute: depth }, '')
    }
  } else depth = 0
  projectId.value = id
}

export function closeProject() {
  if (!projectId.value || unwinding) return
  if (depth > 0) {
    unwinding = true
    history.go(-depth)
    // Filet : si aucun hashchange n'arrive (historique inattendu), on referme sur place.
    setTimeout(() => { if (unwinding) { unwinding = false; if (parse(location.hash)) clearRoute() } }, 600)
    return
  }
  clearRoute()
}

export function useProjectRoute() {
  if (!started) {
    started = true
    addEventListener('hashchange', onHashChange)
    // Lien direct : on attend la fin de l'écran de chargement, et que Lenis ait redémarré (il réagit aussi à pageReady).
    pageReady.then(() => setTimeout(() => {
      ready = true
      depth = 0
      projectId.value = parse(location.hash)
    }))
  }
  return { projectId, closeProject, projectHref }
}
