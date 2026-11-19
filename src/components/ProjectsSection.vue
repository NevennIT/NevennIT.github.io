<script setup>
import SectionHeader from './SectionHeader.vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects'
import { t } from '../i18n'
</script>

<template>
  <section id="projets" class="nv-section" aria-labelledby="projets-title">
    <div class="nv-container">
      <SectionHeader
        id="projets-title"
        index="01"
        :label="t('projects.label')"
        :title="t('projects.title')"
        :lead="t('projects.lead')"
      />
      <ul class="nv-grid">
        <li
          v-for="(project, i) in projects"
          :key="project.id"
          v-reveal:rise="project.feature ? 0 : (i % 2) * 90"
          :class="{ 'nv-grid__wide': project.feature }"
        >
          <ProjectCard :project="project" :index="i" />
        </li>
      </ul>
    </div>
  </section>
</template>
