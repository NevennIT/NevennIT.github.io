<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import MediaPlayer from './MediaPlayer.vue'
import { t, tr, locale, formatDate } from '../i18n'
import { renderMarkdown } from '../lib/markdown'

// Onglets de la fiche : Aperçu, Fonctionnalités (si la fiche en a), Technique, Versions (si au moins une release).
// Tablist ARIA : flèches gauche/droite, Début/Fin ; activation au déplacement ; panneau en fondu court.
const props = defineProps({
  project: { type: Object, required: true },
  details: { type: Object, default: null },
  // Releases à afficher (les plus récentes d'abord).
  releases: { type: Array, default: () => [] },
})

const d = computed(() => props.details || {})
const list = (v) => (Array.isArray(v) ? v : [])

const overview = computed(() => {
  const o = tr(d.value.overview)
  return list(o).length ? o : [tr(props.project.description)]
})
const features = computed(() => list(d.value.features))
const roadmap = computed(() => list(d.value.roadmap))
const history = computed(() => list(d.value.history))
const stack = computed(() => {
  const s = list(d.value.tech && d.value.tech.stack)
  return s.length ? s : list(props.project.tags).map((name) => ({ name }))
})
const techSections = computed(() => list(d.value.tech && d.value.tech.sections))

const tabs = computed(() =>
  [
    { key: 'overview', show: true },
    { key: 'features', show: features.value.length > 0 },
    { key: 'tech', show: true },
    { key: 'versions', show: props.releases.length > 0 },
  ].filter((x) => x.show).map((x) => x.key),
)

const active = ref('overview')
watch(tabs, (keys) => { if (!keys.includes(active.value)) active.value = keys[0] })

const tabEls = ref({})
const listEl = ref(null)
const ink = ref({ x: 0, w: 0 })

function select(key, focus) {
  active.value = key
  if (focus) nextTick(() => tabEls.value[key] && tabEls.value[key].focus())
}

function onKey(e) {
  const keys = tabs.value, i = keys.indexOf(active.value)
  let next = null
  if (e.key === 'ArrowRight') next = keys[(i + 1) % keys.length]
  else if (e.key === 'ArrowLeft') next = keys[(i - 1 + keys.length) % keys.length]
  else if (e.key === 'Home') next = keys[0]
  else if (e.key === 'End') next = keys[keys.length - 1]
  if (!next) return
  e.preventDefault()
  select(next, true)
}

// Filet sous l'onglet actif : position et largeur mesurées, glissement en transform.
function measure() {
  const el = tabEls.value[active.value]
  if (el) ink.value = { x: el.offsetLeft, w: el.offsetWidth }
  if (el && listEl.value) {
    const l = listEl.value
    if (el.offsetLeft < l.scrollLeft || el.offsetLeft + el.offsetWidth > l.scrollLeft + l.clientWidth) {
      l.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' })
    }
  }
}
watch([active, tabs, locale], () => nextTick(measure), { flush: 'post' })
let ro = null
onMounted(() => {
  measure()
  if ('ResizeObserver' in window && listEl.value) {
    ro = new ResizeObserver(measure)
    ro.observe(listEl.value)
  }
})
onBeforeUnmount(() => ro && ro.disconnect())

const releaseTitle = (r) => (r.name && r.name !== r.tag ? r.name : '')
const notes = (r) => renderMarkdown(r.body)
const historyMedia = (h) => (h.image && typeof h.image === 'object' ? h.image : null)
</script>

