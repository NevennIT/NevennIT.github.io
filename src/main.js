import { createApp } from 'vue'
import 'lenis/dist/lenis.css'
import './styles/tokens.css'
import './styles/nevennit.css'
import App from './App.vue'
import { vTilt, vMagnetic, vReveal, vProgress } from './directives'

createApp(App)
  .directive('tilt', vTilt)
  .directive('magnetic', vMagnetic)
  .directive('reveal', vReveal)
  .directive('progress', vProgress)
  .mount('#app')
