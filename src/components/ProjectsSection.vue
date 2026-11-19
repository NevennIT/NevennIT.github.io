<script setup>
import { computed, reactive } from 'vue'
import SectionHeader from './SectionHeader.vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects'
import { t } from '../i18n'

// Filtres : un choix par famille (type, technologie, statut), « Tous » par défaut. Les options viennent des données ;
// une famille qui n'a qu'une valeur n'est pas proposée.
const filters = reactive({ type: '', tech: '', status: '' })
const uniq = (list) => [...new Set(list)]
const groups = computed(() => [
  { key: 'type', options: uniq(projects.map((p) => p.type)).map((v) => ({ value: v, label: t('type.' + v) })) },
  { key: 'tech', options: uniq(projects.flatMap((p) => p.tags)).sort((a, b) => a.localeCompare(b)).map((v) => ({ value: v, label: v })) },
  { key: 'status', options: uniq(projects.map((p) => p.status)).map((v) => ({ value: v, label: t('status.' + v) })) },
].filter((g) => g.options.length > 1))

const active = computed(() => !!(filters.type || filters.tech || filters.status))
const shown = computed(() => projects.filter((p) =>
  (!filters.type || p.type === filters.type) &&
  (!filters.tech || p.tags.includes(filters.tech)) &&
  (!filters.status || p.status === filters.status)))

const pick = (key, value) => { filters[key] = filters[key] === value ? '' : value }
const reset = () => { filters.type = filters.tech = filters.status = '' }
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

      <div v-reveal:fade class="nv-filters" role="group" :aria-label="t('filters.label')">
        <div v-for="g in groups" :key="g.key" class="nv-filters__group" role="group" :aria-labelledby="'filter-' + g.key">
          <span :id="'filter-' + g.key" class="nv-filters__label label">{{ t('filters.' + g.key) }}</span>
          <div class="nv-filters__options">
            <button type="button" class="nv-tag label" :aria-pressed="!filters[g.key] ? 'true' : 'false'" @click="filters[g.key] = ''">
              {{ t('filters.all') }}
            </button>
            <button
              v-for="o in g.options"
              :key="o.value"
              type="button"
              class="nv-tag label"
              :aria-pressed="filters[g.key] === o.value ? 'true' : 'false'"
              @click="pick(g.key, o.value)"
            >
              {{ o.label }}
            </button>
          </div>
        </div>
      </div>

      <TransitionGroup tag="ul" name="nv-grid" class="nv-grid">
        <li
          v-for="(project, i) in shown"
          :key="project.id"
          v-reveal:rise="project.feature ? 0 : (i % 2) * 90"
          :class="{ 'nv-grid__wide': project.feature && !active }"
        >
          <ProjectCard :project="project" :index="projects.indexOf(project)" />
        </li>
      </TransitionGroup>

      <div v-if="!shown.length" class="nv-filters__empty" role="status">
        <p class="body">{{ t('projects.empty') }}</p>
        <button type="button" class="nv-tag label" @click="reset">{{ t('projects.reset') }}</button>
      </div>
    </div>
  </section>
</template>
