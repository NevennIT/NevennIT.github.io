<script setup>
import SectionHeader from './SectionHeader.vue'
import { experiences, education, skills } from '../data/parcours'
import { t, tr } from '../i18n'

// « 02 — Parcours » : frise des expériences, formation, compétences par familles (contenu : src/data/parcours.js).
</script>

<template>
  <section id="parcours" class="nv-section" aria-labelledby="parcours-title">
    <div class="nv-container">
      <SectionHeader id="parcours-title" index="02" :label="t('parcours.label')" :title="t('parcours.title')" :lead="t('parcours.lead')" />

      <div class="nv-parcours">
        <div class="nv-parcours__main">
          <h3 v-reveal:fade class="nv-parcours__h label">{{ t('parcours.experience') }}</h3>
          <ol class="nv-timeline">
            <li v-for="(xp, i) in experiences" :key="i" v-reveal:rise="i * 80" class="nv-timeline__item" :class="{ 'is-todo': xp.todo }">
              <p class="nv-timeline__period label">{{ tr(xp.period) }}</p>
              <h4 class="nv-timeline__role title">{{ tr(xp.role) }}</h4>
              <p class="nv-timeline__org small">{{ tr(xp.org) }}<template v-if="xp.place"> · {{ tr(xp.place) }}</template></p>
              <p v-if="xp.text" class="nv-timeline__text body">{{ tr(xp.text) }}</p>
              <ul v-if="xp.tags && xp.tags.length" class="nv-tags">
                <li v-for="tag in xp.tags" :key="tag" class="nv-tag label">{{ tag }}</li>
              </ul>
              <span v-if="xp.todo" class="nv-todo label">{{ t('parcours.todo') }}</span>
            </li>
          </ol>
        </div>

        <aside class="nv-parcours__side">
          <h3 v-reveal:fade class="nv-parcours__h label">{{ t('parcours.education') }}</h3>
          <ul class="nv-parcours__list">
            <li v-for="(ed, i) in education" :key="i" v-reveal="i * 80" class="nv-parcours__edu" :class="{ 'is-todo': ed.todo }">
              <p class="label nv-timeline__period">{{ tr(ed.period) }}</p>
              <p class="nv-parcours__edu-title">{{ tr(ed.title) }}</p>
              <p class="small nv-timeline__org">{{ tr(ed.org) }}</p>
              <span v-if="ed.todo" class="nv-todo label">{{ t('parcours.todo') }}</span>
            </li>
          </ul>

          <h3 v-reveal:fade class="nv-parcours__h label">{{ t('parcours.skills') }}</h3>
          <dl class="nv-skills">
            <div v-for="(s, i) in skills" :key="i" v-reveal="i * 60" class="nv-skills__group">
              <dt class="small">{{ tr(s.group) }}</dt>
              <dd>
                <ul class="nv-tags">
                  <li v-for="item in s.items" :key="item" class="nv-tag label">{{ item }}</li>
                </ul>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  </section>
</template>
