<script setup lang="ts">
import ProductGallery from '~/components/product/ProductGallery.vue'
import VariantSelector from '~/components/product/VariantSelector.vue'
import type { Product, ProductVariant } from '~/types/catalog'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { getProduct } = useStorefront()

const { data: productResponse, status, error, refresh } = await useAsyncData(
  () => `storefront-product-${slug.value}`,
  async () => {
    try {
      return await getProduct(slug.value)
    }
    catch (requestError) {
      console.error(`Unable to load product: ${slug.value}`, requestError)
      throw requestError
    }
  },
  { watch: [slug] },
)

const product = computed(() => productResponse.value?.data)
const primaryCategory = computed(() => productPrimaryCategory(product.value))
const productCategories = computed(() => {
  if (!product.value) return []

  const categories = product.value.categories?.length
    ? product.value.categories
    : primaryCategory.value ? [primaryCategory.value] : []

  return categories.filter((category, index, list) =>
    list.findIndex(candidate => String(candidate.id) === String(category.id)) === index)
})
const selectedVariantId = shallowRef<string | number | undefined>()
const quantity = shallowRef(1)
const addingToBag = shallowRef(false)
const { items: cartItems, addItem, ensureCart } = useCart()
const notice = shallowRef('')
let noticeTimer: ReturnType<typeof setTimeout> | undefined

watch(product, (value) => {
  selectedVariantId.value = value?.variants?.find(variant => variant.isDefault)?.id ?? value?.variants?.[0]?.id
  quantity.value = 1
}, { immediate: true })

const selectedVariant = computed(() => product.value?.variants?.find(variant => variant.id === selectedVariantId.value))
const displayProduct = computed<Product | undefined>(() => {
  if (!product.value || !selectedVariant.value) return product.value
  return {
    ...product.value,
    price: selectedVariant.value.price,
    salePrice: selectedVariant.value.salePrice,
    currentPrice: selectedVariant.value.currentPrice,
    isOnSale: selectedVariant.value.isOnSale,
    available: selectedVariant.value.available ?? selectedVariant.value.inStock,
    variants: [],
  }
})
const images = computed(() => {
  if (!product.value) return []
  return [...new Set([
    ...catalogImageUrls(selectedVariant.value?.images),
    ...catalogImageUrls(product.value.images),
  ])]
})
const attributes = computed(() => selectedVariant.value?.attributes?.length ? selectedVariant.value.attributes : product.value?.default_attributes ?? [])
const available = computed(() => displayProduct.value?.available !== false && selectedVariant.value?.inStock !== false)
const stockQuantity = computed(() => selectedVariant.value?.stock_quantity ?? product.value?.stock_quantity)
const quantityInBag = computed(() => cartItems.value.find(item => item.product_id === String(product.value?.id) && (!selectedVariant.value || item.product_variant_id === String(selectedVariant.value.id)))?.quantity ?? 0)
const tracksStock = computed(() => {
  const stock = Number(stockQuantity.value)
  return available.value && Number.isFinite(stock) && stock > 0
})
const remainingQuantity = computed<number | null>(() => {
  if (!available.value) return 0
  if (!tracksStock.value) return null
  return Math.max(0, Math.floor(Number(stockQuantity.value)) - quantityInBag.value)
})
const maxQuantity = computed(() => remainingQuantity.value === null ? undefined : Math.max(1, remainingQuantity.value))
const canAddToBag = computed(() => available.value && remainingQuantity.value !== 0)
const sku = computed(() => selectedVariant.value?.sku || product.value?.sku)

watch(remainingQuantity, (remaining) => {
  if (remaining !== null && remaining > 0 && quantity.value > remaining) {
    quantity.value = remaining
  }
  if (quantity.value < 1) quantity.value = 1
})

