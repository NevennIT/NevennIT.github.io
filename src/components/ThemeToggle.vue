<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

// Lune en sombre, soleil en clair ; l'étiquette annonce l'action. Un seul par page (id du masque).
const { theme, toggle } = useTheme()
const label = computed(() => (theme.value === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'))
</script>

<template>
  <button class="nv-toggle" type="button" :aria-label="label" @click="toggle($event.currentTarget)">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <mask id="nv-moon">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" />
        <circle class="nv-toggle__cut" cx="17" cy="7" r="5" fill="#000" />
      </mask>
      <circle class="nv-toggle__core" cx="12" cy="12" r="5" mask="url(#nv-moon)" />
      <g class="nv-toggle__rays">
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </g>
    </svg>
  </button>
</template>
