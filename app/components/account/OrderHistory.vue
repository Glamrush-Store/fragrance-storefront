<script setup lang="ts">
import type { CustomerOrder, OrderItem } from '~/types/account'
import type { OrderRestoreCartResult } from '~/types/checkout'

const router = useRouter()
const toast = useToast()
const { listOrders } = useCustomerAccount()
const { initializePayment, restoreOrderCart } = useCheckout()
const { fetchCart } = useCart()
const orders = ref<CustomerOrder[]>([])
const loading = ref(true)
const errorMessage = ref('')
const page = ref(1)
const lastPage = ref(1)
const restoringOrderIds = ref<Record<string, boolean>>({})
const retryingOrderIds = ref<Record<string, boolean>>({})
const restoreResults = ref<Record<string, OrderRestoreCartResult>>({})

const currency = (amount: number | string, code = 'NGN') => new Intl.NumberFormat('en-NG', {
  style: 'currency', currency: code, maximumFractionDigits: 0,
}).format(Number(amount) || 0)
const newIdempotencyKey = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
const date = (value: string | null) => value ? new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : 'Date unavailable'
const status = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase())
const statusClass = (value: string) => ({
  paid: 'bg-emerald-50 text-emerald-800', processing: 'bg-blue-50 text-blue-800', delivered: 'bg-emerald-50 text-emerald-800', completed: 'bg-emerald-50 text-emerald-800', shipped: 'bg-blue-50 text-blue-800',
  cancelled: 'bg-red-50 text-red-800', failed: 'bg-red-50 text-red-800', pending_payment: 'bg-amber-50 text-amber-800', pending_on_delivery: 'bg-amber-50 text-amber-800', refunded: 'bg-neutral-100 text-neutral-700',
}[value] || 'bg-neutral-100 text-neutral-700')
const itemImage = (item: OrderItem) => {
  const image = item.images?.[0]
  if (!image) return null
  if (typeof image === 'string') return image
  return image.thumb || image.medium || image.url || null
}

const retryPayment = async (order: CustomerOrder) => {
  if (!order.payment_method || order.payment_method === 'pay_on_delivery') return
  retryingOrderIds.value = { ...retryingOrderIds.value, [order.id]: true }
  try {
    const response = await initializePayment(order.id, order.payment_method, newIdempotencyKey())
    const payment = response.data
    sessionStorage.setItem('glamrush_pending_payment', JSON.stringify({ orderId: order.id, orderNumber: order.order_number, provider: payment.provider, reference: payment.reference, paymentMethod: order.payment_method }))
    if (payment.authorization_url) {
      window.location.assign(payment.authorization_url)
      return
    }
    await router.push({ path: '/checkout/success', query: { order: order.order_number, payment: payment.status } })
  }
  catch (error) { toast.add({ title: 'Could not retry payment', description: authErrorDetails(error, 'Payment retry could not be started for this order.').message, color: 'error' }) }
  finally { retryingOrderIds.value = { ...retryingOrderIds.value, [order.id]: false } }
}

const restoreCart = async (order: CustomerOrder) => {
  restoringOrderIds.value = { ...restoringOrderIds.value, [order.id]: true }
  try {
    const response = await restoreOrderCart(order.id)
    restoreResults.value = { ...restoreResults.value, [order.id]: response.data }
    await fetchCart()
    toast.add({ title: 'Bag restored', description: `${response.data.restored_count} item${response.data.restored_count === 1 ? '' : 's'} restored from #${order.order_number}.`, color: response.data.skipped_count ? 'warning' : 'success' })
  }
  catch (error) { toast.add({ title: 'Could not restore bag', description: authErrorDetails(error, 'This order could not be restored into your bag.').message, color: 'error' }) }
  finally { restoringOrderIds.value = { ...restoringOrderIds.value, [order.id]: false } }
}

const load = async (nextPage = 1) => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await listOrders(nextPage)
    orders.value = response.data
    page.value = response.meta?.current_page || nextPage
    lastPage.value = response.meta?.last_page || 1
  }
  catch (error) { errorMessage.value = authErrorDetails(error, 'We could not load your orders.').message }
  finally { loading.value = false }
}

onMounted(() => load())
</script>

