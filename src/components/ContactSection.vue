<script setup>
import { reactive, ref, watch } from 'vue'
import TextField from './TextField.vue'
import BaseButton from './BaseButton.vue'
import { site, sections } from '../config'
import { t } from '../i18n'

// Formulaire de contact : validation à l'envoi, puis envoi en fetch vers le service (GitHub Pages est statique).
// Erreurs et statut sont gardés sous forme de clés de traduction : ils suivent un changement de langue.
const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const state = ref('idle') // idle | sending | sent | error
const status = ref('') // clé de traduction (contact.*) ou ''
const num = sections.parcours ? '03' : '02'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const rules = {
  name: (v) => (v.trim() ? '' : 'contact.errName'),
  email: (v) => (EMAIL.test(v.trim()) ? '' : 'contact.errEmail'),
  message: (v) => (v.trim().length >= 10 ? '' : 'contact.errMessage'),
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
    setState('error', 'contact.checkFields')
    return
  }
  if (!site.formEndpoint) {
    setState('error', 'contact.notLinked')
    return
  }
  setState('sending', 'contact.sending')
  try {
    const res = await fetch(site.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(e.target) })
    if (!res.ok) throw new Error(String(res.status))
    form.name = form.email = form.message = ''
    setState('sent', 'contact.sent')
  } catch {
    setState('error', 'contact.failed')
  }
}
</script>

<template>
  <section id="contact" class="nv-section" aria-labelledby="contact-title">
    <div class="nv-container">
      <div class="nv-contact">
        <div class="nv-contact__intro">
          <span v-reveal:fade class="nv-eyebrow label"><span class="nv-eyebrow__num">{{ num }}</span><span class="nv-eyebrow__rule" />{{ t('contact.label') }}</span>
          <h2 id="contact-title" v-reveal class="nv-contact__title display-l">{{ t('contact.title') }}</h2>
          <p v-reveal="150" class="nv-contact__lead lead">{{ t('contact.lead') }}</p>
          <p v-reveal="250" class="nv-contact__mail small">{{ t('contact.orMail') }} <a class="nv-link" :href="'mailto:' + site.email">{{ site.email }}</a></p>
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
            <TextField id="contact-name" v-model="form.name" :label="t('contact.name')" name="name" required autocomplete="name" :placeholder="t('contact.namePh')" :error="errors.name && t(errors.name)" />
            <TextField id="contact-email" v-model="form.email" :label="t('contact.email')" name="email" type="email" required autocomplete="email" :placeholder="t('contact.emailPh')" :error="errors.email && t(errors.email)" />
          </div>
          <TextField id="contact-message" v-model="form.message" :label="t('contact.message')" name="message" multiline required :placeholder="t('contact.messagePh')" :error="errors.message && t(errors.message)" />
          <!-- Champ piège anti-spam (Formspree) : invisible, laissé vide par les humains. -->
          <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" hidden />
          <div class="nv-contact__foot">
            <p class="nv-status small" role="status" aria-live="polite">{{ status && t(status) }}</p>
            <BaseButton type="submit" variant="primary" :label="t('contact.send')" icon="send" :disabled="state === 'sending'" />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
