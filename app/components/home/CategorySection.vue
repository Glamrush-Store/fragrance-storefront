<script setup lang="ts">
import type { Category, HomepageSection } from '~/types/catalog'
import { applyCatalogImageFallback } from '~/utils/catalog'

const props = defineProps<{ section: HomepageSection }>()
const categories = computed(() => props.section.items
  .filter((item): item is Category => !('price' in item))
  .slice(0, 6))
const fallbacks = [
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85',
]
</script>

<template>
  <section v-if="categories.length" class="bg-white">
    <div class="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div class="mb-10 border-b border-neutral-200 pb-8">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-glam-gold">The scent cabinet</p>
        <h2 class="font-display text-4xl sm:text-5xl">{{ section.title }}</h2>
        <p v-if="section.subtitle" class="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{{ section.subtitle }}</p>
      </div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6 lg:gap-x-5">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="group min-w-0 text-center"
        >
          <div class="relative aspect-square overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 transition duration-500 group-hover:ring-glam-gold group-hover:ring-offset-4 group-hover:ring-offset-white">
            <img :src="catalogImageUrl(category.images, fallbacks[index % fallbacks.length])" :alt="category.name" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" width="480" height="480" @error="applyCatalogImageFallback($event, fallbacks[index % fallbacks.length])">
          </div>
          <h3 class="mt-5 truncate font-display text-xl leading-tight text-neutral-950 sm:text-2xl">{{ category.name }}</h3>
          <p v-if="category.product_count !== undefined" class="mt-1 text-[10px] uppercase tracking-[0.12em] text-neutral-400">{{ category.product_count }} products</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
