<script setup lang="ts">
import type { ProductFacets } from '~/types/catalog'
import { facetLabel, facetSwatch } from '~/utils/catalog'

interface SelectedAttribute { type: string; value: string }

const props = defineProps<{
  facets?: ProductFacets
  categorySlug: string
  brand: string
  search: string
  priceMin?: number
  priceMax?: number
  onSale: boolean
  selectedAttributes: SelectedAttribute[]
  activeCount: number
}>()

const emit = defineEmits<{
  search: [value: string]
  brand: [value: string]
  price: [min?: number, max?: number]
  'sale-change': [value: boolean]
  attribute: [type: string, value: string]
  clear: []
}>()

const searchDraft = ref(props.search)
const minDraft = ref<number | undefined>()
const maxDraft = ref<number | undefined>()

const facetMin = computed(() => Math.floor(Number(props.facets?.price_range?.min ?? 0)))
const facetMax = computed(() => Math.ceil(Number(props.facets?.price_range?.max ?? 0)))
const priceStep = computed(() => {
  const maximum = facetMax.value

  if (maximum < 10_000) return 500
  if (maximum < 50_000) return 1_000
  if (maximum < 100_000) return 5_000
  if (maximum < 500_000) return 20_000
  if (maximum < 1_000_000) return 100_000

  return 200_000
})

watch(() => props.search, value => { searchDraft.value = value })
watch(
  [() => props.priceMin, () => props.facets?.price_range?.min],
  ([selected, minimum]) => { minDraft.value = selected ?? (minimum === undefined ? undefined : Math.floor(Number(minimum))) },
  { immediate: true },
)
watch(
  [() => props.priceMax, () => props.facets?.price_range?.max],
  ([selected, maximum]) => { maxDraft.value = selected ?? (maximum === undefined ? undefined : Math.ceil(Number(maximum))) },
  { immediate: true },
)

const isSelected = (type: string, value: string) => props.selectedAttributes.some(item => item.type === type && item.value === value)

const applyPrice = () => {
  if (minDraft.value !== undefined && maxDraft.value !== undefined && minDraft.value > maxDraft.value) {
    const minimum = maxDraft.value
    const maximum = minDraft.value
    minDraft.value = minimum
    maxDraft.value = maximum
  }

  emit('price', minDraft.value, maxDraft.value)
}
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Refine</p>
        <p class="mt-1 text-sm text-neutral-900">{{ activeCount ? `${activeCount} active` : 'All products' }}</p>
      </div>
      <UButton v-if="activeCount" label="Clear all" color="neutral" variant="link" size="sm" class="p-0" @click="emit('clear')" />
    </div>

    <form class="space-y-2" @submit.prevent="emit('search', searchDraft.trim())">
      <label class="text-xs font-semibold text-neutral-900" for="product-search">Search products</label>
      <UInput id="product-search" v-model="searchDraft" placeholder="Name or keyword" icon="i-lucide-search" size="lg" class="w-full" />
    </form>

    <div class="border-y border-neutral-200 py-4">
      <button type="button" role="checkbox" :aria-checked="onSale" class="group flex w-full items-center gap-3 text-left text-sm font-medium" @click="emit('sale-change', !onSale)">
        <span class="grid size-5 shrink-0 place-items-center border transition" :class="onSale ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-400 bg-white group-hover:border-neutral-950'" aria-hidden="true">
          <svg v-if="onSale" viewBox="0 0 16 16" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 3.1 3L13 4.5" /></svg>
        </span>
        <span>On sale now</span>
        <span v-if="onSale" class="ml-auto text-[9px] font-bold uppercase tracking-[0.14em] text-glam-gold">Active</span>
      </button>
    </div>

    <details v-if="facets?.categories?.length" open class="group">
      <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        Category <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div class="mt-4 space-y-1">
        <NuxtLink
          v-for="category in facets.categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="flex items-center justify-between rounded-md px-2 py-2 text-sm transition hover:bg-neutral-100"
          :class="category.slug === categorySlug ? 'bg-neutral-100 font-semibold text-neutral-950' : 'text-neutral-600'"
        >
          <span>{{ category.name }}</span><span class="text-xs text-neutral-400">{{ category.count }}</span>
        </NuxtLink>
      </div>
    </details>

    <details v-if="facets?.brands?.length" open class="group border-t border-neutral-200 pt-6">
      <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        Brand <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div class="mt-4 space-y-3">
        <div v-for="item in facets.brands" :key="item.id" class="flex items-center justify-between gap-3">
          <UCheckbox :model-value="brand === item.slug" :label="item.name" color="neutral" @update:model-value="emit('brand', item.slug)" />
          <span class="text-xs text-neutral-400">{{ item.count }}</span>
        </div>
      </div>
    </details>

    <details v-if="facets?.price_range" open class="group border-t border-neutral-200 pt-6">
      <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        Price <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <label class="space-y-1.5">
          <span class="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Minimum</span>
          <UInputNumber v-model="minDraft" :min="facetMin" :max="facetMax" :step="priceStep" aria-label="Minimum price" size="md" class="w-full" />
        </label>
        <label class="space-y-1.5">
          <span class="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Maximum</span>
          <UInputNumber v-model="maxDraft" :min="facetMin" :max="facetMax" :step="priceStep" aria-label="Maximum price" size="md" class="w-full" />
        </label>
      </div>
      <p class="mt-2 text-[9px] tracking-[0.08em] text-neutral-400">Adjusts in {{ priceStep.toLocaleString() }} increments</p>
      <UButton label="Apply price" color="neutral" variant="outline" block class="mt-3" @click="applyPrice" />
    </details>

    <details v-for="attribute in facets?.attributes ?? []" :key="attribute.type" class="group border-t border-neutral-200 pt-6">
      <summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        {{ facetLabel(attribute.type) }} <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div class="mt-4 space-y-3">
        <div v-for="option in attribute.options" :key="`${attribute.type}-${option.value}`" class="flex items-center justify-between gap-3">
          <UCheckbox :model-value="isSelected(attribute.type, option.value)" color="neutral" @update:model-value="emit('attribute', attribute.type, option.value)">
            <template #label>
              <span class="flex items-center gap-2 text-sm">
                <i v-if="attribute.display_type === 'color_swatch' || option.display_type === 'color'" class="size-3.5 rounded-full border border-neutral-300" :style="{ background: facetSwatch(option.code, option.meta) || '#d8cdc1' }" />
                {{ option.label }}
              </span>
            </template>
          </UCheckbox>
          <span class="text-xs text-neutral-400">{{ option.count }}</span>
        </div>
      </div>
    </details>
  </div>
</template>
