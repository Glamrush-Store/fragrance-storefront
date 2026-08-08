<script setup lang="ts">
import type { Product } from '~/types/catalog'

const props = defineProps<{ product: Product; index: number; accent?: boolean }>()
const emit = defineEmits<{ addToBag: [product: Product, productVariantId?: string | number] }>()

const fallbacks = [
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85',
]
const image = computed(() => catalogImageUrl(props.product.images, fallbacks[props.index % fallbacks.length]))
const pricing = computed(() => productPricing(props.product))
</script>

<template>
  <article class="group min-w-0">
    <div class="relative aspect-[4/5] overflow-hidden bg-neutral-100">
      <NuxtLink :to="`/product/${product.slug}`" class="block h-full" :aria-label="`View ${product.name}`">
        <img :src="image" :alt="product.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" width="720" height="900">
      </NuxtLink>
      <UBadge v-if="pricing.onSale" label="Sale" color="error" class="absolute left-3 top-3 rounded-none" />
      <UButton icon="i-lucide-heart" :aria-label="`Save ${product.name}`" color="neutral" variant="soft" square class="absolute right-3 top-3 rounded-full bg-white/90" />
      <CatalogQuickAdd :product="product" button-class="absolute inset-x-3 bottom-3 rounded-none !text-white md:translate-y-2 md:opacity-0 md:transition md:group-hover:translate-y-0 md:group-hover:opacity-100" @add-to-bag="(item, variantId) => emit('addToBag', item, variantId)" />
    </div>
    <p class="mt-4 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{{ product.brand?.name || 'Glamrush edit' }}</p>
    <h3 class="mt-1 line-clamp-2 text-sm font-medium leading-5">
      <NuxtLink :to="`/product/${product.slug}`" class="hover:underline">{{ product.name }}</NuxtLink>
    </h3>
    <CatalogProductPrice :product="product" :accent="accent" />
  </article>
</template>
