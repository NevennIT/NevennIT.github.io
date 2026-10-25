<script setup>
import TriskellMark from './TriskellMark.vue'
import BaseButton from './BaseButton.vue'
import { site } from '../config'

const year = new Date().getFullYear()
</script>

<template>
  <footer v-progress:enter class="nv-footer">
    <div class="nv-container">
      <div class="nv-footer__row">
        <a class="nv-wordmark" href="#accueil" aria-label="NevennIT, retour à l'accueil">
          <TriskellMark /><span class="nv-wordmark__text">Nevenn<span class="nv-wordmark__it">IT</span></span>
        </a>
        <nav class="nv-footer__links small" aria-label="Liens">
          <a class="nv-link" :href="site.github" target="_blank" rel="noopener">GitHub</a>
        </nav>
        <p class="nv-footer__meta small">© {{ year }} NevennIT · Hébergé sur GitHub Pages</p>
        <BaseButton href="#accueil" label="Haut de page" icon="arrow-up" />
      </div>
    </div>
    <p class="nv-footer__giant" aria-hidden="true">NevennIT</p>
  </footer>
</template>
