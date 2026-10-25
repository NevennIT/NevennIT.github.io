<script setup>
import AppIcon from './AppIcon.vue'

// Bouton pilule aimanté : primaire (flare, une seule par écran) ou secondaire (contour). <a> si href, sinon <button>.
const props = defineProps({
  label: { type: String, required: true },
  href: String,
  variant: { type: String, default: 'secondary' },
  size: { type: String, default: 'md' },
  icon: String,
  type: { type: String, default: 'button' },
  disabled: Boolean,
})
const external = props.href && /^https?:/.test(props.href)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    v-magnetic
    class="nv-btn"
    :class="{ 'nv-btn--primary': variant === 'primary', 'nv-btn--lg': size === 'lg' }"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled"
  >
    <span class="nv-btn__label" :data-label="label"><span>{{ label }}</span></span>
    <span v-if="icon" class="nv-btn__icon" aria-hidden="true"><AppIcon :name="icon" /></span>
  </component>
</template>
