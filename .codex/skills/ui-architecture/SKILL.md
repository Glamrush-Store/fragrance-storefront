---
name: ui-architecture
description: Define a clean, scalable, and future-proof UI architecture blueprint for the Glamrush ecommerce storefront built with Nuxt 3. This document serves as a design and structural guide for AI-assisted development, ensuring consistency, performance, and maintainability.
---



# 1. Core Stack

## Framework
- Nuxt 3

## UI Primitives
- Nuxt UI (wrapped internally)

## Styling
- Tailwind CSS
- Centralized design tokens

## State Management
- Pinia

## Validation
- Zod
- VeeValidate

## Images
- Nuxt Image

## API Layer
- Custom composables (abstracted service layer)

---

# 2. Design System Foundation

## Design Tokens

All visual identity must be controlled via centralized tokens.

Example structure:

```
assets/styles/tokens.ts
```

```ts
export const colors = {
  primary: '#111111',
  accent: '#C89B3C',
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    900: '#0F0F0F'
  }
}

export const spacing = {
  section: '6rem',
  container: '1280px'
}
```

### Rules
- No hardcoded colors in components
- No inline spacing values
- Tokens must map into Tailwind config
- All reusable components consume tokens

---

# 3. Folder Structure

```
components/
  ui/                   # Wrapped Nuxt UI primitives
  layout/
    Header.vue
    Footer.vue
    Container.vue
  product/
    ProductCard.vue
    ProductGrid.vue
    ProductFilters.vue
    ProductBadge.vue
  product/filters/
    FilterSection.vue
    FilterCheckboxGroup.vue
    FilterPriceRange.vue
  cart/
    CartDrawer.vue
    CartItem.vue
  checkout/
    CheckoutLayout.vue
    CheckoutForm.vue
    OrderSummary.vue
```

## Critical Rule

Never import Nuxt UI components directly in pages.

Always wrap them in `components/ui/` to:
- Maintain abstraction
- Allow future UI library replacement
- Enforce design consistency

---

# 4. Header Architecture

## Structure
- Logo (left)
- Navigation (center)
- Search
- Account
- Cart indicator

## Requirements
- Sticky on scroll
- Transparent to solid background transition
- Mobile drawer navigation
- Category mega menu support

## Cart Indicator
- Live item count from Pinia
- Reactive badge
- Opens CartDrawer

---

# 5. Product Grid System

## Layout

Desktop:
- 4 columns
- 32px gap

Tablet:
- 2 columns

Mobile:
- 1 to 2 columns

## ProductCard Structure

- Image (aspect ratio 4:5)
- Hover image swap
- Brand name
- Product name
- Price
- Discount badge
- Wishlist icon (absolute positioned)

## Interaction Rules
- Subtle hover lift
- Image fade transition
- No heavy shadows
- No excessive animation

---

# 6. Filters Architecture

## Desktop
- Sidebar layout

## Mobile
- Slide-over drawer

## Supported Filters
- Category
- Price range
- Color
- Size
- Availability
- Sorting

## State Rules
- Stored in Pinia
- Synced to URL query params

Example:

```
?color=black&size=m&price=10-100
```

## Goals
- Shareable URLs
- SEO compatibility
- Predictable state restoration

---

# 7. Cart Drawer

## Behavior
- Slide from right
- Overlay background
- Optimistic UI updates
- Real-time subtotal recalculation

## Structure
```
CartDrawer
  CartItem
  OrderSummary
  CheckoutButton
```

## Enhancements
- Free shipping progress indicator
- Inline quantity updates
- Remove item animation
- Optional cross-sell items

---

# 8. Checkout Flow

## Route Options

Option A:
```
/checkout/information
/checkout/shipping
/checkout/payment
/checkout/confirmation
```

Option B:
Single progressive page

## Layout

Desktop:
- Two-column
  - Left: Forms
  - Right: Sticky order summary

Mobile:
- Stacked layout

## Requirements
- Inline validation
- Smart field formatting
- Accessible form components
- Minimal visual noise

---

# 9. Performance Rules

Mandatory optimizations:

- Lazy load images
- Use NuxtImg
- Skeleton loaders
- Route-level code splitting
- API response caching
- Optimistic cart updates
- Avoid blocking layout shifts

---

# 10. Visual Philosophy

Glamrush storefront principles:

- High contrast
- Generous whitespace
- Minimal decorative elements
- Subtle micro-interactions
- Editorial typography
- Neutral palette with warm accent

No gradients.
No bulky UI components.
No dashboard-like aesthetics.

---

# 11. Future-Proofing

Design must support:

- Multi-currency
- Multi-language
- Headless CMS blocks
- Feature flags
- Wishlist system
- Recently viewed tracking
- A/B testing
- High SKU volume scaling

## Architectural Separation

- UI handles rendering
- Stores manage state
- Services handle API logic
- Pages orchestrate composition

---

# 12. Guiding Principles

1. Abstraction over convenience
2. Design consistency over speed hacks
3. Performance over decoration
4. Composition over duplication
5. Scalability from day one

---

End of Skill Definition.