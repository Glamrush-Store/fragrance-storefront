<script setup lang="ts">
import type { ProductVariant } from '~/types/catalog'

const props = defineProps<{ variants: ProductVariant[]; selectedId?: string | number }>()
const emit = defineEmits<{ select: [variant: ProductVariant] }>()

const variantLabel = (variant: ProductVariant) => variant.attributes?.map(attribute => attribute.value).join(' / ') || variant.sku || `Option ${variant.id}`
</script>

<template>
  <fieldset v-if="variants.length" class="border-t border-neutral-200 pt-6">
    <legend class="mb-3 flex w-full items-center justify-between text-sm font-semibold">
      <span>Choose an option</span><span class="text-xs font-normal text-neutral-500">{{ variants.length }} available</span>
    </legend>
    <div class="flex flex-wrap gap-2">
      <button v-for="variant in variants" :key="variant.id" type="button" class="min-h-11 border px-4 py-2.5 text-left text-sm transition" :class="variant.id === selectedId ? 'border-neutral-950 bg-neutral-950 !text-white [&_*]:!text-white' : 'border-neutral-300 bg-white hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-40'" :disabled="variant.available === false || variant.inStock === false" :aria-pressed="variant.id === selectedId" @click="emit('select', variant)">
        {{ variantLabel(variant) }}
      </button>
    </div>
  </fieldset>
</template>
