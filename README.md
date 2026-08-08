# Glamrush Storefront

Customer-facing Nuxt storefront for the Glamrush API.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Copy `.env.example` to `.env` and configure:

```dotenv
NUXT_PUBLIC_BACKEND_URL=http://localhost:8000
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_STOREFRONT_SLUG=fragrances
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id
```

`NUXT_PUBLIC_GOOGLE_CLIENT_ID` enables the Google OAuth token popup. The Laravel backend must use credentials from the same Google project. Add each storefront origin, such as `http://localhost:3000`, to the Google OAuth client's authorized JavaScript origins.

## Authentication

The storefront implements the API's documented customer authentication flows:

- Email/password registration and login
- Google access-token exchange through `POST /auth/social/google`
- HttpOnly Sanctum stateful SPA sessions with CSRF protection
- Current-user hydration and logout
- Email password recovery: request code, verify six-digit code, reset password
- Protected `/account` route

All API calls include credentials. Before a mutation, the shared API client obtains
`/sanctum/csrf-cookie`, sends `X-XSRF-TOKEN`, and retries once after an expired-CSRF
`419` response. It does not store or send a Sanctum bearer token.

In production, configure Laravel with the explicit storefront origin, HTTPS-only
cookies, and a shared parent cookie domain when SSR session hydration is required:

```dotenv
SANCTUM_STATEFUL_DOMAINS=shop.glamrush.com
CORS_ALLOWED_ORIGINS=https://shop.glamrush.com
SESSION_DOMAIN=.glamrush.com
SESSION_SECURE_COOKIE=true
```

Registration triggers the backend's welcome-email event. Password reset codes expire after 15 minutes. The backend currently has no customer email-verification endpoint, so the storefront does not present an email-verification step.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
