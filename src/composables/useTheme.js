import { ref } from 'vue'
import { reducedMotion, cssVar, num } from '../lib/motion'

// Thème partagé : data-theme sur <html> (posé avant le rendu par index.html), mémorisé dans localStorage.
const KEY = 'nv-theme'
const root = document.documentElement
const theme = ref(root.dataset.theme === 'light' ? 'light' : 'dark')

function apply(id) {
  root.dataset.theme = id
  theme.value = id
  try { localStorage.setItem(KEY, id) } catch (e) { /* stockage indisponible : le thème vaut pour la visite */ }
}

// Bascule en cercle depuis le bouton (View Transitions) ; immédiate sans support ou en mouvement réduit.
function setTheme(id, origin) {
  if (!document.startViewTransition || reducedMotion || !origin) { apply(id); return }
  const r = origin.getBoundingClientRect()
  const x = r.left + r.width / 2, y = r.top + r.height / 2
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const t = document.startViewTransition(() => apply(id))
  t.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: num('--dur-3', 700), easing: cssVar('--ease-out') || 'ease-out', pseudoElement: '::view-transition-new(root)' },
    )
  }).catch(() => {})
}

export function useTheme() {
  return {
    theme,
    toggle: (origin) => setTheme(theme.value === 'dark' ? 'light' : 'dark', origin),
  }
}
