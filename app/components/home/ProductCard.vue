<script setup lang="ts">
import type { Product } from '~/types/catalog'
import { applyCatalogImageFallback } from '~/utils/catalog'

const props = defineProps<{ product: Product; index: number; accent?: boolean }>()
const emit = defineEmits<{ addToBag: [product: Product, productVariantId?: string | number] }>()

const image = computed(() => catalogImageUrl(props.product.images))
const hasImage = computed(() => hasCatalogImage(props.product.images))
const pricing = computed(() => productPricing(props.product))
</script>

<template>
  <article class="group min-w-0">
    <div class="relative aspect-[4/5] overflow-hidden bg-neutral-100">
      <NuxtLink :to="`/product/${product.slug}`" class="block h-full" :aria-label="`View ${product.name}`">
        <img :src="image" :alt="product.name" class="h-full w-full transition duration-500 group-hover:scale-[1.025]" :class="hasImage ? 'object-cover' : 'object-contain'" loading="lazy" width="720" height="900" @error="applyCatalogImageFallback">
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
