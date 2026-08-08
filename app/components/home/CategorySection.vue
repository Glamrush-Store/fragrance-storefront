<script setup lang="ts">
import type { Category, HomepageSection } from '~/types/catalog'

const props = defineProps<{ section: HomepageSection }>()
const categories = computed(() => props.section.items.filter((item): item is Category => !('price' in item)))
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
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="(category, index) in categories" :key="category.id" :to="`/category/${category.slug}`" class="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <img :src="catalogImageUrl(category.images, fallbacks[index % fallbacks.length])" :alt="category.name" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" width="800" height="600">
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-6">
            <div><h3 class="font-display text-2xl">{{ category.name }}</h3><p v-if="category.product_count !== undefined" class="mt-1 text-xs text-white/70">{{ category.product_count }} products</p></div>
            <UIcon name="i-lucide-arrow-up-right" class="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
