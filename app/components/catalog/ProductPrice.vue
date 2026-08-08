<script setup lang="ts">
import type { Product } from '~/types/catalog'

const props = withDefaults(defineProps<{ product: Product; accent?: boolean }>(), { accent: false })
const pricing = computed(() => productPricing(props.product))
const currency = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
</script>

<template>
  <p class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold">
    <span v-if="pricing.original !== undefined" class="font-normal text-neutral-400 line-through decoration-neutral-500" aria-label="Original price">{{ currency.format(pricing.original) }}</span>
    <span :class="pricing.onSale || accent ? 'text-[#a04432]' : 'text-neutral-950'" :aria-label="pricing.onSale ? 'Sale price' : 'Price'">{{ currency.format(pricing.current) }}</span>
  </p>
</template>
