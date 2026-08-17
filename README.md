# Glamrush Storefront

The customer-facing Nuxt application for Glamrush. It renders storefront merchandising and catalog experiences, manages customer sessions and carts, and guides shoppers through checkout and payment against the Glamrush Backend Service.

The current default storefront slug is `fragrances`; the same application can target another configured storefront through environment variables.

## Platform context

| Repository | Responsibility |
| --- | --- |
| `glamrush_admin_service` | Catalog, merchandising, content, configuration, and Admin API |
| `glamrush-admin` | Staff administration interface |
| `glamrush_backend_service` | Customer commerce API used by this application |
| `glamrush_storefront` | This customer shopping experience |

The Storefront never connects to the database or Admin Service directly. All browser commerce operations go through the Backend Service.

## Customer experience

- API-driven announcement, navigation, campaign hero, and homepage sections
- Category catalog with search, sorting, pagination, and faceted filters
- Product detail with variant selection, image carousel, variant images, availability, and HTML description
- Quick add with variant selection for variable products
- Guest and authenticated bag with debounced quantity controls
- Email/password and Google authentication with guest-cart merging
- Account addresses, saved items, and order history
- Address-based shipping, discounts, payment methods, checkout, and payment callback status
- Failed-order cart restoration
- Static content pages, FAQs, contact form, and newsletter subscription
- Responsive fallback imagery when catalog media is unavailable

See [Feature catalog](docs/features.md) for details.

## Technology

- Nuxt 4
- Vue 3 and TypeScript
- Nuxt UI
- Tailwind CSS 4
- Lucide icons through Iconify
- SSR-capable rendering and file-based routing

## Local installation

### Prerequisites

- Node.js 20+
- npm
- A running `glamrush_backend_service`
- A populated storefront root and catalog created through the Admin platform

### Setup

```bash
npm install
cp .env.example .env
```

On PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure:

```dotenv
NUXT_PUBLIC_BACKEND_URL=http://localhost:8000
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_STOREFRONT_SLUG=fragrances
NUXT_PUBLIC_GOOGLE_CLIENT_ID=
```

`NUXT_PUBLIC_BACKEND_URL` is the Laravel origin used for `/sanctum/csrf-cookie`; `NUXT_PUBLIC_API_BASE` includes `/api/v1`. The Google client must belong to the same Google project configured by the Backend Service, and the Storefront origin must be an authorized JavaScript origin.

### Run locally

```bash
npm run dev -- --port 3000
```

Open `http://localhost:3000`.

## Build and verification

```bash
npm run build
npm run preview -- --port 3000
```

The repository does not currently define an automated test script. Every change should pass the production build and be manually checked in guest and authenticated states where applicable.

## Authentication

The Storefront uses Sanctum's HttpOnly stateful SPA authentication:

- All API requests include credentials.
- Mutations first obtain `/sanctum/csrf-cookie` and send `X-XSRF-TOKEN`.
- A mutation that receives `419` refreshes CSRF once and retries.
- Server rendering forwards the incoming cookie to the Backend Service.
- No customer bearer token is stored by the application.
- Login, registration, and session hydration attempt to merge an existing guest bag.

Production domains must be configured together:

```dotenv
# Backend Service
SANCTUM_STATEFUL_DOMAINS=fragrance.glamrushstores.com
CORS_ALLOWED_ORIGINS=https://fragrance.glamrushstores.com
SESSION_DOMAIN=.glamrushstores.com
SESSION_SECURE_COOKIE=true
```

Sharing `SESSION_DOMAIN` across trusted sibling storefront subdomains allows a compatible Backend Service session to be recognized across those storefronts. Storefront authorization and catalog scoping still occur server-side.

## Architecture conventions

- All Backend calls go through `app/composables/useApi.ts`.
- Storefront, cart, checkout, authentication, account, location, and content behavior belongs in focused composables.
- Cross-page reactive state uses Nuxt `useState`; guest cart identity uses a cookie.
- Components should remain presentation-focused and emit intent to pages/composables.
- API response types live under `app/types`.
- Never trust prices, availability, discounts, or payment status calculated in the browser.

See [Architecture](docs/architecture.md).

## Repository layout

```text
app/
├── assets/            Global styles
├── components/        Account, auth, cart, catalog, content, home, layout, and product UI
├── composables/        API and feature orchestration
├── middleware/        Customer route protection
├── pages/             Storefront routes
├── types/             API contracts used by the UI
└── utils/             Shared presentation helpers
docs/                  API contract and project documentation
public/                Static assets and fallback imagery
```

## Documentation

- [Architecture](docs/architecture.md)
- [Feature catalog](docs/features.md)
- `docs/api-docs.json` — checked-in Backend API contract/reference

Backend behavior is documented in the sibling Backend Service under `docs/`, including catalog filters, storefront APIs, discounts, content, newsletter, and payment idempotency.

## Deployment notes

The application can run as a Nuxt server or with an appropriate Nitro preset for the selected platform. For Cloudflare, verify SSR compatibility, environment variable injection, cookie forwarding, SPA/API CORS, and payment callback routes before production cutover. Cache hashed assets aggressively; let the Backend Service/CDN headers control API response caching.

Never expose Backend provider secrets or private runtime settings through `NUXT_PUBLIC_*` variables.

## Contribution workflow

1. Confirm the Backend endpoint and response contract.
2. Extend the appropriate type and composable.
3. Build reusable responsive UI with explicit loading, empty, error, and disabled states.
4. Verify keyboard interaction and visible focus states.
5. Test guest/authenticated behavior and mobile/desktop layouts.
6. Run `npm run build` before handoff.
