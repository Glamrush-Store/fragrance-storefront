---
name:skills for vanilla JavaScript frontend development
description: Best practices and architectural guidelines for developing the Glamrush Nuxt 3 ecommerce storefront using vanilla JavaScript. This skill covers component structure, state management, styling with Tailwind CSS, CMS block development, data fetching patterns, and performance optimizations while adhering to the project's architectural boundaries and coding standards.
---



# Glamrush Frontend Skill (Vanilla JS)

## Role

You are the frontend architecture assistant for the Glamrush Nuxt 3 ecommerce storefront.

All generated code must follow the constraints defined in schema.md.

The project uses JavaScript only.
Do not use TypeScript.
Do not generate type annotations.
Do not generate interfaces.

---

## Architectural Boundaries

- UI renders only.
- Stores manage state.
- Services handle API communication.
- CMS provides normalized content blocks.
- External UI libraries must be wrapped inside components/ui.
- Pages must not contain business logic.

Never violate these boundaries.

---

## Component Standards

- Use `<script setup>` (JavaScript only).
- Do not use `lang="ts"`.
- Keep components focused and under 300 lines.
- Extract reusable logic into composables.
- Avoid inline anonymous functions in templates.
- Avoid unnecessary reactive state.

---

## Styling Rules

- Use Tailwind utility classes only.
- No inline style attributes.
- No hardcoded color values.
- Consume centralized design tokens.
- Avoid arbitrary Tailwind values unless justified.

---

## State Rules

- All state mutations must occur inside Pinia actions.
- Never mutate store state directly from components.
- Sync filter state with URL query parameters.
- Use optimistic updates for cart operations.
- Keep stores domain-focused and minimal.

---

## CMS Block Rules

- Blocks live in components/blocks.
- Blocks receive normalized props only.
- Blocks must not call APIs directly.
- Blocks must not contain business logic.
- All blocks must be registered in block-registry.
- Blocks must use wrapped UI primitives.

---

## Data Fetching Rules

- Use useAsyncData in pages.
- Use composables for reusable API logic.
- Avoid API calls directly inside UI components.
- Normalize API responses inside service layer.

---

## Performance Expectations

- Use NuxtImg for images.
- Provide width and height attributes.
- Lazy load below-the-fold content.
- Avoid unnecessary watchers.
- Avoid expensive computed properties when not required.

---

## Anti-Patterns

Do not:

- Introduce TypeScript.
- Import Nuxt UI directly into pages.
- Mix API logic with UI rendering.
- Hardcode layout spacing.
- Duplicate logic across components.
- Create global state outside Pinia.

---

## Output Expectations

When generating code:

- Follow existing project patterns.
- Keep code minimal and readable.
- Prefer composition over invention.
- Avoid introducing new abstractions without need.
- Respect schema.md constraints at all times.