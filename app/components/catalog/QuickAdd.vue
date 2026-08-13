<script setup lang="ts">
import type { Product, ProductPrice, ProductVariant } from '~/types/catalog'

const props = withDefaults(defineProps<{
  product: Product
  buttonClass?: string
}>(), {
  buttonClass: '',
})

const emit = defineEmits<{
  addToBag: [product: Product, productVariantId?: string | number]
}>()

const open = ref(false)
const selectedId = ref<string | number>()
const variants = computed(() => props.product.variants ?? [])
const selectedVariant = computed(() => variants.value.find(variant => variant.id === selectedId.value))
const isVariable = computed(() => props.product.type === 'variable')
const sellableCount = computed(() => variants.value.filter(variant => variant.available !== false && variant.inStock !== false).length)
const money = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })

const amount = (value: number | string | ProductPrice | null | undefined) => {
  if (value === null || value === undefined) return undefined
  const raw = typeof value === 'object' ? value.amount : value
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

const variantPrice = (variant: ProductVariant) => {
  const regular = amount(variant.price) ?? 0
  const sale = amount(variant.salePrice)
  return money.format(variant.isOnSale && sale !== undefined && sale < regular ? sale : regular)
}

const variantLabel = (variant: ProductVariant) => variant.attributes
  ?.map(attribute => attribute.value)
  .filter(Boolean)
  .join(' / ') || variant.sku || `Option ${variant.id}`

const openPicker = () => {
  if (props.product.available === false) return
  if (!isVariable.value) {
    emit('addToBag', props.product)
    return
  }

  selectedId.value = undefined
  open.value = true
}

const confirm = () => {
  if (!selectedVariant.value) return
  emit('addToBag', props.product, selectedVariant.value.id)
  open.value = false
}
</script>

<template>
  <UButton
    :label="product.available === false ? 'Sold out' : 'Quick add'"
    color="neutral"
    block
    :class="buttonClass"
    :disabled="product.available === false"
    @click="openPicker"
  />

  <UModal
    v-model:open="open"
    :title="product.name"
    description="Choose your preferred option before adding it to your bag."
    :ui="{ content: 'max-w-lg rounded-none', header: 'border-b border-neutral-200 px-6 py-5', body: 'p-0', footer: 'border-t border-neutral-200 px-6 py-5' }"
    @after:leave="selectedId = undefined"
  >
    <template #body>
      <div class="grid grid-cols-[84px_1fr] gap-4 bg-[#f7f3ec] px-6 py-5">
        <div class="aspect-[4/5] overflow-hidden bg-white">
          <img :src="catalogImageUrl(product.images)" :alt="product.name" class="h-full w-full object-cover">
        </div>
        <div class="self-center">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-glam-gold">{{ product.brand?.name || 'Glamrush edit' }}</p>
          <p class="mt-2 text-sm font-medium">{{ product.name }}</p>
          <p class="mt-1 text-xs text-neutral-500">{{ sellableCount }} {{ sellableCount === 1 ? 'option' : 'options' }} available</p>
        </div>
      </div>

      <fieldset class="px-6 py-6">
        <legend class="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Select an option</legend>
        <div v-if="variants.length" class="grid gap-2 sm:grid-cols-2">
          <button
            v-for="variant in variants"
            :key="variant.id"
            type="button"
            class="flex min-h-14 items-center justify-between gap-4 border px-4 py-3 text-left transition"
            :class="variant.id === selectedId ? 'border-neutral-950 bg-neutral-950 !text-white [&_*]:!text-white' : 'border-neutral-300 bg-white hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-40'"
            :disabled="variant.available === false || variant.inStock === false"
            :aria-pressed="variant.id === selectedId"
            @click="selectedId = variant.id"
          >
            <span>
              <span class="block text-sm font-semibold">{{ variantLabel(variant) }}</span>
              <span v-if="variant.sku" class="mt-1 block text-[9px] uppercase tracking-[0.12em] opacity-55">{{ variant.sku }}</span>
            </span>
            <span class="shrink-0 text-xs font-semibold">{{ variantPrice(variant) }}</span>
          </button>
        </div>
        <p v-else class="border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">No purchasable options are currently available.</p>
      </fieldset>
    </template>

    <template #footer="{ close }">
      <div class="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <UButton label="Cancel" color="neutral" variant="ghost" class="rounded-none" @click="close()" />
        <UButton label="Add selected option" trailing-icon="i-lucide-shopping-bag" color="neutral" class="rounded-none !text-white" :disabled="!selectedVariant" @click="confirm" />
      </div>
    </template>
  </UModal>
</template>
