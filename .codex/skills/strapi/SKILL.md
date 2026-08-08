# Strapi v5 + Nuxt 3 Skill

## When to Use
Load this skill for any task involving:
- Fetching data from Strapi (REST API, populate, filters, pagination)
- Strapi content types, dynamic zones, or components
- Authentication with Strapi (API tokens, JWT)
- Nuxt 3 composables that wrap Strapi calls
- Media/image URLs from Strapi upload
- Mapping CMS block types to Vue components

---

## Reference Files
- `references/rest-api.md` — REST endpoints, filtering, sorting, pagination
- `references/populate.md` — Populating relations, media, components, dynamic zones
- `references/auth.md` — API tokens and JWT authentication
- `references/content-types.md` — Collection types, single types, components, dynamic zones
- `references/nuxt-integration.md` — useFetch patterns, composables, SSR hydration
- `references/media.md` — Image URLs, upload plugin, image providers

---

## Quick Rules
- Always use `populate` explicitly — Strapi v5 returns NO relations by default
- Use API tokens (not JWT) for server-side / SSR fetches
- JWT is for authenticated user actions (cart, wishlist, orders)
- Strapi image URLs are relative paths — prepend `STRAPI_URL` for `<NuxtImg>`
- Dynamic zones require `populate[blocks][populate]=*` or deep populate
- Single types use `/api/{singularName}`, collection types use `/api/{pluralName}`
- All responses are wrapped in `{ data, meta }` — access content via `response.data`
- In Nuxt, set `NUXT_PUBLIC_STRAPI_URL` in `.env` and read via `useRuntimeConfig()`
