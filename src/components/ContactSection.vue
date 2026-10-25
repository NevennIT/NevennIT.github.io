<script setup>
import { reactive, ref, watch } from 'vue'
import TextField from './TextField.vue'
import BaseButton from './BaseButton.vue'
import { site } from '../config'

// Formulaire de contact : validation à l'envoi, puis envoi en fetch vers le service (GitHub Pages est statique).
const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const state = ref('idle') // idle | sending | sent | error
const status = ref('')

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const rules = {
  name: (v) => (v.trim() ? '' : 'Indiquez votre nom.'),
  email: (v) => (EMAIL.test(v.trim()) ? '' : 'Adresse e-mail invalide.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Écrivez quelques mots (10 caractères au moins).'),
}

// Une erreur affichée disparaît dès que le champ devient valide.
for (const key of Object.keys(rules)) {
  watch(() => form[key], (v) => { if (errors[key]) errors[key] = rules[key](v) })
}

function setState(next, text) { state.value = next; status.value = text }

async function submit(e) {
  if (state.value === 'sending') return
  for (const key of Object.keys(rules)) errors[key] = rules[key](form[key])
  const firstInvalid = Object.keys(rules).find((key) => errors[key])
  if (firstInvalid) {
    document.getElementById('contact-' + firstInvalid).focus()
    setState('error', 'Vérifiez les champs signalés.')
    return
  }
  if (!site.formEndpoint) {
    setState('error', "Le formulaire n'est pas encore relié à un service d'envoi.")
    return
  }
  setState('sending', 'Envoi en cours…')
  try {
    const res = await fetch(site.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(e.target) })
    if (!res.ok) throw new Error(String(res.status))
    form.name = form.email = form.message = ''
    setState('sent', 'Message envoyé. Merci, je reviens vers vous rapidement.')
  } catch {
    setState('error', "L'envoi a échoué. Réessayez dans un instant.")
  }
}
</script>

<template>
  <section id="contact" class="nv-section" aria-labelledby="contact-title">
    <div class="nv-container">
      <div class="nv-contact">
        <div class="nv-contact__intro">
          <span v-reveal:fade class="nv-eyebrow label"><span class="nv-eyebrow__num">02</span><span class="nv-eyebrow__rule" />Contact</span>
          <h2 id="contact-title" v-reveal class="nv-contact__title display-l">Parlons de votre projet</h2>
          <p v-reveal="150" class="nv-contact__lead lead">Une idée, un besoin, une question : écrivez-moi, je réponds personnellement.</p>
        </div>
        <form
          v-reveal:rise="100"
          class="nv-contact__form"
          :data-state="state"
          :action="site.formEndpoint || undefined"
          method="POST"
          novalidate
          @submit.prevent="submit"
        >
          <div class="nv-contact__row">
            <TextField id="contact-name" v-model="form.name" label="Nom" name="name" required autocomplete="name" placeholder="Camille Martin" :error="errors.name" />
            <TextField id="contact-email" v-model="form.email" label="E-mail" name="email" type="email" required autocomplete="email" placeholder="nom@domaine.fr" :error="errors.email" />
          </div>
          <TextField id="contact-message" v-model="form.message" label="Message" name="message" multiline required placeholder="Quelques lignes sur votre projet." :error="errors.message" />
          <!-- Champ piège anti-spam (Formspree) : invisible, laissé vide par les humains. -->
          <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" hidden />
          <div class="nv-contact__foot">
            <p class="nv-status small" role="status" aria-live="polite">{{ status }}</p>
            <BaseButton type="submit" variant="primary" label="Envoyer" icon="send" :disabled="state === 'sending'" />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
