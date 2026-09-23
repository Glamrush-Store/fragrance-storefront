// https://nuxt.com/docs/api/configuration/nuxt-config
declare const process: { env: Record<string, string | undefined> }

const apiBase = (process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1').replace(/\/$/, '')
const backendUrl = (process.env.NUXT_PUBLIC_BACKEND_URL || apiBase.replace(/\/api\/v1$/, '')).replace(/\/$/, '')
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const googleAnalyticsId = process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-E3E3SKZEQ9'

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
      siteUrl,
      storefrontSlug: process.env.NUXT_PUBLIC_STOREFRONT_SLUG || 'fragrances',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
  },
  app: {
    head: {
      title: 'Glamrush — Fragrance that stays with you',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'color-scheme', content: 'light' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Italiana&family=Playfair+Display:wght@500;600&display=swap' },
      ],
      script: [
        {
          key: 'google-tag',
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
        },
        {
          key: 'google-tag-config',
          textContent: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${googleAnalyticsId}');`,
        },
      ],
    },
  },
  routeRules: {
    '/account/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/auth/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/checkout/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/payment/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } },
  },
})
