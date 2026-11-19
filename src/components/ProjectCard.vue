<script setup>
import AppIcon from './AppIcon.vue'
import ProjectCarousel from './ProjectCarousel.vue'
import { t, tr } from '../i18n'

// Fiche projet inclinable : captures, méta, titre, une phrase, stack. Toute la carte ouvre la fiche détaillée (#/projet/<id>).
const props = defineProps({
  project: { type: Object, required: true },
  // Rang dans la grille : décale le défilement des captures d'une carte à l'autre.
  index: { type: Number, default: 0 },
})
const href = '#/projet/' + props.project.id
// `image` : tableau de chemins (une chaîne seule reste acceptée).
const img = props.project.image
const images = (Array.isArray(img) ? img : img ? [img] : []).filter(Boolean)
</script>

<template>
  <article v-tilt class="nv-card" :class="{ 'nv-card--feature': project.feature }" :data-project="project.id">
    <ProjectCarousel :images="images" :title="project.title" :index="index" />
    <div class="nv-card__body">
      <p class="nv-card__meta label"><b>{{ project.year }}</b><span>{{ t('type.' + project.type) }}</span></p>
      <h3 class="nv-card__title title">
        <a :href="href" :aria-label="t('projects.open', { title: project.title })">{{ project.title }}</a>
        <span v-if="project.status === 'in-progress'" class="nv-tag label nv-tag--progress">{{ t('projects.inProgress') }}</span>
      </h3>
      <p class="nv-card__text body">{{ tr(project.description) }}</p>
      <ul class="nv-tags nv-card__tags">
        <li v-for="tag in project.tags" :key="tag" class="nv-tag label">{{ tag }}</li>
      </ul>
    </div>
    <span class="nv-card__go" aria-hidden="true">
      <AppIcon name="arrow-up-right" />
    </span>
    <a class="nv-card__hit" :href="href" tabindex="-1" aria-hidden="true" />
  </article>
</template>
