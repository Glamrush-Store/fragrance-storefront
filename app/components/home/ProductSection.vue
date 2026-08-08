<script setup lang="ts">
import type { HomepageSection, Product } from '~/types/catalog'

const props = defineProps<{ section: HomepageSection; storefrontSlug: string; position: number }>()
const emit = defineEmits<{ addToBag: [product: Product, productVariantId?: string | number] }>()

const products = computed(() => props.section.items
  .filter((item): item is Product => 'price' in item)
  .slice(0, 4))
const isSale = computed(() => props.section.type === 'sale_products')
const surfaceClass = computed(() => isSale.value || props.position % 2 === 1 ? 'bg-glam-ivory' : 'bg-white')
const eyebrow = computed(() => ({
  featured_products: 'Featured fragrances',
  collection_products: 'The collection edit',
  category_products: 'Shop the category',
  sale_products: 'Limited-time prices',
  manual_products: 'Curated for you',
  newest_products: 'New arrivals',
}[props.section.type] || 'The fragrance edit'))
const browseTo = computed(() => {
  if (isSale.value) return { path: `/category/${props.storefrontSlug}`, query: { sale: 'true' } }
  const category = products.value[0]?.category?.slug
  return { path: `/category/${category || props.storefrontSlug}` }
})
</script>

<template>
  <section v-if="products.length" :class="surfaceClass">
    <div class="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div class="mb-10 flex items-end justify-between border-b border-neutral-300 pb-8">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" :class="isSale ? 'text-[#a04432]' : 'text-glam-gold'">{{ eyebrow }}</p>
          <h2 class="font-display text-4xl sm:text-5xl">{{ section.title }}</h2>
          <p v-if="section.subtitle" class="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{{ section.subtitle }}</p>
        </div>
        <UButton :to="browseTo" label="Explore all" trailing-icon="i-lucide-arrow-right" color="neutral" variant="link" class="hidden sm:inline-flex" />
      </div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        <HomeProductCard v-for="(product, index) in products" :key="product.id" :product="product" :index="index" :accent="isSale" @add-to-bag="(item, variantId) => emit('addToBag', item, variantId)" />
      </div>
    </div>
  </section>
</template>
