<script setup>
import AppIcon from './AppIcon.vue'
import ProjectCarousel from './ProjectCarousel.vue'

// Fiche projet inclinable : captures, méta, titre, une phrase, stack. Toute la carte est cliquable.
const props = defineProps({
  project: { type: Object, required: true },
  // Rang dans la grille : décale le défilement des captures d'une carte à l'autre.
  index: { type: Number, default: 0 },
})
const external = /^https?:/.test(props.project.href)
// `image` : tableau de chemins (une chaîne seule reste acceptée).
const img = props.project.image
const images = (Array.isArray(img) ? img : img ? [img] : []).filter(Boolean)
</script>

<template>
  <article v-tilt class="nv-card" :class="{ 'nv-card--feature': project.feature }">
    <ProjectCarousel :images="images" :title="project.title" :index="index" />
    <div class="nv-card__body">
      <p class="nv-card__meta label"><b>{{ project.year }}</b><span>{{ project.kind }}</span></p>
      <h3 class="nv-card__title title">
        <a :href="project.href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener' : undefined">{{ project.title }}</a>
      </h3>
      <p class="nv-card__text body">{{ project.description }}</p>
      <ul class="nv-tags nv-card__tags">
        <li v-for="tag in project.tags" :key="tag" class="nv-tag label">{{ tag }}</li>
      </ul>
    </div>
    <span class="nv-card__go" aria-hidden="true"><AppIcon name="arrow-up-right" /></span>
    <a
      class="nv-card__hit"
      :href="project.href"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener' : undefined"
      tabindex="-1"
      aria-hidden="true"
    />
  </article>
</template>
