# Strapi v5 Populate

Strapi v5 returns NO relations by default. You must explicitly populate everything.

## Populate All (shallow)
```
/api/products?populate=*
```
Populates one level of relations. Does not recurse into nested relations.

## Populate Specific Fields
```
/api/products?populate[0]=image&populate[1]=category
```

## Populate Nested Relations
```
/api/products?populate[category][populate][0]=image
```

## Populate Media
Media fields (images, files) are relations. Populate them explicitly:
```
/api/products?populate[image][fields][0]=url&populate[image][fields][1]=alternativeText&populate[image][fields][2]=width&populate[image][fields][3]=height
```

## Dynamic Zones
Dynamic zones need per-component population. Use `on` to target specific components:
```
/api/pages?populate[blocks][on][blocks.hero][populate]=*
/api/pages?populate[blocks][on][blocks.product-carousel][populate][products][populate]=*
```

Or use `populate=*` on the zone with deep populate plugin (if installed):
```
/api/pages?populate[blocks][populate]=*
```

## Components (non-dynamic)
```
/api/products?populate[seo][populate]=*
```

## Practical: Full Page Fetch for CMS Page
```
/api/pages?filters[slug][$eq]=home&populate[blocks][populate]=*
```

## Response: Dynamic Zone Shape
```json
{
  "blocks": [
    {
      "__component": "blocks.hero",
      "id": 1,
      "title": "Welcome",
      "image": { "url": "/uploads/hero.jpg" }
    },
    {
      "__component": "blocks.product-carousel",
      "id": 2,
      "title": "Featured",
      "products": [ ... ]
    }
  ]
}
```
The `__component` field is the key used in `block-registry.js` to resolve Vue components.

## Deep Populate Plugin (optional)
Install `strapi-plugin-populate-deep` on Strapi for simpler `?populate=deep` queries.
```
/api/pages?filters[slug][$eq]=home&populate=deep
```
