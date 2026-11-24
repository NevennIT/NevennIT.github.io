<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import TriskellFlight from './components/TriskellFlight.vue'
import ParcoursSection from './components/ParcoursSection.vue'
import ProjectModal from './components/ProjectModal.vue'
import { sections } from './config'
import { useSmoothScroll } from './composables/useSmoothScroll'

useSmoothScroll()

// Page de suivi (#/suivi) : chargée seulement quand on l'ouvre.
const SuiviPage = defineAsyncComponent(() => import('./components/SuiviPage.vue'))
const suivi = ref(location.hash === '#/suivi')
const onHash = () => { suivi.value = location.hash === '#/suivi' }
onMounted(() => addEventListener('hashchange', onHash))
onBeforeUnmount(() => removeEventListener('hashchange', onHash))
</script>

<template>
  <div class="nv-progress" aria-hidden="true" />
  <NavBar />
  <main>
    <HeroSection />
    <ProjectsSection />
    <!-- 02 — Parcours : masquable dans src/config.js (sections.parcours) ; le contact passe alors de 03 à 02. -->
    <ParcoursSection v-if="sections.parcours" />
    <ContactSection />
  </main>
  <SiteFooter />
  <!-- Triskell qui suit la page : couche fixe, derrière les sections, jamais cliquable. -->
  <TriskellFlight />
  <!-- Fiche projet détaillée : s'ouvre sur #/projet/<id>. -->
  <ProjectModal />
  <SuiviPage v-if="suivi" />
</template>