<template>
  <div class="nv-tabs">
    <div ref="listEl" class="nv-tabs__list" role="tablist" :aria-label="t('modal.tabs.label')" @keydown="onKey">
      <button
        v-for="key in tabs"
        :id="'nv-tab-' + key"
        :key="key"
        :ref="(el) => { if (el) tabEls[key] = el }"
        type="button"
        role="tab"
        class="nv-tabs__tab"
        :aria-selected="active === key ? 'true' : 'false'"
        :aria-controls="'nv-panel-' + key"
        :tabindex="active === key ? 0 : -1"
        @click="select(key)"
      >
        {{ t('modal.tabs.' + key) }}
      </button>
      <span class="nv-tabs__ink" aria-hidden="true" :style="{ '--x': ink.x + 'px', '--w': ink.w }" />
    </div>

    <!-- Un seul panneau monté ; il entre en fondu court (animation CSS), sans attendre la sortie du précédent. -->
      <!-- Aperçu -->
      <div v-if="active === 'overview'" id="nv-panel-overview" key="overview" class="nv-tabs__panel" role="tabpanel" aria-labelledby="nv-tab-overview" tabindex="0">
        <div class="nv-sheet-prose nv-sheet-prose--lead">
          <p v-for="(p, i) in overview" :key="i" :class="i === 0 ? 'lead' : 'body'">{{ p }}</p>
        </div>

        <section v-if="roadmap.length" class="nv-sheet-block">
          <h3 class="nv-sheet-block__title label">{{ t('modal.roadmap') }}</h3>
          <ul class="nv-roadmap">
            <li v-for="(r, i) in roadmap" :key="i" class="body">{{ tr(r) }}</li>
          </ul>
        </section>

        <section v-if="history.length" class="nv-sheet-block">
          <h3 class="nv-sheet-block__title label">{{ t('modal.history') }}</h3>
          <ol class="nv-history">
            <li v-for="(h, i) in history" :key="i" class="nv-history__item">
              <span class="nv-history__year label">{{ h.year }}</span>
              <div class="nv-history__body">
                <h4 class="nv-history__title">{{ tr(h.title) }}</h4>
                <p class="body">{{ tr(h.text) }}</p>
                <MediaPlayer v-if="historyMedia(h)" class="nv-history__media" :media="historyMedia(h)" :title="tr(h.title)" />
                <img v-else-if="h.image" class="nv-history__media" :src="h.image" :alt="tr(h.title)" loading="lazy" />
              </div>
            </li>
          </ol>
        </section>
      </div>

      <!-- Fonctionnalités -->
      <div v-else-if="active === 'features'" id="nv-panel-features" key="features" class="nv-tabs__panel" role="tabpanel" aria-labelledby="nv-tab-features" tabindex="0">
        <ul class="nv-features">
          <li v-for="(f, i) in features" :key="i" class="nv-feature">
            <span class="nv-feature__num label">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="nv-feature__title">{{ tr(f.title) }}</h3>
            <p class="nv-feature__text small">{{ tr(f.text) }}</p>
          </li>
        </ul>
      </div>

      <!-- Technique -->
      <div v-else-if="active === 'tech'" id="nv-panel-tech" key="tech" class="nv-tabs__panel" role="tabpanel" aria-labelledby="nv-tab-tech" tabindex="0">
        <section class="nv-sheet-block nv-sheet-block--first">
          <h3 class="nv-sheet-block__title label">{{ t('modal.stack') }}</h3>
          <ul class="nv-stack">
            <li v-for="s in stack" :key="s.name" class="nv-stack__item">
              <b>{{ s.name }}</b>
              <span v-if="s.role">{{ tr(s.role) }}</span>
            </li>
          </ul>
        </section>
        <section v-for="(s, i) in techSections" :key="i" class="nv-sheet-block">
          <h3 class="nv-sheet-block__title label">{{ tr(s.title) }}</h3>
          <div class="nv-sheet-prose">
            <p v-for="(p, j) in list(tr(s.text))" :key="j" class="body">{{ p }}</p>
          </div>
        </section>
      </div>

      <!-- Versions -->
      <div v-else-if="active === 'versions'" id="nv-panel-versions" key="versions" class="nv-tabs__panel" role="tabpanel" aria-labelledby="nv-tab-versions" tabindex="0">
        <ol class="nv-releases">
          <li v-for="(r, i) in releases" :key="r.tag" class="nv-release">
            <header class="nv-release__head">
              <span class="nv-release__tag label">{{ r.tag }}</span>
              <span v-if="i === 0" class="nv-tag nv-tag--flare label">{{ t('modal.latestShort') }}</span>
              <span v-if="r.prerelease" class="nv-tag label">{{ t('modal.prerelease') }}</span>
              <time v-if="r.published_at" class="nv-release__date label" :datetime="r.published_at">{{ formatDate(r.published_at) }}</time>
            </header>
            <h4 v-if="releaseTitle(r)" class="nv-release__title">{{ releaseTitle(r) }}</h4>
            <!-- Notes rendues par lib/markdown : HTML échappé, liens http(s) seulement. -->
            <div v-if="r.body" class="nv-sheet-prose nv-md" v-html="notes(r)" />
            <a v-if="r.html_url" class="nv-link small" :href="r.html_url" target="_blank" rel="noopener">{{ t('modal.releasePage') }}</a>
          </li>
        </ol>
      </div>
  </div>
</template>
