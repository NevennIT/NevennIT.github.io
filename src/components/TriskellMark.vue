<script setup>
import { TRISKELL } from '../lib/triskell'
</script>

<template>
  <svg class="nv-triskell-mark" :viewBox="TRISKELL.viewBox" aria-hidden="true">
    <g :transform="TRISKELL.transform"><path :d="TRISKELL.d" /></g>
  </svg>
</template>
