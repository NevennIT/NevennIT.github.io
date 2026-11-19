import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Site utilisateur GitHub Pages (nevennit.github.io) : servi à la racine.
// Vue DevTools : en développement seulement (le plugin ne s'applique pas au build).
export default defineConfig({
  base: '/',
  plugins: [vue(), vueDevTools()],
})
