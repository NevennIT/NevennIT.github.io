<script setup>
import { TRISKELL } from '../lib/triskell'

// Triskell en volume : le même tracé empilé en profondeur, de flare (face avant) vers le fond (tranche).
const LAYERS = 12
const layers = Array.from({ length: LAYERS }, (_, i) => ({
  i,
  fill: i === 0 ? 'var(--flare)' : `color-mix(in srgb, var(--flare) ${82 - i * 4}%, var(--void))`,
}))
</script>

<template>
  <div class="nv-triskell" role="img" aria-label="Triskell, logo NevennIT">
    <div class="nv-triskell__spin">
      <svg
        v-for="layer in layers"
        :key="layer.i"
        class="nv-triskell__layer"
        :viewBox="TRISKELL.viewBox"
        aria-hidden="true"
        :style="{ '--i': layer.i, fill: layer.fill }"
      >
        <g :transform="TRISKELL.transform"><path :d="TRISKELL.d" /></g>
      </svg>
    </div>
  </div>
</template>
