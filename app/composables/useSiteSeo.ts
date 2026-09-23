import type { MaybeRefOrGetter } from 'vue'

const normalizePath = (path: string): string => {
  const pathname = path.split('?')[0]?.split('#')[0] || '/'
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
}

export const useSiteSeo = () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')

  const absoluteUrl = (path = '/') => {
    try {
      return new URL(path, `${siteUrl}/`).toString()
    }
    catch {
      return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
    }
  }

  const canonicalUrl = computed(() => {
    const page = Number(route.query.page)
    const suffix = Number.isInteger(page) && page > 1 ? `?page=${page}` : ''
    return `${absoluteUrl(normalizePath(route.path))}${suffix}`
  })

  return { absoluteUrl, canonicalUrl, siteUrl }
}

export const useJsonLd = (key: string, data: MaybeRefOrGetter<unknown>) => {
  useHead(() => ({
    script: [{
      key,
      type: 'application/ld+json',
      textContent: JSON.stringify(toValue(data)).replace(/</g, '\\u003c'),
    }],
  }))
}

export const seoPlainText = (value?: string | null): string => (value || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
