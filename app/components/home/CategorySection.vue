<script setup lang="ts">
import type { Category, HomepageSection } from '~/types/catalog'
import { applyCatalogImageFallback } from '~/utils/catalog'

const props = defineProps<{ section: HomepageSection }>()
const categories = computed(() => props.section.items
  .filter((item): item is Category => !('price' in item))
  .slice(0, 4))
const fallbacks = [
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85',
]

const desktopPlacement = [
  'lg:col-start-1 lg:row-start-1 lg:row-span-2',
  'lg:col-start-2 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-2 lg:col-span-2 lg:row-start-2',
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
      <div class="grid gap-4 sm:grid-cols-2 lg:h-[680px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.55fr)_minmax(0,0.55fr)] lg:grid-rows-2">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="group relative aspect-[4/3] overflow-hidden bg-neutral-100 lg:aspect-auto"
          :class="desktopPlacement[index]"
        >
          <img :src="catalogImageUrl(category.images, fallbacks[index % fallbacks.length])" :alt="category.name" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" width="800" height="600" @error="applyCatalogImageFallback($event, fallbacks[index % fallbacks.length])">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent transition duration-500 group-hover:from-black/70" />
          <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-6" :class="index === 0 ? 'lg:p-8' : index === 3 ? 'lg:p-7' : ''">
            <div>
              <h3 class="font-display text-2xl" :class="index === 0 ? 'lg:text-4xl' : index === 3 ? 'lg:text-3xl' : 'lg:text-2xl'">{{ category.name }}</h3>
              <p v-if="category.product_count !== undefined" class="mt-1 text-xs text-white/70">{{ category.product_count }} products</p>
            </div>
            <UIcon name="i-lucide-arrow-up-right" class="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
