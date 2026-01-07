// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig:{
    public:{
      api:''
    }
  },

  modules: ['@nuxtjs/tailwindcss'],
    devServer: {
    host: '0.0.0.0'
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.nuxt/**',
          '/proc/**'
        ]
      }
    }
  },
  imports: {
    dirs: ['composables/**','types/**']
  }
})