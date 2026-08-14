<script setup lang="ts">
import type { Category, Product } from '~/types/catalog'
import { catalogImageUrl } from '~/utils/catalog'

interface SelectedAttribute { type: string; value: string }

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.slug))
const queryValue = (key: string) => typeof route.query[key] === 'string' ? String(route.query[key]) : ''
const queryNumber = (key: string) => {
  const value = Number(queryValue(key))
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

const page = computed(() => Math.max(1, Number(queryValue('page')) || 1))
const sortKey = computed(() => queryValue('sort') || 'recommended')
const brand = computed(() => queryValue('brand'))
const search = computed(() => queryValue('search'))
const priceMin = computed(() => queryNumber('price_min'))
const priceMax = computed(() => queryNumber('price_max'))
const onSale = computed(() => queryValue('sale') === 'true')

const selectedAttributes = computed<SelectedAttribute[]>(() => {
  try {
    const parsed = JSON.parse(queryValue('attrs') || '[]')
    return Array.isArray(parsed)
      ? parsed.filter(item => item && typeof item.type === 'string' && typeof item.value === 'string')
      : []
  }
  catch { return [] }
})

const apiAttributeFilters = computed(() => {
  const grouped = new Map<string, string[]>()
  for (const attribute of selectedAttributes.value) {
    grouped.set(attribute.type, [...(grouped.get(attribute.type) ?? []), attribute.value])
  }
  const clauses = [...grouped.entries()].map(([type, values]) => values.length === 1
    ? { attributes: { $has: { type, value: values[0] } } }
    : { attributes: { $hasAny: values.map(value => ({ type, value })) } })
  if (!clauses.length) return undefined
  return JSON.stringify(clauses.length === 1 ? clauses[0] : { $and: clauses })
})

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest', value: 'newest' },
  { label: 'Name: A to Z', value: 'name' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
]
const sortMap = {
  recommended: { sort: 'sort_order', direction: 'asc' as const },
  newest: { sort: 'created_at', direction: 'desc' as const },
  name: { sort: 'name', direction: 'asc' as const },
  price_asc: { sort: 'price', direction: 'asc' as const },
  price_desc: { sort: 'price', direction: 'desc' as const },
}
const activeSort = computed(() => sortMap[sortKey.value as keyof typeof sortMap] ?? sortMap.recommended)

const { getCategories, getCategoryProducts } = useStorefront()
const { data: categoryResponse } = await useAsyncData('storefront-category-tree', () => getCategories())
const { data: productResponse, status, error, refresh } = await useAsyncData(
  'faceted-category-products',
  () => getCategoryProducts(slug.value, {
    page: page.value,
    perPage: 12,
    sort: activeSort.value.sort,
    direction: activeSort.value.direction,
    brand: brand.value || undefined,
    search: search.value || undefined,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
    onSale: onSale.value || undefined,
    filters: apiAttributeFilters.value,
  }),
  { watch: [slug, page, sortKey, brand, search, priceMin, priceMax, onSale, apiAttributeFilters] },
)

const findCategory = (categories: Category[], targetSlug: string): Category | undefined => {
  for (const category of categories) {
    if (category.slug === targetSlug) return category
    const child = findCategory(category.children ?? [], targetSlug)
    if (child) return child
  }
}

const selectedCategory = computed(() => findCategory(categoryResponse.value?.data ?? [], slug.value))
const categoryName = computed(() => selectedCategory.value?.name ?? slug.value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
const products = computed(() => productResponse.value?.data ?? [])
const meta = computed(() => productResponse.value?.meta)
const facets = computed(() => productResponse.value?.facets)
const { addItem } = useCart()
const notice = ref('')
const filtersOpen = ref(false)
let noticeTimer: ReturnType<typeof setTimeout> | undefined

const updateQuery = (changes: Record<string, string | undefined>) => {
  router.push({ query: { ...route.query, ...changes, page: undefined } })
}
const selectBrand = (value: string) => updateQuery({ brand: brand.value === value ? undefined : value })
const applyPrice = (min?: number, max?: number) => updateQuery({
  price_min: min === undefined ? undefined : String(min),
  price_max: max === undefined ? undefined : String(max),
})
const setSale = (value: boolean) => updateQuery({ sale: value ? 'true' : undefined })
const updateSort = (value: string) => updateQuery({ sort: value === 'recommended' ? undefined : value })
const isAttributeSelected = (type: string, value: string) => selectedAttributes.value.some(item => item.type === type && item.value === value)
const toggleAttribute = (type: string, value: string) => {
  const next = isAttributeSelected(type, value)
    ? selectedAttributes.value.filter(item => !(item.type === type && item.value === value))
    : [...selectedAttributes.value, { type, value }]
  updateQuery({ attrs: next.length ? JSON.stringify(next) : undefined })
}
const clearFilters = () => router.push({ query: sortKey.value === 'recommended' ? {} : { sort: sortKey.value } })
const activeFilterCount = computed(() => Number(Boolean(brand.value)) + Number(Boolean(search.value)) + Number(priceMin.value !== undefined || priceMax.value !== undefined) + Number(onSale.value) + selectedAttributes.value.length)
const goToPage = (target: number) => {
  if (target < 1 || target > (meta.value?.last_page ?? 1)) return
  router.push({ query: { ...route.query, page: target === 1 ? undefined : String(target) } })
  if (import.meta.client) window.scrollTo({ top: 180, behavior: 'smooth' })
}

const addToBag = async (product: Product, productVariantId?: string | number) => {
  try {
    await addItem(product.id, 1, productVariantId)
    notice.value = `${product.name} added to your bag`
  }
  catch (error) { notice.value = authErrorDetails(error, 'We could not add this item to your bag.').message }
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { notice.value = '' }, 2600)
}

useSeoMeta({
  title: () => `${categoryName.value} — Glamrush`,
  description: () => `Shop the Glamrush edit of ${categoryName.value.toLowerCase()}, selected for character, quality and lasting impression.`,
})
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-950">
    <LayoutAppHeader />

    <main id="catalog" class="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6 lg:px-8">
      <div class="border-b border-neutral-200 py-8 sm:py-12">
        <div class="mb-5 flex items-center gap-2 text-xs text-neutral-500">
          <NuxtLink to="/" class="hover:text-neutral-950">Home</NuxtLink><UIcon name="i-lucide-chevron-right" class="size-3" /><span>Fragrance</span><UIcon name="i-lucide-chevron-right" class="size-3" /><span class="text-neutral-900">{{ categoryName }}</span>
        </div>
        <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b742d]">The fragrance edit</p>
            <h1 class="text-4xl leading-tight sm:text-5xl" style="font-family: 'Playfair Display', serif">{{ categoryName }}</h1>
          </div>
          <p class="max-w-md text-sm leading-6 text-neutral-600">Discover distinctive scents selected for their character, craft, and ability to leave a lasting impression.</p>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 border-b border-neutral-200 py-4">
        <div class="flex items-center gap-3">
          <UButton label="Filters" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" class="lg:hidden" @click="filtersOpen = true">
            <template v-if="activeFilterCount" #trailing><UBadge :label="String(activeFilterCount)" color="neutral" size="xs" /></template>
          </UButton>
          <p class="text-sm text-neutral-500"><span class="font-semibold text-neutral-950">{{ meta?.total ?? products.length }}</span> products</p>
        </div>
        <USelect :model-value="sortKey" :items="sortOptions" value-key="value" class="w-48" aria-label="Sort products" @update:model-value="updateSort" />
      </div>

      <div class="grid gap-10 pt-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside class="hidden lg:block">
          <CatalogFilters
            :facets="facets" :category-slug="slug" :brand="brand" :search="search" :price-min="priceMin" :price-max="priceMax"
            :on-sale="onSale" :selected-attributes="selectedAttributes" :active-count="activeFilterCount"
            @search="value => updateQuery({ search: value || undefined })" @brand="selectBrand" @price="applyPrice" @sale-change="setSale"
            @attribute="toggleAttribute" @clear="clearFilters"
          />
        </aside>

        <section aria-live="polite">
          <div v-if="status === 'pending'" class="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
            <div v-for="n in 8" :key="n" class="space-y-3"><USkeleton class="aspect-[4/5] w-full rounded-none" /><USkeleton class="h-3 w-20" /><USkeleton class="h-4 w-3/4" /></div>
          </div>

          <div v-else-if="error" class="flex min-h-96 flex-col items-center justify-center border border-neutral-200 px-6 text-center">
            <UIcon name="i-lucide-wifi-off" class="mb-4 size-8 text-neutral-400" /><h2 class="text-2xl" style="font-family: 'Playfair Display', serif">We couldn’t load this collection.</h2><p class="mt-2 text-sm text-neutral-500">Check that the storefront API is running, then try again.</p><UButton label="Try again" color="neutral" class="mt-6" @click="() => refresh()" />
          </div>

          <div v-else-if="!products.length" class="flex min-h-96 flex-col items-center justify-center border border-neutral-200 px-6 text-center">
            <UIcon name="i-lucide-search-x" class="mb-4 size-8 text-neutral-400" /><h2 class="text-2xl" style="font-family: 'Playfair Display', serif">No products match.</h2><p class="mt-2 text-sm text-neutral-500">Try removing a filter or broadening your price range.</p><UButton label="Clear filters" color="neutral" variant="outline" class="mt-6" @click="clearFilters" />
          </div>

          <div v-else class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            <article v-for="product in products" :key="product.id" class="group min-w-0">
              <div class="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <NuxtLink :to="`/product/${product.slug}`" class="block h-full" :aria-label="`View ${product.name}`">
                  <img :src="catalogImageUrl(product.images)" :alt="product.name" class="h-full w-full transition duration-500 group-hover:scale-[1.025]" :class="hasCatalogImage(product.images) ? 'object-cover' : 'object-contain'" loading="lazy" width="720" height="900">
                </NuxtLink>
                <UBadge v-if="productPricing(product).onSale" label="Sale" color="error" variant="solid" class="absolute left-3 top-3 rounded-none" />
                <UButton icon="i-lucide-heart" :aria-label="`Save ${product.name}`" color="neutral" variant="soft" square class="absolute right-3 top-3 rounded-full bg-white/90" />
                <CatalogQuickAdd :product="product" button-class="absolute inset-x-3 bottom-3 translate-y-2 rounded-none !text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100" @add-to-bag="addToBag" />
              </div>
              <p class="mt-4 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{{ product.brand?.name || 'Glamrush edit' }}</p>
              <h2 class="mt-1 line-clamp-2 text-sm font-medium leading-5">
                <NuxtLink :to="`/product/${product.slug}`" class="hover:underline">{{ product.name }}</NuxtLink>
              </h2>
              <CatalogProductPrice :product="product" />
            </article>
          </div>

          <div v-if="meta && meta.last_page > 1" class="mt-14 flex justify-center border-t border-neutral-200 pt-8">
            <UPagination :page="page" :total="meta.total" :items-per-page="meta.per_page" color="neutral" @update:page="goToPage" />
          </div>
        </section>
      </div>
    </main>

    <LayoutAppFooter />

    <USlideover v-model:open="filtersOpen" title="Filter products" side="left" :ui="{ content: 'max-w-sm' }">
      <template #body>
        <CatalogFilters
          :facets="facets" :category-slug="slug" :brand="brand" :search="search" :price-min="priceMin" :price-max="priceMax"
          :on-sale="onSale" :selected-attributes="selectedAttributes" :active-count="activeFilterCount"
          @search="value => updateQuery({ search: value || undefined })" @brand="selectBrand" @price="applyPrice" @sale-change="setSale"
          @attribute="toggleAttribute" @clear="clearFilters"
        />
      </template>
    </USlideover>

    <Transition name="toast"><div v-if="notice" class="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 bg-neutral-950 px-5 py-3 text-sm text-white shadow-xl" role="status">{{ notice }}<UButton icon="i-lucide-x" aria-label="Dismiss" color="neutral" variant="ghost" size="xs" square @click="notice = ''" /></div></Transition>
  </div>
</template>
