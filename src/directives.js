// Directives Vue qui branchent les effets du design system sur le DOM.
//   v-tilt            inclinaison au survol (cartes)     v-tilt:window="22"  suit toute la fenêtre, 22deg max
//   v-magnetic        aimant (boutons)                   v-magnetic="false"  désactivé
//   v-reveal          apparition à l'entrée dans l'écran  v-reveal:rise="90"  mode (fade, rise, rule, split) et délai en ms
//   v-progress        --p de 0 à 1 au défilement         v-progress:enter    mode (exit, enter, through)
import { tilt, magnetic, progress, reducedMotion } from './lib/motion'

const off = new WeakMap()
const stop = (el) => { const fn = off.get(el); if (fn) fn(); off.delete(el) }

export const vTilt = {
  mounted(el, { arg, value }) {
    off.set(el, tilt(el, { track: arg === 'window' ? 'window' : 'self', max: typeof value === 'number' ? value : undefined }))
  },
  unmounted: stop,
}

export const vMagnetic = {
  mounted(el, { value }) {
    if (value === false) return
    off.set(el, magnetic(el, { strength: typeof value === 'number' ? value : undefined }))
  },
  unmounted: stop,
}

export const vProgress = {
  mounted(el, { arg }) { off.set(el, progress(el, arg)) },
  unmounted: stop,
}

let io = null
function revealObserver() {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue
        en.target.classList.add('is-in')
        io.unobserve(en.target)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 })
  }
  return io
}

export const vReveal = {
  mounted(el, { arg, value }) {
    el.setAttribute('data-nv-reveal', arg || '')
    if (value) el.style.setProperty('--delay', value + 'ms')
    if (reducedMotion || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return }
    revealObserver().observe(el)
  },
  unmounted(el) { if (io) io.unobserve(el) },
}
