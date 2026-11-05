import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Site utilisateur GitHub Pages (nevennit.github.io) : servi à la racine.
export default defineConfig({
  base: '/',
  plugins: [vue(),vueDevTools()],
  devtools: {
    apply: 'serve',
    builtinDevTools: false,
    embeddedVisibility: 'passive',
    dockPreferences: {
      defaultMode: 'edge',
      defaultPosition: 'bottom',
    },
  },
})
