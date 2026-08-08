<script setup lang="ts">
import type { HomepageSection, Product } from '~/types/catalog'

defineProps<{ section: HomepageSection; storefrontSlug: string; position: number }>()
const emit = defineEmits<{ addToBag: [product: Product, productVariantId?: string | number] }>()
</script>

<template>
  <HomeCategorySection v-if="section.type === 'random_categories'" :section="section" />
  <HomeProductSection v-else :section="section" :storefront-slug="storefrontSlug" :position="position" @add-to-bag="(item, variantId) => emit('addToBag', item, variantId)" />
</template>
