<script setup>
import ParticleScene from './ParticleScene.vue'
import TriskellLogo from './TriskellLogo.vue'
import BaseButton from './BaseButton.vue'
import { site } from '../config'
import { reducedMotion } from '../lib/motion'

const year = new Date().getFullYear()
</script>

<template>
  <section id="accueil" v-progress:exit class="nv-hero" aria-labelledby="hero-title">
    <ParticleScene class="nv-hero__scene" />
    <div class="nv-hero__inner">
      <div v-tilt:window class="nv-hero__stage">
        <!-- Emplacement du triskell : TriskellFlight (fixe) s'y pose puis suit la page ; logo statique en mouvement réduit. -->
        <div class="nv-triskell-slot" data-nv-triskell-slot role="img" aria-label="Triskell, logo NevennIT">
          <TriskellLogo v-if="reducedMotion" aria-hidden="true" />
        </div>
        <span class="nv-eyebrow label">Portfolio<span class="nv-eyebrow__rule" />{{ year }}</span>
        <h1 id="hero-title" class="nv-hero__title display-xxl">
          <span class="nv-hero__face">Nevenn<span class="nv-wordmark__it">IT</span></span>
          <span class="nv-hero__echo nv-hero__echo--1" aria-hidden="true">NevennIT</span>
          <span class="nv-hero__echo nv-hero__echo--2" aria-hidden="true">NevennIT</span>
        </h1>
        <p class="nv-hero__lead lead">{{ site.tagline }}</p>
        <div class="nv-hero__actions">
          <BaseButton href="#projets" variant="primary" size="lg" label="Voir les projets" icon="arrow" />
          <BaseButton href="#contact" size="lg" label="Me contacter" />
        </div>
      </div>
    </div>
    <div class="nv-hero__cue label" aria-hidden="true"><span>Défiler</span><span class="nv-hero__cue-track" /></div>
  </section>
</template>
