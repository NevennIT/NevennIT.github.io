<script setup>
import { computed } from 'vue'

// Champ du formulaire : libellé mono au-dessus, champ creusé, aide ou erreur en dessous.
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'text' },
  multiline: Boolean,
  required: Boolean,
  placeholder: String,
  autocomplete: String,
  hint: String,
  error: String,
})
const model = defineModel({ type: String, default: '' })
const describedBy = computed(() => (props.error ? props.id + '-err' : props.hint ? props.id + '-hint' : undefined))
</script>

<template>
  <div class="nv-field" :class="{ 'is-invalid': error }">
    <label class="nv-field__label label" :for="id">{{ label }} <i v-if="required" aria-hidden="true">*</i></label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      class="nv-field__input"
      :name="name"
      rows="5"
      :required="required"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
      data-lenis-prevent
    />
    <input
      v-else
      :id="id"
      v-model="model"
      class="nv-field__input"
      :type="type"
      :name="name"
      :required="required"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
    />
    <span v-if="error" :id="id + '-err'" class="nv-field__error small">{{ error }}</span>
    <span v-else-if="hint" :id="id + '-hint'" class="nv-field__hint small">{{ hint }}</span>
  </div>
</template>
