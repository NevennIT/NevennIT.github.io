<script setup>
import { computed } from 'vue'

// En-tête de section : étiquette numérotée, titre qui monte mot à mot, chapeau, filet qui se trace.
const props = defineProps({
  id: String,
  index: { type: String, required: true },
  label: { type: String, required: true },
  title: { type: String, required: true },
  lead: String,
})
const words = computed(() => props.title.split(' '))
</script>

<template>
  <header class="nv-section-head">
    <span v-reveal:fade class="nv-eyebrow label">
      <span class="nv-eyebrow__num">{{ index }}</span><span class="nv-eyebrow__rule" />{{ label }}
    </span>
    <div class="nv-section-head__row">
      <h2 :id="id" v-reveal:split class="nv-section-head__title display-xl" :aria-label="title">
        <template v-for="(word, i) in words" :key="i">
          <span class="nv-w" aria-hidden="true"><span class="nv-w__i" :style="{ '--i': i }">{{ word }}</span></span>{{ ' ' }}
        </template>
      </h2>
      <p v-if="lead" v-reveal="200" class="nv-section-head__lead body">{{ lead }}</p>
    </div>
    <div v-reveal:rule="300" class="nv-section-head__rule" />
  </header>
</template>
