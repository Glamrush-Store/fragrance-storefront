// https://nuxt.com/docs/api/configuration/nuxt-config
declare const process: { env: Record<string, string | undefined> }

const apiBase = (process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1').replace(/\/$/, '')
const backendUrl = (process.env.NUXT_PUBLIC_BACKEND_URL || apiBase.replace(/\/api\/v1$/, '')).replace(/\/$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    public: {
      backendUrl,
      apiBase,
      storefrontSlug: process.env.NUXT_PUBLIC_STOREFRONT_SLUG || 'fragrances',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'color-scheme', content: 'light' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Italiana&family=Playfair+Display:wght@500;600&display=swap' },
      ],
    },
  },
})
