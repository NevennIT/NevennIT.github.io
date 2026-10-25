<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import TriskellMark from './TriskellMark.vue'
import ThemeToggle from './ThemeToggle.vue'
import { navLinks } from '../config'

// Nav flottante : ombre après défilement, repli en descendant, retour en remontant, lien de la section visible actif.
const scrolled = ref(false)
const hidden = ref(false)
const active = ref('')
let last = 0, ticking = false, io = null

function update() {
  ticking = false
  const y = scrollY
  scrolled.value = y > 24
  if (Math.abs(y - last) > 6) { hidden.value = y > last && y > 240; last = y }
}
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update) } }

onMounted(() => {
  addEventListener('scroll', onScroll, { passive: true })
  io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) active.value = '#' + en.target.id
  }, { rootMargin: '-45% 0px -50% 0px' })
  for (const id of ['accueil', ...navLinks.map((l) => l.href.slice(1))]) {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  }
  update()
})
onBeforeUnmount(() => { removeEventListener('scroll', onScroll); if (io) io.disconnect() })
</script>

<template>
  <header class="nv-nav" :class="{ 'is-scrolled': scrolled, 'is-hidden': hidden }" @focusin="hidden = false">
    <a class="nv-wordmark" href="#accueil" aria-label="NevennIT, retour à l'accueil">
      <TriskellMark /><span class="nv-wordmark__text">Nevenn<span class="nv-wordmark__it">IT</span></span>
    </a>
    <nav class="nv-nav__links small" aria-label="Sections">
      <a v-for="link in navLinks" :key="link.href" :href="link.href" :aria-current="active === link.href ? 'true' : undefined">
        {{ link.label }}
      </a>
    </nav>
    <ThemeToggle />
  </header>
</template>
