<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
import { reducedMotion } from '../lib/motion'
import '../styles/carousel.css'

// Média d'une fiche projet : motif d'attente (aucune image), image fixe (une) ou carrousel (plusieurs).
const props = defineProps({
  images: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  // Rang de la carte dans la grille : décale le défilement d'une carte à l'autre.
  index: { type: Number, default: 0 },
})

const INTERVAL = 2000
// Phase propre à chaque carte (pas d'or) : les carrousels ne glissent jamais ensemble.
const phase = ((props.index * 0.618034) % 1) * INTERVAL

const count = computed(() => props.images.length)
const current = ref(0)
const root = ref(null)
// Images déjà demandées : la première tout de suite, les voisines de l'image affichée ensuite.
const warm = ref(new Set([0]))

let timer = 0, card = null, io = null
let hovered = false, focused = false, visible = !('IntersectionObserver' in window)

function go(i) {
  const n = count.value
  current.value = ((i % n) + n) % n
  schedule()
}
const prev = () => go(current.value - 1)
const next = () => go(current.value + 1)

watch(current, (i) => {
  const n = count.value, s = new Set(warm.value)
  s.add(i); s.add((i + 1) % n); s.add((i - 1 + n) % n)
  warm.value = s
})

// Prochain passage calé sur la phase de la carte, au moins une demi-période après maintenant.
function schedule() {
  clearTimeout(timer)
  timer = 0
  if (count.value < 2 || reducedMotion || hovered || focused || !visible || document.hidden) return
  const now = performance.now()
  let wait = INTERVAL - ((((now - phase) % INTERVAL) + INTERVAL) % INTERVAL)
  if (wait < INTERVAL / 2) wait += INTERVAL
  timer = setTimeout(() => {
    current.value = (current.value + 1) % count.value
    schedule()
  }, wait)
}

const onEnter = (e) => { if (e.pointerType === 'mouse') { hovered = true; schedule() } }
const onLeave = (e) => { if (e.pointerType === 'mouse') { hovered = false; schedule() } }
// Pause tant que le clavier est dans le carrousel (un clic souris ne bloque pas le défilement).
const onFocusIn = (e) => { focused = e.target.matches(':focus-visible'); schedule() }
const onFocusOut = (e) => { if (!root.value || !root.value.contains(e.relatedTarget)) { focused = false; schedule() } }

onMounted(() => {
  if (count.value < 2 || !root.value) return
  card = root.value.closest('.nv-card') || root.value
  card.addEventListener('pointerenter', onEnter)
  card.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', schedule)
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((en) => {
      visible = en[0].isIntersecting
      if (visible) warm.value = new Set([...warm.value, 1 % count.value])
      schedule()
    }, { threshold: 0.35 })
    io.observe(root.value)
  }
  schedule()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  if (io) io.disconnect()
  if (card) {
    card.removeEventListener('pointerenter', onEnter)
    card.removeEventListener('pointerleave', onLeave)
  }
  document.removeEventListener('visibilitychange', schedule)
})
</script>

<template>
  <!-- Une image au plus : média simple, comme avant. -->
  <div v-if="count < 2" class="nv-card__media">
    <img v-if="count" :src="images[0]" alt="" loading="lazy" width="1600" height="1000" />
    <div v-else class="nv-card__placeholder"><span class="label">Capture 16:10</span></div>
  </div>

  <!-- Plusieurs images : le média reste sur lift-1, les commandes passent devant la zone cliquable de la carte. -->
  <div
    v-else
    ref="root"
    class="nv-carousel"
    role="group"
    aria-roledescription="carrousel"
    :aria-label="`Captures du projet ${title}`"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div class="nv-card__media">
      <div class="nv-carousel__track" :style="{ '--i': current }">
        <div
          v-for="(src, i) in images"
          :key="src + i"
          class="nv-carousel__slide"
          :aria-hidden="i === current ? undefined : 'true'"
        >
          <img
            :src="src"
            :alt="`Capture ${i + 1} du projet ${title}`"
            :loading="warm.has(i) ? 'eager' : 'lazy'"
            width="1600"
            height="1000"
          />
        </div>
      </div>
    </div>
    <div class="nv-carousel__ui">
      <button type="button" class="nv-carousel__nav nv-carousel__nav--prev" aria-label="Image précédente" @click.stop.prevent="prev">
        <AppIcon name="chevron-left" />
      </button>
      <button type="button" class="nv-carousel__nav nv-carousel__nav--next" aria-label="Image suivante" @click.stop.prevent="next">
        <AppIcon name="chevron-right" />
      </button>
      <div class="nv-carousel__dots">
        <button
          v-for="(src, i) in images"
          :key="'dot-' + src + i"
          type="button"
          class="nv-carousel__dot"
          :aria-label="`Image ${i + 1} sur ${count}`"
          :aria-current="i === current ? 'true' : undefined"
          @click.stop.prevent="go(i)"
        />
      </div>
    </div>
  </div>
</template>
