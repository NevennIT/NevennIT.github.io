<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useSmoothScroll } from './composables/useSmoothScroll'

useSmoothScroll()
</script>

<template>
  <div class="nv-progress" aria-hidden="true" />
  <NavBar />
  <main>
    <HeroSection />
    <ProjectsSection />
    <!-- #parcours : le CV complet viendra ici (02 — Parcours ; le contact passera à 03). -->
    <ContactSection />
  </main>
  <SiteFooter />
</template>