const selectVariant = (variant: ProductVariant) => {
  selectedVariantId.value = variant.id
  quantity.value = 1
}
const addToBag = async () => {
  if (!displayProduct.value || !available.value) return

  const requestedQuantity = Math.max(1, Math.floor(Number(quantity.value) || 1))
  const remaining = remainingQuantity.value

  if (remaining === 0) {
    notice.value = `All available ${displayProduct.value.name} stock is already in your bag`
  }
  else if (remaining !== null && requestedQuantity > remaining) {
    quantity.value = remaining
    notice.value = `Only ${remaining} ${remaining === 1 ? 'item is' : 'items are'} still available`
  }
  else {
    addingToBag.value = true
    try {
      await addItem(product.value!.id, requestedQuantity, selectedVariant.value?.id)
      notice.value = `${requestedQuantity} × ${displayProduct.value.name} added to your bag`
      quantity.value = 1
    }
    catch (error) {
      notice.value = authErrorDetails(error, 'We could not add this item to your bag.').message
    }
    finally { addingToBag.value = false }
  }

  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { notice.value = '' }, 2800)
}

onMounted(() => ensureCart().catch(() => undefined))

useSeoMeta({
  title: () => product.value?.metaTitle || (product.value ? `${product.value.name} — Glamrush` : 'Product — Glamrush'),
  description: () => product.value?.metaDescription || product.value?.shortDescription || `Shop ${product.value?.name || 'fragrance'} at Glamrush.`,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.shortDescription || product.value?.metaDescription || undefined,
  ogImage: () => images.value[0],
})
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-glam-ink">
    <LayoutAppHeader />

    <main>
      <div v-if="status === 'pending'" class="mx-auto grid max-w-[1280px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)] lg:px-8 lg:py-14">
        <USkeleton class="aspect-[4/5] w-full rounded-none" />
        <div class="space-y-6 pt-4"><USkeleton class="h-3 w-28" /><USkeleton class="h-14 w-4/5" /><USkeleton class="h-5 w-32" /><USkeleton class="h-28 w-full" /><USkeleton class="h-14 w-full" /></div>
      </div>

      <section v-else-if="error || !product" class="mx-auto flex min-h-[65svh] max-w-[1280px] flex-col items-center justify-center px-6 text-center">
        <UIcon name="i-lucide-package-x" class="mb-5 size-10 text-neutral-400" />
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-glam-gold">Product unavailable</p>
        <h1 class="mt-3 font-display text-4xl sm:text-5xl">We couldn’t find this fragrance.</h1>
        <p class="mt-4 max-w-md text-sm leading-6 text-neutral-600">It may have moved or is temporarily unavailable.</p>
        <div class="mt-7 flex gap-3"><UButton to="/" label="Return home" color="neutral" variant="outline" /><UButton label="Try again" color="neutral" class="!text-white" @click="() => refresh()" /></div>
      </section>

      <template v-else>
        <div class="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 lg:px-8">
          <nav class="flex flex-wrap items-center gap-2 text-xs text-neutral-500" aria-label="Breadcrumb">
            <NuxtLink to="/" class="hover:text-neutral-950">Home</NuxtLink><UIcon name="i-lucide-chevron-right" class="size-3" />
            <NuxtLink v-if="primaryCategory" :to="`/category/${primaryCategory.slug}`" class="hover:text-neutral-950">{{ primaryCategory.name }}</NuxtLink><UIcon v-if="primaryCategory" name="i-lucide-chevron-right" class="size-3" />
            <span class="text-neutral-900">{{ product.name }}</span>
          </nav>
        </div>

        <div class="mx-auto grid max-w-[1280px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)] lg:gap-16 lg:px-8 lg:py-12">
          <ProductGallery :images="images" :product-name="product.name" />

          <aside class="lg:sticky lg:top-24 lg:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{{ product.brand?.name || 'Glamrush edit' }}</p>
            <h1 class="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[.98] tracking-[-0.03em]">{{ product.name }}</h1>
            <CatalogProductPrice v-if="displayProduct" :product="displayProduct" />
            <p v-if="product.shortDescription" class="mt-6 text-sm leading-7 text-neutral-600">{{ product.shortDescription }}</p>

            <div v-if="productCategories.length" class="mt-5 flex flex-wrap items-center gap-2" aria-label="Product categories">
              <span class="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Explore</span>
              <NuxtLink
                v-for="category in productCategories"
                :key="category.id"
                :to="`/category/${category.slug}`"
                class="border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
              >
                {{ category.name }}
              </NuxtLink>
            </div>

            <VariantSelector v-if="product.variants?.length" :variants="product.variants" :selected-id="selectedVariantId" class="mt-7" @select="selectVariant" />

            <dl v-if="attributes.length" class="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-neutral-200 py-5">
              <div v-for="attribute in attributes" :key="`${attribute.type}-${attribute.value}`"><dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{{ facetLabel(attribute.type) }}</dt><dd class="mt-1 text-sm">{{ attribute.value }}</dd></div>
            </dl>

            <div class="mt-6 flex items-center gap-2 text-sm">
              <span class="size-2 rounded-full" :class="canAddToBag ? 'bg-emerald-500' : 'bg-neutral-400'" />
              <span v-if="!available">Currently unavailable</span>
              <span v-else-if="remainingQuantity === 0">All available stock is in your bag</span>
              <span v-else-if="remainingQuantity !== null">{{ remainingQuantity }} {{ remainingQuantity === 1 ? 'item' : 'items' }} available to add</span>
              <span v-else>In stock and ready to ship</span>
            </div>

            <div class="mt-6 grid grid-cols-[110px_minmax(0,1fr)] gap-3">
              <UInputNumber v-model="quantity" :min="1" :max="maxQuantity" size="xl" aria-label="Quantity" :disabled="!canAddToBag" />
              <UButton :label="!available ? 'Sold out' : remainingQuantity === 0 ? 'Maximum in bag' : 'Add to bag'" color="neutral" size="xl" block class="rounded-none !text-white" :disabled="!canAddToBag" :loading="addingToBag" @click="addToBag" />
            </div>
            <UButton label="Save to wishlist" icon="i-lucide-heart" color="neutral" variant="outline" size="lg" block class="mt-3 rounded-none" />

            <div class="mt-8 divide-y divide-neutral-200 border-y border-neutral-200 text-sm">
              <details v-if="product.description" open class="group py-5"><summary class="flex cursor-pointer list-none items-center justify-between font-semibold">About this fragrance<UIcon name="i-lucide-plus" class="size-4 group-open:rotate-45" /></summary><p class="mt-3 whitespace-pre-line leading-7 text-neutral-600">{{ product.description }}</p></details>
              <details class="group py-5"><summary class="flex cursor-pointer list-none items-center justify-between font-semibold">Delivery & returns<UIcon name="i-lucide-plus" class="size-4 group-open:rotate-45" /></summary><p class="mt-3 leading-7 text-neutral-600">Free Lagos delivery on qualifying orders. Unopened products may be returned according to our returns policy.</p></details>
              <details class="group py-5"><summary class="flex cursor-pointer list-none items-center justify-between font-semibold">Authenticity promise<UIcon name="i-lucide-plus" class="size-4 group-open:rotate-45" /></summary><p class="mt-3 leading-7 text-neutral-600">Every fragrance is sourced and selected for authenticity, quality and character.</p></details>
            </div>
            <p v-if="sku" class="mt-5 text-xs text-neutral-400">SKU: {{ sku }}</p>
          </aside>
        </div>
      </template>
    </main>

    <LayoutAppFooter />
    <Transition name="toast"><div v-if="notice" class="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 bg-neutral-950 px-5 py-3 text-sm text-white shadow-xl" role="status">{{ notice }}<UButton icon="i-lucide-x" aria-label="Dismiss" color="neutral" variant="ghost" size="xs" square @click="notice = ''" /></div></Transition>
  </div>
</template>
