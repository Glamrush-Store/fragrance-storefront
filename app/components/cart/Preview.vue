<script setup lang="ts">
import type { CartItem } from '~/types/checkout'
import { PRODUCT_IMAGE_FALLBACK } from '~/utils/catalog'

const open = ref(false)
const toast = useToast()
const { items, subtotal, count, loading, quantityQueuedIds, quantitySavingIds, ensureCart, queueItemQuantity, removeItem } = useCart()
const pendingItemIds = ref(new Set<string>())

const money = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const formatMoney = (amount: number | string) => money.format(Number(amount) || 0)

const itemDetails = (item: CartItem) => {
  if (Array.isArray(item.attributes)) {
    const attributes = item.attributes
      .map(attribute => attribute.value || attribute.type)
      .filter(Boolean)
      .join(' · ')
    if (attributes) return attributes
  }

  if (item.attributes && !Array.isArray(item.attributes)) {
    const attributes = Object.values(item.attributes).filter(Boolean).join(' · ')
    if (attributes) return attributes
  }

  return item.sku || ''
}

const errorMessage = (error: unknown) => {
  const response = error as { data?: { message?: string }; message?: string }
  return response.data?.message || response.message || 'The bag could not be updated. Please try again.'
}

const setPending = (itemId: string, pending: boolean) => {
  const next = new Set(pendingItemIds.value)
  if (pending) next.add(itemId)
  else next.delete(itemId)
  pendingItemIds.value = next
}

const changeQuantity = (item: CartItem, quantity: number) => {
  if (quantity < 1 || pendingItemIds.value.has(item.id) || quantitySavingIds.value[item.id]) return
  queueItemQuantity(item.id, quantity, (error) => {
    toast.add({ title: 'Could not update quantity', description: errorMessage(error), color: 'error' })
  })
}

const remove = async (item: CartItem) => {
  if (pendingItemIds.value.has(item.id) || quantitySavingIds.value[item.id]) return
  setPending(item.id, true)
  try {
    await removeItem(item.id)
  }
  catch (error) {
    toast.add({ title: 'Could not remove item', description: errorMessage(error), color: 'error' })
  }
  finally {
    setPending(item.id, false)
  }
}