<template>
  <section id="orders" class="scroll-mt-28 border-t border-neutral-300 pt-10">
    <div>
      <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-glam-gold">03 / Archive</p>
      <h2 class="mt-2 font-display text-4xl sm:text-5xl">Order history</h2>
      <p class="mt-3 max-w-xl text-sm leading-6 text-neutral-500">Receipts, delivery progress and every bottle in your collection.</p>
    </div>
    <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" class="mt-6" />
    <div v-if="loading" class="mt-8 space-y-4"><USkeleton v-for="index in 3" :key="index" class="h-32 rounded-none" /></div>
    <div v-else-if="orders.length" class="mt-8 space-y-4">
      <details v-for="order in orders" :key="order.id" class="group border border-neutral-200 bg-white open:border-neutral-400">
        <summary class="grid cursor-pointer list-none gap-5 p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:p-6">
          <div><p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Order</p><p class="mt-1 font-display text-xl">#{{ order.order_number }}</p></div>
          <div class="grid grid-cols-2 gap-5 sm:contents"><div><p class="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Placed</p><p class="mt-1 text-sm">{{ date(order.placed_at) }}</p></div><div><p class="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Total</p><p class="mt-1 text-sm font-semibold">{{ currency(order.total, order.currency) }}</p></div></div>
          <div class="flex items-center justify-between gap-4"><span class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" :class="statusClass(order.status)">{{ status(order.status) }}</span><UIcon name="i-lucide-chevron-down" class="size-4 transition group-open:rotate-180" /></div>
        </summary>
        <div class="border-t border-neutral-100 px-5 pb-6 sm:px-6">
          <div class="divide-y divide-neutral-100">
            <div v-for="item in order.items" :key="item.id" class="grid grid-cols-[64px_1fr_auto] gap-4 py-5">
              <div class="aspect-square overflow-hidden bg-[#eee9e1]"><img v-if="itemImage(item)" :src="itemImage(item)!" :alt="item.product_name" class="h-full w-full object-cover"><div v-else class="flex h-full items-center justify-center font-display text-xl text-neutral-300">G</div></div>
              <div class="min-w-0"><NuxtLink :to="`/product/${item.product_slug}`" class="font-medium hover:underline">{{ item.product_name }}</NuxtLink><p class="mt-1 text-xs text-neutral-400">{{ item.sku || 'Glamrush selection' }} / Qty {{ item.quantity }}</p></div>
              <p class="text-sm font-semibold">{{ currency(item.line_total, order.currency) }}</p>
            </div>
          </div>
          <div class="ml-auto mt-2 max-w-xs space-y-2 border-t border-neutral-200 pt-4 text-sm"><div class="flex justify-between text-neutral-500"><span>Subtotal</span><span>{{ currency(order.subtotal, order.currency) }}</span></div><div class="flex justify-between text-neutral-500"><span>Delivery</span><span>{{ currency(order.shipping_amount, order.currency) }}</span></div><div class="flex justify-between pt-2 font-semibold"><span>Total</span><span>{{ currency(order.total, order.currency) }}</span></div></div>

          <div v-if="order.status === 'pending_payment' || order.status === 'failed'" class="mt-6 border-t border-neutral-200 pt-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p class="text-xs font-semibold text-neutral-800">Recover this order</p><p class="mt-1 text-xs leading-5 text-neutral-500">Retry payment first. If the order is failed, restore available items into your current bag.</p></div>
              <div class="flex flex-col gap-2 sm:flex-row">
                <UButton v-if="order.status === 'pending_payment'" type="button" label="Retry payment" icon="i-lucide-credit-card" color="neutral" size="sm" class="rounded-none !text-white" :loading="retryingOrderIds[order.id]" :disabled="!order.payment_method || order.payment_method === 'pay_on_delivery' || restoringOrderIds[order.id]" @click="retryPayment(order)" />
                <UButton v-if="order.status === 'failed'" type="button" label="Restore bag" icon="i-lucide-shopping-bag" color="neutral" variant="outline" size="sm" class="rounded-none" :loading="restoringOrderIds[order.id]" :disabled="retryingOrderIds[order.id]" @click="restoreCart(order)" />
              </div>
            </div>
            <p v-if="order.status === 'pending_payment' && !order.payment_method" class="mt-3 text-xs leading-5 text-amber-800">Retry will appear here once the order response includes its payment method. You can still retry from the payment return page in the same browser session.</p>
            <div v-if="restoreResults[order.id]" class="mt-4 border border-neutral-200 bg-[#fcfaf6] p-4">
              <div class="flex items-start justify-between gap-3"><div><p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-glam-gold">Bag recovery</p><p class="mt-1 text-sm font-semibold">{{ restoreResults[order.id].restored_count }} restored, {{ restoreResults[order.id].skipped_count }} skipped</p></div><UButton to="/checkout" label="Checkout" color="neutral" size="xs" class="rounded-none !text-white" :disabled="restoreResults[order.id].restored_count === 0" /></div>
              <ul v-if="restoreResults[order.id].price_changes.length" class="mt-3 space-y-1 border-t border-neutral-200 pt-3 text-xs text-neutral-500">
                <li v-for="change in restoreResults[order.id].price_changes" :key="`${change.product_id}-${change.product_variant_id || 'base'}`" class="flex justify-between gap-3"><span>{{ change.name }}</span><span class="shrink-0">{{ currency(change.old_unit_price, order.currency) }} to {{ currency(change.new_unit_price, order.currency) }}</span></li>
              </ul>
              <ul v-if="restoreResults[order.id].skipped_items.length" class="mt-3 space-y-1 border-t border-neutral-200 pt-3 text-xs text-neutral-500">
                <li v-for="item in restoreResults[order.id].skipped_items" :key="`${item.product_id}-${item.product_variant_id || 'base'}-${item.reason}`"><b class="text-neutral-800">{{ item.name }}</b> - {{ item.message }}</li>
              </ul>
            </div>
          </div>
        </div>
      </details>
      <div v-if="lastPage > 1" class="flex items-center justify-center gap-4 pt-5"><UButton label="Previous" color="neutral" variant="outline" class="rounded-none" :disabled="page <= 1" @click="load(page - 1)" /><span class="text-xs text-neutral-500">Page {{ page }} of {{ lastPage }}</span><UButton label="Next" color="neutral" variant="outline" class="rounded-none" :disabled="page >= lastPage" @click="load(page + 1)" /></div>
    </div>
    <div v-else class="mt-8 border border-dashed border-neutral-300 bg-white/50 px-6 py-14 text-center"><UIcon name="i-lucide-package-open" class="mx-auto size-8 text-glam-gold" /><h3 class="mt-4 font-display text-2xl">No orders yet</h3><p class="mt-2 text-sm text-neutral-500">Your order archive will begin with your first purchase.</p><UButton to="/" label="Start exploring" color="neutral" variant="outline" class="mt-6 rounded-none" /></div>
  </section>
</template>
