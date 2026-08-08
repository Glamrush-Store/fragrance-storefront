---
name: strapi-integration
description: use when you want to integrate with strapi, get data from strapi, create or update data in strapi. fetch content from strapi
---

### 1. Strapi Homepage Hero response

- **Endpoint**: GET /pages?filters[slug][$eq]=home&populate[blocks][populate]=\*
- **Status Code**: 200 OK
- **Message**: "Hero Banner data retrieved successfully"
- **payload**: {
  "data": [
  {
  "id": 4,
  "documentId": "ui022hadabhkye30g6zig6s4",
  "createdAt": "2026-02-23T00:04:05.708Z",
  "updatedAt": "2026-02-23T13:19:24.702Z",
  "publishedAt": "2026-02-23T13:19:24.808Z",
  "slug": "home",
  "blocks": [
  {
  "\_\_component": "blocks.hero-banner",
  "id": 4,
  "title": "Reclaim Your Presence",
  "subtitle": "New Season",
  "backgroundImage": [
  {
  "id": 17,
  "documentId": "lzfimyjkhyiypic82anjrh5c",
  "name": "pretty-woman-in-black-vampire-costume-on-orange-background-celebrate-halloween-concept-horizontal-banner-template-photo.jpg",
  "alternativeText": "Woman with dark wavy hair, red lipstick, and black top against orange background.",
  "caption": "A striking woman with retro dark waves and bold red lips poses confidently in a chic black top against a vibrant orange background.",
  "focalPoint": null,
  "width": 561,
  "height": 350,
  "formats": {
  "small": {
  "ext": ".jpg",
  "url": "/uploads/small_pretty_woman_in_black_vampire_costume_on_orange_background_celebrate_halloween_concept_horizontal_banner_template_photo_9b7b89ef39.jpg",
  "hash": "small_pretty_woman_in_black_vampire_costume_on_orange_background_celebrate_halloween_concept_horizontal_banner_template_photo_9b7b89ef39",
  "mime": "image/jpeg",
  "name": "small_pretty-woman-in-black-vampire-costume-on-orange-background-celebrate-halloween-concept-horizontal-banner-template-photo.jpg",
  "path": null,
  "size": 15.61,
  "width": 500,
  "height": 312,
  "sizeInBytes": 15610
  },
  "thumbnail": {
  "ext": ".jpg",
  "url": "/uploads/thumbnail_pretty_woman_in_black_vampire_costume_on_orange_background_celebrate_halloween_concept_horizontal_banner_template_photo_9b7b89ef39.jpg",
  "hash": "thumbnail_pretty_woman_in_black_vampire_costume_on_orange_background_celebrate_halloween_concept_horizontal_banner_template_photo_9b7b89ef39",
  "mime": "image/jpeg",
  "name": "thumbnail_pretty-woman-in-black-vampire-costume-on-orange-background-celebrate-halloween-concept-horizontal-banner-template-photo.jpg",
  "path": null,
  "size": 5.83,
  "width": 245,
  "height": 153,
  "sizeInBytes": 5834
  }
  },
  "hash": "pretty_woman_in_black_vampire_costume_on_orange_background_celebrate_halloween_concept_horizontal_banner_template_photo_9b7b89ef39",
  "ext": ".jpg",
  "mime": "image/jpeg",
  "size": 17.22,
  "url": "/uploads/pretty_woman_in_black_vampire_costume_on_orange_background_celebrate_halloween_concept_horizontal_banner_template_photo_9b7b89ef39.jpg",
  "previewUrl": null,
  "provider": "local",
  "provider_metadata": null,
  "createdAt": "2026-02-23T00:03:07.297Z",
  "updatedAt": "2026-02-23T00:03:16.901Z",
  "publishedAt": "2026-02-23T00:03:07.297Z"
  }
  ],
  "cta": {
  "id": 4,
  "Label": "Shop Now",
  "url": "https://google.com",
  "variant": "primary"
  }
  }
  ]
  }
  ],
  "meta": {
  "pagination": {
  "page": 1,
  "pageSize": 25,
  "pageCount": 1,
  "total": 1
  }
  }
  }

### 1. Strapi Footer content response

- **Endpoint**: footer?populate[columns][populate]=links&populate[socialLinks]=_&populate[bottomLinks]=_
- **Status Code**: 200 OK
- **Message**: ""
- **payload**: {
  "data": {
  "id": 2,
  "documentId": "ah20qpnsnt0tr89u02tlkvpk",
  "createdAt": "2026-02-23T19:54:02.015Z",
  "updatedAt": "2026-02-23T19:54:02.015Z",
  "publishedAt": "2026-02-23T19:54:02.086Z",
  "newsletterTitle": "Join the comunity",
  "newsletterDescription": "Sign up to receive exclusive updates and promotions",
  "newsletterButtonLabel": "Join In",
  "newsletterPlaceholder": "Email",
  "columns": [
  {
  "id": 2,
  "title": "Get Help",
  "links": [
  {
  "id": 9,
  "label": "Help Center",
  "url": "/help"
  },
  {
  "id": 10,
  "label": "Track Orders",
  "url": "/track-orders"
  },
  {
  "id": 11,
  "label": "Shipping Info",
  "url": "/shipping-info"
  },
  {
  "id": 12,
  "label": "Returns",
  "url": "/returns"
  },
  {
  "id": 13,
  "label": "Contact Us",
  "url": "/contact"
  }
  ]
  }
  ],
  "socialLinks": [
  {
  "id": 4,
  "platform": "facebook",
  "url": "https://facebook"
  },
  {
  "id": 5,
  "platform": "twitter",
  "url": "https://twitter.com"
  },
  {
  "id": 6,
  "platform": "instagram",
  "url": "https://instagram.com"
  }
  ],
  "bottomLinks": [
  {
  "id": 14,
  "label": "Privacy Policy",
  "url": "/privacy-policy"
  },
  {
  "id": 15,
  "label": "Terms and Conditions",
  "url": "/terms-conditions"
  },
  {
  "id": 16,
  "label": "Cookie Policy",
  "url": "/cookie-policy"
  }
  ]
  },
  "meta": {}
  }
