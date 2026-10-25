<script setup>
import SectionHeader from './SectionHeader.vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects'
</script>

<template>
  <section id="projets" class="nv-section" aria-labelledby="projets-title">
    <div class="nv-container">
      <SectionHeader
        id="projets-title"
        index="01"
        label="Projets"
        title="Projets réalisés"
        lead="Une sélection de projets informatiques, du prototype à la mise en ligne."
      />
      <ul class="nv-grid">
        <li
          v-for="(project, i) in projects"
          :key="project.id"
          v-reveal:rise="project.feature ? 0 : (i % 2) * 90"
          :class="{ 'nv-grid__wide': project.feature }"
        >
          <ProjectCard :project="project" />
        </li>
      </ul>
    </div>
  </section>
</template>
