// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    'vue-toastification/dist/index.css'
  ],

  build: {
    transpile: ['vue-toastification']
  },

  typescript: {
    typeCheck: false
  },

  compatibilityDate: '2025-04-17'
})