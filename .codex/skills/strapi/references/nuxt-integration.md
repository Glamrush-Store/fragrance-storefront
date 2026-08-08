# Strapi v5 + Nuxt 3 Integration

## Environment Variables (.env)
```bash
# Public (exposed to client)
NUXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Private (server-side only)
STRAPI_API_TOKEN=your-read-only-api-token
```

## nuxt.config.ts — Runtime Config
```js
export default defineNuxtConfig({
  runtimeConfig: {
    strapiToken: '',                       // reads STRAPI_API_TOKEN
    public: {
      strapiUrl: 'http://localhost:1337',  // reads NUXT_PUBLIC_STRAPI_URL
    },
  },
})
```

## Core Composable — useStrapi
Create `composables/useStrapi.js`:
```js
export function useStrapi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.strapiUrl

  async function find(contentType, params = {}) {
    const query = new URLSearchParams(flattenParams(params)).toString()
    return $fetch(`${baseUrl}/api/${contentType}${query ? '?' + query : ''}`, {
      headers: buildHeaders(config),
    })
  }

  async function findOne(contentType, id, params = {}) {
    const query = new URLSearchParams(flattenParams(params)).toString()
    return $fetch(`${baseUrl}/api/${contentType}/${id}${query ? '?' + query : ''}`, {
      headers: buildHeaders(config),
    })
  }

  async function findSingle(contentType, params = {}) {
    const query = new URLSearchParams(flattenParams(params)).toString()
    return $fetch(`${baseUrl}/api/${contentType}${query ? '?' + query : ''}`, {
      headers: buildHeaders(config),
    })
  }

  return { find, findOne, findSingle }
}

function buildHeaders(config) {
  const token = config.strapiToken || config.public.strapiToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Flattens nested params object to query string keys
// e.g. { filters: { slug: { $eq: 'home' } } } → filters[slug][$eq]=home
function flattenParams(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenParams(val, fullKey))
    } else if (Array.isArray(val)) {
      val.forEach((v, i) => {
        if (typeof v === 'object') Object.assign(acc, flattenParams(v, `${fullKey}[${i}]`))
        else acc[`${fullKey}[${i}]`] = v
      })
    } else {
      acc[fullKey] = val
    }
    return acc
  }, {})
}
```

## Fetching in Pages / Composables

### SSR-safe with useAsyncData (preferred)
```js
// pages/index.vue
const { data: page } = await useAsyncData('homepage', () => {
  const { findSingle } = useStrapi()
  return findSingle('homepage', { populate: { blocks: { populate: '*' } } })
})
```

### useCmsPage composable (maps to existing stub)
```js
// composables/cms/useCmsPage.js
export function useCmsPage(slug) {
  const { find } = useStrapi()
  return useAsyncData(`page-${slug}`, () =>
    find('pages', {
      filters: { slug: { $eq: slug } },
      populate: { blocks: { populate: '*' } },
    }).then((res) => res.data?.[0] ?? null)
  )
}
```

### Client-side only (no SSR)
```js
const { data, pending, error } = await useFetch(`${strapiUrl}/api/products`, {
  lazy: true,
})
```

## Key Patterns

### Extract data safely
```js
// Collection list → array
const products = computed(() => data.value?.data ?? [])

// Single entry
const page = computed(() => data.value?.data ?? null)

// Pagination
const total = computed(() => data.value?.meta?.pagination?.total ?? 0)
```

### Error handling
```js
const { data, error } = await useAsyncData('key', () => fetch(...))
if (error.value) throw createError({ statusCode: 404, message: 'Not found' })
```

### Reactivity with route params
```js
const route = useRoute()
const { data } = await useAsyncData(
  () => `product-${route.params.slug}`,
  () => find('products', { filters: { slug: { $eq: route.params.slug } }, populate: '*' }),
  { watch: [() => route.params.slug] }
)
```
