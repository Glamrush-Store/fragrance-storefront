# Strapi v5 Media & Upload

## Image URL Structure

Strapi stores uploads at `/uploads/`. URLs in the API response are **relative paths**:
```json
"image": {
  "id": 12,
  "url": "/uploads/hero_abc123.jpg",
  "alternativeText": "Hero banner",
  "width": 1920,
  "height": 800,
  "formats": {
    "thumbnail": { "url": "/uploads/thumbnail_hero_abc123.jpg", "width": 245, "height": 103 },
    "small":     { "url": "/uploads/small_hero_abc123.jpg",     "width": 500 },
    "medium":    { "url": "/uploads/medium_hero_abc123.jpg",    "width": 750 },
    "large":     { "url": "/uploads/large_hero_abc123.jpg",     "width": 1000 }
  }
}
```

## Constructing Full URLs in Nuxt

Prepend `NUXT_PUBLIC_STRAPI_URL` to relative paths:
```js
// composables/useStrapiMedia.js
export function useStrapiMedia(path) {
  const config = useRuntimeConfig()
  if (!path) return ''
  if (path.startsWith('http')) return path   // already absolute (cloud provider)
  return `${config.public.strapiUrl}${path}`
}
```

Usage:
```vue
<NuxtImg :src="useStrapiMedia(product.image?.url)" :alt="product.image?.alternativeText" />
```

## With @nuxt/image

Configure Strapi as a provider in `nuxt.config.ts`:
```js
image: {
  strapi: {
    baseURL: process.env.NUXT_PUBLIC_STRAPI_URL + '/uploads/',
  },
},
```

Then use the `strapi` provider:
```vue
<NuxtImg
  provider="strapi"
  :src="product.image?.url"
  :alt="product.image?.alternativeText"
  :width="product.image?.width"
  :height="product.image?.height"
  sizes="sm:100vw md:50vw lg:400px"
/>
```

## Responsive Formats

Prefer `formats.large` for hero images, `formats.medium` for cards, `formats.thumbnail` for avatars:
```js
function getStrapiImageSrc(image, format = null) {
  if (!image) return ''
  const url = format ? image.formats?.[format]?.url ?? image.url : image.url
  return useStrapiMedia(url)
}
```

## Cloud Providers (Production)

When using Cloudinary, AWS S3, or similar, Strapi stores the full absolute URL. The `url` field will start with `https://` — no prefix needed. The `useStrapiMedia` helper above handles this automatically.

## Populate Fields for Media
Always populate specific fields to avoid over-fetching:
```
populate[image][fields][0]=url
populate[image][fields][1]=alternativeText
populate[image][fields][2]=width
populate[image][fields][3]=height
populate[image][fields][4]=formats
```
