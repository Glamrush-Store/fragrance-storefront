interface SitemapCategory {
  slug: string
  children?: SitemapCategory[]
}

interface SitemapProduct {
  slug: string
}

interface ApiEnvelope<T> {
  data: T
  meta?: { current_page: number; last_page: number }
}

const xmlEscape = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const flattenCategories = (categories: SitemapCategory[]): SitemapCategory[] => categories.flatMap(category => [
  category,
  ...flattenCategories(category.children || []),
])

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  const apiBase = String(config.public.apiBase).replace(/\/$/, '')
  const storefront = encodeURIComponent(String(config.public.storefrontSlug))
  const paths = new Set([
    '/',
    '/about-us',
    '/faqs',
    '/contact',
    '/shipping-policy',
    '/returns-and-refunds',
    '/privacy-policy',
    '/terms-and-conditions',
  ])

  try {
    const categories = await $fetch<ApiEnvelope<SitemapCategory[]>>(`${apiBase}/storefronts/${storefront}/categories`, {
      query: { deep: true },
      headers: { Accept: 'application/json' },
    })
    for (const category of flattenCategories(categories.data || [])) {
      if (category.slug) paths.add(`/category/${category.slug}`)
    }

    let page = 1
    let lastPage = 1
    do {
      const products = await $fetch<ApiEnvelope<SitemapProduct[]>>(`${apiBase}/storefronts/${storefront}/products`, {
        query: { page, per_page: 100, sort: 'created_at', direction: 'desc' },
        headers: { Accept: 'application/json' },
      })
      for (const product of products.data || []) {
        if (product.slug) paths.add(`/product/${product.slug}`)
      }
      lastPage = products.meta?.last_page || 1
      page += 1
    } while (page <= lastPage)
  }
  catch (error) {
    console.error('Unable to fully hydrate the storefront sitemap', error)
  }

  const body = [...paths]
    .map(path => `  <url><loc>${xmlEscape(new URL(path, `${siteUrl}/`).toString())}</loc></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600, stale-while-revalidate=86400')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