watch(open, async (isOpen) => {
  if (!isOpen) return
  try {
    await ensureCart()
  }
  catch (error) {
    toast.add({ title: 'Could not load your bag', description: errorMessage(error), color: 'error' })
  }
})
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ align: 'end', side: 'bottom', sideOffset: 10, collisionPadding: 12 }"
    :ui="{ content: 'w-[min(26rem,calc(100vw-1.5rem))] overflow-hidden rounded-none bg-[#fcfaf6] p-0 shadow-2xl ring-1 ring-black/10' }"
  >
    <UButton color="neutral" variant="ghost" class="gap-2" aria-label="Open shopping bag">
      Bag
      <UBadge :label="String(count)" color="neutral" variant="solid" size="xs" />
      <UIcon name="i-lucide-chevron-down" class="size-3.5 transition-transform duration-200" :class="open ? 'rotate-180' : ''" />
    </UButton>

    <template #content="{ close }">
      <section aria-label="Shopping bag preview">
        <header class="flex items-end justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <p class="font-display text-2xl leading-none">Your bag</p>
            <p class="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">{{ count }} {{ count === 1 ? 'item' : 'items' }}</p>
          </div>
          <UButton icon="i-lucide-x" aria-label="Close bag" color="neutral" variant="ghost" square size="sm" @click="close()" />
        </header>

        <div v-if="loading && !items.length" class="grid min-h-52 place-items-center">
          <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-glam-gold" aria-label="Loading bag" />
        </div>

        <div v-else-if="!items.length" class="px-8 py-12 text-center">
          <span class="mx-auto grid size-12 place-items-center rounded-full border border-neutral-200 bg-white">
            <UIcon name="i-lucide-shopping-bag" class="size-5 text-neutral-500" />
          </span>
          <p class="mt-5 font-display text-2xl">Your bag is waiting</p>
          <p class="mx-auto mt-2 max-w-60 text-sm leading-6 text-neutral-500">Explore the fragrance edit and choose something unforgettable.</p>
          <UButton to="/" label="Continue shopping" color="neutral" variant="outline" class="mt-6 rounded-none" @click="close()" />
        </div>

        <template v-else>
          <ul class="max-h-[min(25rem,55vh)] divide-y divide-neutral-200 overflow-y-auto overscroll-contain">
            <li v-for="item in items" :key="item.id" class="relative grid grid-cols-[72px_1fr] gap-4 px-5 py-4 transition-opacity" :class="pendingItemIds.has(item.id) ? 'opacity-55' : ''">
              <NuxtLink :to="`/product/${item.slug}`" class="aspect-[4/5] overflow-hidden bg-[#ebe6de]" @click="close()">
                <img :src="item.thumb || PRODUCT_IMAGE_FALLBACK" :alt="item.name" class="h-full w-full transition duration-500 hover:scale-105" :class="item.thumb ? 'object-cover' : 'object-contain'">
              </NuxtLink>

              <div class="min-w-0 pr-7">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <NuxtLink :to="`/product/${item.slug}`" class="line-clamp-2 text-sm font-medium leading-5 hover:underline" @click="close()">{{ item.name }}</NuxtLink>
                    <p v-if="itemDetails(item)" class="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-neutral-400">{{ itemDetails(item) }}</p>
                  </div>
                  <p class="shrink-0 text-sm font-semibold">{{ formatMoney(Number(item.unit_price) * item.quantity) }}</p>
                </div>

                <div class="mt-4 flex items-center justify-between">
                  <div class="inline-flex h-8 items-center border border-neutral-300 bg-white">
                    <UButton icon="i-lucide-minus" :aria-label="`Decrease ${item.name} quantity`" color="neutral" variant="ghost" square size="xs" class="h-full rounded-none" :disabled="item.quantity <= 1 || pendingItemIds.has(item.id) || quantitySavingIds[item.id]" @click="changeQuantity(item, item.quantity - 1)" />
                    <span class="min-w-8 text-center text-xs font-semibold tabular-nums" aria-live="polite">{{ item.quantity }}</span>
                    <UButton icon="i-lucide-plus" :aria-label="`Increase ${item.name} quantity`" color="neutral" variant="ghost" square size="xs" class="h-full rounded-none" :disabled="pendingItemIds.has(item.id) || quantitySavingIds[item.id]" @click="changeQuantity(item, item.quantity + 1)" />
                  </div>
                  <span class="flex items-center gap-1.5 text-[10px] text-neutral-400"><UIcon v-if="quantityQueuedIds[item.id] || quantitySavingIds[item.id]" name="i-lucide-loader-circle" class="size-3 animate-spin" />{{ quantityQueuedIds[item.id] ? 'Waiting for changes…' : quantitySavingIds[item.id] ? 'Updating…' : `${formatMoney(item.unit_price)} each` }}</span>
                </div>
              </div>

              <UButton icon="i-lucide-trash-2" :aria-label="`Remove ${item.name} from bag`" color="neutral" variant="ghost" square size="xs" class="absolute right-4 top-3 text-neutral-400 hover:text-red-700" :disabled="pendingItemIds.has(item.id) || quantitySavingIds[item.id]" @click="remove(item)" />
            </li>
          </ul>

          <footer class="border-t border-neutral-950 bg-white px-5 py-5">
            <div class="flex items-baseline justify-between">
              <div>
                <p class="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Subtotal</p>
                <p class="mt-1 text-xs text-neutral-500">Delivery calculated at checkout</p>
              </div>
              <p class="font-display text-2xl">{{ formatMoney(subtotal) }}</p>
            </div>
            <UButton to="/checkout" label="Proceed to checkout" trailing-icon="i-lucide-arrow-right" color="neutral" size="lg" block class="mt-5 rounded-none !text-white" @click="close()" />
          </footer>
        </template>
      </section>
    </template>
  </UPopover>
</template>
