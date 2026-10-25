<script setup>
// Icônes du design system : grille 24, trait 1,5px, couleur héritée (.nv-icon).
defineProps({ name: { type: String, required: true } })

const paths = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  send: 'M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z',
}
</script>

<template>
  <svg class="nv-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="paths[name]" /></svg>
</template>
