<script setup>
import AppIcon from './AppIcon.vue'

// Fiche projet inclinable : capture, méta, titre, une phrase, stack. Toute la carte est cliquable.
const props = defineProps({ project: { type: Object, required: true } })
const external = /^https?:/.test(props.project.href)
</script>

<template>
  <article v-tilt class="nv-card" :class="{ 'nv-card--feature': project.feature }">
    <div class="nv-card__media">
      <img v-if="project.image" :src="project.image" alt="" loading="lazy" width="1600" height="1000" />
      <div v-else class="nv-card__placeholder"><span class="label">Capture 16:10</span></div>
    </div>
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
