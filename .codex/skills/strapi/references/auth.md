# Strapi v5 Authentication

## API Tokens (Server-side / SSR — preferred for Nuxt SSR)

Generated in Strapi Admin → Settings → API Tokens.

Types:
- **Read-only** — safe for public content fetching
- **Full access** — for admin operations
- **Custom** — scoped to specific endpoints

Usage (set as Authorization header):
```
Authorization: Bearer <api-token>
```

In Nuxt, store in `.env` and access server-side only:
```
STRAPI_API_TOKEN=your-token-here   # server-side only, no NUXT_PUBLIC_ prefix
```

## JWT (Client-side user authentication)

Used with the `users-permissions` plugin for logged-in user actions.

### Register
```
POST /api/auth/local/register
Body: { "username": "...", "email": "...", "password": "..." }
Response: { "jwt": "...", "user": { ... } }
```

### Login
```
POST /api/auth/local
Body: { "identifier": "email@example.com", "password": "..." }
Response: { "jwt": "...", "user": { ... } }
```

### Authenticated Request
```
Authorization: Bearer <jwt>
```

### Current User
```
GET /api/users/me
Authorization: Bearer <jwt>
```

### Password Reset
```
POST /api/auth/forgot-password        { email }
POST /api/auth/reset-password         { code, password, passwordConfirmation }
```

## Nuxt Pattern — Dual Token Strategy

```js
// Server-side (useAsyncData / SSR) → use API token
const config = useRuntimeConfig()
const { data } = await useAsyncData('page', () =>
  $fetch(`${config.strapiUrl}/api/pages`, {
    headers: { Authorization: `Bearer ${config.strapiToken}` },
  })
)

// Client-side user action (cart, wishlist) → use JWT from store/cookie
const userStore = useUserStore()
await $fetch(`${config.public.strapiUrl}/api/orders`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${userStore.jwt}` },
  body: { ... },
})
```
