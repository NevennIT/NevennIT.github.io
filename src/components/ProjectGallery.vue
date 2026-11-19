<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import MediaPlayer from './MediaPlayer.vue'
import { t, tr } from '../i18n'
import '../styles/carousel.css'
import '../styles/modal.css'

// Média d'en-tête de la fiche : captures du projet puis médias de la fiche (images, vidéos, YouTube, Vimeo).
// Reprend la piste et les commandes du carrousel des cartes, sans défilement automatique ; flèches du clavier.
const props = defineProps({
  items: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  // Diapositive de départ : celle qu'affichait la carte, pour que le morph soit continu.
  start: { type: Number, default: 0 },
})

const count = computed(() => props.items.length)
const current = ref(Math.min(Math.max(props.start, 0), Math.max(count.value - 1, 0)))
watch(count, (n) => { if (current.value >= n) current.value = Math.max(n - 1, 0) })

function go(i) {
  const n = count.value
  if (n) current.value = ((i % n) + n) % n
}

function onKey(e) {
  if (count.value < 2 || e.target.closest('video, iframe')) return
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(current.value - 1) }
  else if (e.key === 'ArrowRight') { e.preventDefault(); go(current.value + 1) }
}

const caption = computed(() => {
  const it = props.items[current.value]
  return it ? tr(it.caption) : ''
})
const isVideo = (it) => it.type === 'video' || it.type === 'youtube' || it.type === 'vimeo'
</script>

<template>
  <figure
    class="nv-gallery"
    :role="count > 1 ? 'group' : undefined"
    :aria-roledescription="count > 1 ? t('carousel.roledesc') : undefined"
    :aria-label="count > 1 ? t('carousel.group', { title }) : undefined"
    @keydown="onKey"
  >
    <div class="nv-gallery__viewport" data-morph="media">
      <div v-if="!count" class="nv-card__placeholder"><span class="label">{{ t('carousel.placeholder') }}</span></div>
      <div v-else class="nv-carousel__track" :style="{ '--i': current }">
        <div
          v-for="(it, i) in items"
          :key="(it.src || it.id) + i"
          class="nv-carousel__slide nv-gallery__slide"
          :class="{ 'is-active': i === current }"
          :aria-hidden="i === current ? undefined : 'true'"
          :inert="i !== current"
        >
          <MediaPlayer v-if="isVideo(it)" :media="it" :active="i === current" :title="title" />
          <img
            v-else
            :src="it.src"
            :alt="tr(it.caption) || t('carousel.slide', { n: i + 1, title })"
            :loading="Math.abs(i - current) < 2 ? 'eager' : 'lazy'"
            width="1600"
            height="1000"
          />
        </div>
      </div>

      <div v-if="count > 1" class="nv-gallery__ui">
        <button type="button" class="nv-carousel__nav nv-carousel__nav--prev" :aria-label="t('carousel.prev')" @click="go(current - 1)">
          <AppIcon name="chevron-left" />
        </button>
        <button type="button" class="nv-carousel__nav nv-carousel__nav--next" :aria-label="t('carousel.next')" @click="go(current + 1)">
          <AppIcon name="chevron-right" />
        </button>
      </div>
    </div>
    <!-- Légende et billes sous le média (les commandes d'une vidéo occupent le bas de l'image). -->
    <div v-if="caption || count > 1" class="nv-gallery__bar" data-fade>
      <figcaption class="nv-gallery__caption small" aria-live="polite">{{ caption }}</figcaption>
      <div v-if="count > 1" class="nv-carousel__dots">
        <button
          v-for="(it, i) in items"
          :key="'dot-' + i"
          type="button"
          class="nv-carousel__dot"
          :aria-label="t('carousel.dot', { n: i + 1, total: count })"
          :aria-current="i === current ? 'true' : undefined"
          @click="go(i)"
        />
      </div>
    </div>
  </figure>
</template>
