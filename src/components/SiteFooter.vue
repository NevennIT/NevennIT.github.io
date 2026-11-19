<script setup>
import TriskellMark from './TriskellMark.vue'
import BaseButton from './BaseButton.vue'
import { site } from '../config'
import { t } from '../i18n'

const year = new Date().getFullYear()
</script>

<template>
  <footer v-progress:enter class="nv-footer">
    <div class="nv-container">
      <div class="nv-footer__row">
        <a class="nv-wordmark" href="#accueil" :aria-label="t('a11y.home')">
          <TriskellMark /><span class="nv-wordmark__text">Nevenn<span class="nv-wordmark__it">IT</span></span>
        </a>
        <nav class="nv-footer__links small" :aria-label="t('a11y.links')">
          <a class="nv-link" :href="site.github" target="_blank" rel="noopener">GitHub</a>
          <a class="nv-link" :href="'mailto:' + site.email">{{ t('footer.email') }}</a>
        </nav>
        <p class="nv-footer__meta small">© {{ year }} NevennIT · {{ t('footer.hosted') }}</p>
        <BaseButton href="#accueil" :label="t('footer.top')" icon="arrow-up" />
      </div>
    </div>
    <p class="nv-footer__giant" aria-hidden="true">NevennIT</p>
  </footer>
</template>
