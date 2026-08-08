# Strapi v5 Content Types

## Collection Types
Multiple entries. API ID is plural.
```
/api/products       → Product collection
/api/categories     → Category collection
/api/pages          → Page collection
```

## Single Types
One entry only. API ID is singular.
```
/api/homepage       → Homepage settings
/api/global         → Global site settings (nav, footer, SEO defaults)
```

Fetch:
```
/api/global?populate=*
```

## Components
Reusable field groups. Not standalone endpoints — always embedded in a content type.

Example schema (in content type):
```json
"seo": {
  "type": "component",
  "repeatable": false,
  "component": "shared.seo"
}
```

Response:
```json
"seo": { "metaTitle": "...", "metaDescription": "...", "ogImage": { ... } }
```

## Dynamic Zones
A field that can hold multiple different component types. Used for CMS page builders.

```json
"blocks": {
  "type": "dynamiczone",
  "components": ["blocks.hero", "blocks.product-carousel", "blocks.rich-text", "blocks.banner"]
}
```

Response (each block has `__component`):
```json
"blocks": [
  { "__component": "blocks.hero", "title": "...", "image": { ... } },
  { "__component": "blocks.product-carousel", "products": [ ... ] }
]
```

Use `__component` to resolve the Vue component via `block-registry.js`:
```js
import { resolveBlock } from '~/lib/block-registry'

// In template:
// <component :is="resolveBlock(block.__component)" :block="block" />
```

## Suggested Content Types for Glamrush

| Content Type | Kind | Notes |
|---|---|---|
| `Product` | Collection | title, slug, price, images, category, description |
| `Category` | Collection | name, slug, parent (self-relation) |
| `Page` | Collection | title, slug, blocks (dynamic zone) |
| `Global` | Single | siteName, nav links, footer, defaultSEO |
| `Homepage` | Single | hero, featuredCategories, featuredProducts |
| `Order` | Collection | items, total, status, user relation |

## Naming Conventions
- Content type **display name**: PascalCase (e.g. `ProductCategory`)
- **API ID** (plural): kebab-case (e.g. `product-categories` → `/api/product-categories`)
- Component **category**: kebab-case namespace (e.g. `blocks`, `shared`, `layout`)
- Component **name**: kebab-case (e.g. `blocks.hero`, `shared.seo`)
