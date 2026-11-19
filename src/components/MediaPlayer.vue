<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { t, tr } from '../i18n'
import '../styles/modal.css'

// Lecteur vidéo de la fiche projet : fichier local (<video>) ou YouTube / Vimeo en façade « clic pour charger »
// (vignette et bouton ; l'iframe, et donc le service tiers, ne se charge qu'au clic).
// S'insère comme diapositive du média d'en-tête ou dans le contenu. `active` à false : pause et façade remise.
const props = defineProps({
  // { type: 'video', src, poster?, caption?, muted? } | { type: 'youtube', id, poster?, caption? } | { type: 'vimeo', id, poster?, caption? }
  media: { type: Object, required: true },
  active: { type: Boolean, default: true },
  title: { type: String, default: '' },
})

const video = ref(null)
const loaded = ref(false)

const caption = computed(() => tr(props.media.caption) || props.title)
// Identifiants contrôlés avant d'entrer dans une URL.
const ytId = computed(() => (props.media.type === 'youtube' && /^[\w-]{6,20}$/.test(props.media.id) ? props.media.id : ''))
const vimeoId = computed(() => (props.media.type === 'vimeo' && /^\d{3,12}$/.test(String(props.media.id)) ? String(props.media.id) : ''))
const embed = computed(() => !!(ytId.value || vimeoId.value))
const provider = computed(() => (ytId.value ? 'YouTube' : 'Vimeo'))
// Vignette YouTube 16:9 sans bandes (hq720), repli sur hqdefault si la vidéo n'en a pas.
const thumbFallback = ref(false)
const thumb = computed(() => props.media.poster || (ytId.value ? 'https://i.ytimg.com/vi/' + ytId.value + (thumbFallback.value ? '/hqdefault.jpg' : '/hq720.jpg') : ''))
const src = computed(() =>
  ytId.value
    ? 'https://www.youtube-nocookie.com/embed/' + ytId.value + '?autoplay=1&rel=0&modestbranding=1'
    : 'https://player.vimeo.com/video/' + vimeoId.value + '?autoplay=1&dnt=1',
)

function pause() {
  if (video.value && !video.value.paused) video.value.pause()
  loaded.value = false
}

watch(() => props.active, (on) => { if (!on) pause() })
onBeforeUnmount(pause)
defineExpose({ pause })
</script>

<template>
  <div class="nv-player" :class="{ 'is-embed': embed }">
    <video
      v-if="media.type === 'video'"
      ref="video"
      class="nv-player__video"
      :src="media.src"
      :poster="media.poster"
      :muted="!!media.muted"
      :aria-label="caption"
      controls
      playsinline
      preload="metadata"
    />

    <template v-else-if="embed">
      <iframe
        v-if="loaded"
        class="nv-player__frame"
        :src="src"
        :title="caption || provider"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      />
      <button v-else type="button" class="nv-player__facade" :aria-label="t('modal.media.play', { title: caption || provider })" @click="loaded = true">
        <img v-if="thumb" :src="thumb" alt="" loading="lazy" @error="thumbFallback = true" />
        <span class="nv-player__play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
        </span>
        <span class="nv-player__note label">{{ t('modal.media.consent', { provider }) }}</span>
      </button>
    </template>
  </div>
</template>
