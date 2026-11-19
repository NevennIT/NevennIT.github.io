<script setup>
import { locale, toggleLocale, t } from '../i18n'

// Bascule FR/EN : affiche la langue proposée ; l'étiquette annonce l'action dans la langue cible.
</script>

<template>
  <button class="nv-toggle nv-toggle--lang label" type="button" :aria-label="t('lang.switch')" :lang="locale === 'fr' ? 'en' : 'fr'" @click="toggleLocale">
    {{ t('lang.short') }}
  </button>
</template>
