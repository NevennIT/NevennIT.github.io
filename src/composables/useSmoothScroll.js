import { onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'
import { reducedMotion } from '../lib/motion'
import { pageReady } from '../lib/loader'

// Défilement fluide Lenis (natif au tactile et en mouvement réduit), ancres internes, --nv-scroll (0 → 1) sur <html>.
export function useSmoothScroll(options = {}) {
  const root = document.documentElement
  let lenis = null, raf = 0

  function onScroll() {
    const max = root.scrollHeight - innerHeight
    root.style.setProperty('--nv-scroll', max > 0 ? (scrollY / max).toFixed(4) : '0')
  }

  function onClick(e) {
    const a = e.target.closest && e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    const target = id.length > 1 ? document.querySelector(id) : null
    if (!target) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(target, { duration: 1.4 })
    else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    history.replaceState(null, '', id)
  }

  onMounted(() => {
    // Chaque visite commence en haut, sur l'accueil (sauf lien direct vers une section).
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!location.hash) scrollTo(0, 0)
    if (!reducedMotion) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true, ...options })
      const tick = (t) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
      lenis.on('scroll', onScroll)
      // Pas de défilement sous l'écran de chargement.
      lenis.stop()
      pageReady.then(() => lenis && lenis.start())
    } else {
      addEventListener('scroll', onScroll, { passive: true })
    }
    addEventListener('resize', onScroll)
    document.addEventListener('click', onClick)
    onScroll()
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    if (lenis) lenis.destroy()
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onScroll)
    document.removeEventListener('click', onClick)
  })
}
