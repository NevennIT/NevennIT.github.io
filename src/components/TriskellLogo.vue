<script>
// Triskell en volume : le même tracé empilé en profondeur, de flare (face avant) vers le fond (tranche).
// Partagé avec TriskellFlight (le logo qui suit la page).
export const VOLUME_LAYERS = Array.from({ length: 12 }, (_, i) => ({
  i,
  fill: i === 0 ? 'var(--flare)' : `color-mix(in srgb, var(--flare) ${82 - i * 4}%, var(--void))`,
}))
</script>

<script setup>
import { TRISKELL } from '../lib/triskell'

// Version statique (mouvement réduit) : en temps normal, c'est TriskellFlight qui dessine le logo de l'accueil.
const layers = VOLUME_LAYERS
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
