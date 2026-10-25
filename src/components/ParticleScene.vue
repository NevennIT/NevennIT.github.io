<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { particles } from '../lib/motion'

// Sphère de particules : une seule par page, dispersée par le défilement de son parent.
const canvas = ref(null)
let scene = null
onMounted(() => { scene = particles(canvas.value, { scroll: true }) })
onBeforeUnmount(() => { if (scene) scene.destroy() })
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" />
</template>
