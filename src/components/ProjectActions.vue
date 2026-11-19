<script setup>
import { computed } from 'vue'
import { t, locale, formatDate } from '../i18n'
import { repoUrl } from '../data/projects'

// Zone d'action de la fiche : version latest, téléchargement (ou « bientôt », ou achat), lien vers le code si le dépôt est public.
const props = defineProps({
  project: { type: Object, required: true },
  // Dernière release connue (build ou API) : { tag, published_at, … } | null
  latest: { type: Object, default: null },
  // Fichier à télécharger : { url, size, name, tag } | null (url seule = page des releases)
  file: { type: Object, default: null },
  platform: { type: String, default: 'Windows' },
})

const dl = computed(() => props.project.download || null)
const version = (tag) => (tag && !/^v/i.test(tag) && /^\d/.test(tag) ? 'v' + tag : tag)

// « 1,8 Mo » / « 1.8 MB »
function size(bytes) {
  if (!bytes) return ''
  const fr = locale.value === 'fr'
  const mb = bytes / 1048576
  const n = mb >= 1 ? mb : bytes / 1024
  const unit = mb >= 1 ? (fr ? 'Mo' : 'MB') : fr ? 'Ko' : 'KB'
  return new Intl.NumberFormat(fr ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 1 }).format(n) + ' ' + unit
}

const fileMeta = computed(() => {
  const f = props.file
  if (!f) return ''
  return [version(f.tag), size(f.size), f.name && f.name.split('.').pop().toUpperCase()].filter(Boolean).join(' · ')
})
</script>

<template>
  <div class="nv-actions">
    <p v-if="latest" class="nv-version label">
      <span class="nv-version__dot" aria-hidden="true" />
      <span class="nv-modal__sr">{{ t('modal.latest') }}</span>
      <b>{{ version(latest.tag) }}</b>
      <span v-if="latest.published_at" aria-hidden="true">·</span>
      <time v-if="latest.published_at" :datetime="latest.published_at">{{ formatDate(latest.published_at) }}</time>
    </p>

    <div class="nv-actions__row">
      <a v-if="dl && dl.releases && file" v-magnetic class="nv-btn nv-btn--primary nv-btn--lg nv-actions__dl" :href="file.url">
        <span class="nv-btn__label" :data-label="t('modal.download', { os: platform })"><span>{{ t('modal.download', { os: platform }) }}</span></span>
        <span class="nv-btn__icon" aria-hidden="true">
          <svg class="nv-icon" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
        </span>
      </a>
      <span v-else-if="dl && dl.soon" class="nv-soon label">{{ t('modal.soon') }}</span>
      <a v-else-if="dl && dl.buy" v-magnetic class="nv-btn nv-btn--primary nv-btn--lg" :href="dl.buy" target="_blank" rel="noopener">
        <span class="nv-btn__label" :data-label="t('modal.buy')"><span>{{ t('modal.buy') }}</span></span>
        <span class="nv-btn__icon" aria-hidden="true">
          <svg class="nv-icon" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" /></svg>
        </span>
      </a>

      <a v-if="project.publicRepo && project.repo" v-magnetic class="nv-btn" :href="repoUrl(project.repo)" target="_blank" rel="noopener">
        <span class="nv-btn__label" :data-label="t('modal.code')"><span>{{ t('modal.code') }}</span></span>
        <span class="nv-btn__icon" aria-hidden="true">
          <svg class="nv-icon" viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" /></svg>
        </span>
      </a>
    </div>

    <template v-if="dl && dl.releases && file">
      <p v-if="fileMeta" class="nv-actions__meta label">{{ fileMeta }}</p>
      <p class="nv-actions__note small">
        <svg class="nv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.5 20h19zM12 10v4.5M12 17.5v.01" /></svg>
        <span>{{ t('modal.smartscreen') }}</span>
      </p>
    </template>
  </div>
</template>
