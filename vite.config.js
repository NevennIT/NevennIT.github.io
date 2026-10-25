import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Site utilisateur GitHub Pages (nevennit.github.io) : servi à la racine.
export default defineConfig({
  base: '/',
  plugins: [vue()],
})
