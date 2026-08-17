<script setup lang="ts">
import type { OrderRestoreCartResult, PaymentMethod } from '~/types/checkout'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { verifyPayment, initializePayment, restoreOrderCart } = useCheckout()
const { fetchCart } = useCart()
const state = ref<'verifying' | 'failed'>('verifying')
const message = ref('Confirming your payment with the provider...')
const pendingPayment = ref<{ orderId?: string; orderNumber?: string; provider?: string; reference?: string; paymentMethod?: PaymentMethod['code']; cartToken?: string | null }>({})
const retrying = ref(false)
const restoring = ref(false)
const restoreResult = ref<OrderRestoreCartResult | null>(null)
const restoreError = ref('')
const canRetryPayment = computed(() => Boolean(pendingPayment.value.orderId && pendingPayment.value.paymentMethod && pendingPayment.value.paymentMethod !== 'pay_on_delivery'))
const newIdempotencyKey = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
const money = (amount: number | string, currency = 'NGN') => new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount) || 0)

const retryPayment = async () => {
  if (!pendingPayment.value.orderId || !pendingPayment.value.paymentMethod) {
    message.value = 'This browser no longer has the order details needed to retry payment.'
    return
  }
  retrying.value = true
  restoreResult.value = null
  restoreError.value = ''
  try {
    const response = await initializePayment(pendingPayment.value.orderId, pendingPayment.value.paymentMethod, newIdempotencyKey(), pendingPayment.value.cartToken)
    const payment = response.data
    sessionStorage.setItem('glamrush_pending_payment', JSON.stringify({ ...pendingPayment.value, provider: payment.provider, reference: payment.reference }))
    if (payment.authorization_url) {
      window.location.assign(payment.authorization_url)
      return
    }
    await router.push({ path: '/checkout/success', query: { order: pendingPayment.value.orderNumber, payment: payment.status } })
  }
  catch (error) { message.value = authErrorDetails(error, 'We could not restart payment for this order. Restore your bag as a fallback, then check out again.').message }
  finally { retrying.value = false }
}

const restoreCart = async () => {
  if (!pendingPayment.value.orderId) return
  restoring.value = true
  restoreError.value = ''
  try {
    const response = await restoreOrderCart(pendingPayment.value.orderId, false, pendingPayment.value.cartToken)
    restoreResult.value = response.data
    restoreError.value = ''
    await fetchCart()
    toast.add({ title: 'Bag restored', description: `${response.data.restored_count} item${response.data.restored_count === 1 ? '' : 's'} restored.`, color: response.data.skipped_count ? 'warning' : 'success' })
  }
  catch (error) { restoreError.value = authErrorDetails(error, 'We could not restore this order into your bag.').message }
  finally { restoring.value = false }
}

onMounted(async () => {
  let pending: typeof pendingPayment.value = {}
  try { pending = JSON.parse(sessionStorage.getItem('glamrush_pending_payment') || '{}') }
  catch { pending = {} }
  pendingPayment.value = pending

  const queryProvider = typeof route.query.provider === 'string' ? route.query.provider : ''
  const provider = (queryProvider || pending.provider || (route.query.transaction_id ? 'flutterwave' : 'paystack')) as 'paystack' | 'flutterwave'
  const transactionId = String(route.query.transaction_id || route.query.reference || pending.reference || '')

  if (!['paystack', 'flutterwave'].includes(provider) || !transactionId) {
    state.value = 'failed'
    message.value = 'The payment provider did not return enough information to verify this transaction.'
    return
  }

  if (route.query.status === 'cancelled') {
    state.value = 'failed'
    message.value = 'Payment was cancelled. Your order remains unpaid.'
    return
  }

  try {
    const response = await verifyPayment(provider, transactionId)
    if (response.data.payment.status !== 'paid') {
      state.value = 'failed'
      message.value = 'The provider has not confirmed this payment. Please retry payment first, or restore your bag if the order has failed.'
      return
    }
    sessionStorage.removeItem('glamrush_pending_payment')
    await router.replace({ path: '/checkout/success', query: { order: pending.orderNumber, payment: 'paid' } })
  }
  catch (error) {
    state.value = 'failed'
    message.value = authErrorDetails(error, 'We could not verify your payment. Your order has not been marked as paid.').message
  }
})

useSeoMeta({ title: 'Verifying payment - Glamrush', robots: 'noindex' })
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-glam-ivory px-5 text-glam-ink">
    <main class="w-full max-w-xl border border-neutral-200 bg-white p-8 text-center shadow-[0_30px_90px_rgba(44,31,20,.08)] sm:p-12">
      <template v-if="state === 'verifying'">
        <div class="mx-auto grid size-14 place-items-center rounded-full border border-glam-gold/40"><UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-glam-gold" /></div>
        <p class="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-glam-gold">Secure confirmation</p>
        <h1 class="mt-3 font-display text-4xl">Verifying payment</h1>
        <p class="mx-auto mt-4 max-w-sm text-sm leading-6 text-neutral-500">{{ message }}</p>
      </template>
      <template v-else>
        <div class="mx-auto grid size-14 place-items-center rounded-full bg-red-50"><UIcon name="i-lucide-circle-alert" class="size-6 text-red-700" /></div>
        <p class="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">Payment needs attention</p>
        <h1 class="mt-3 font-display text-4xl">Not yet confirmed</h1>
        <p class="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">{{ message }}</p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <UButton type="button" label="Retry payment" icon="i-lucide-credit-card" color="neutral" class="rounded-none !text-white" :loading="retrying" :disabled="!canRetryPayment || restoring" @click="retryPayment" />
          <UButton type="button" label="Restore bag" icon="i-lucide-shopping-bag" color="neutral" variant="outline" class="rounded-none" :loading="restoring" :disabled="!pendingPayment.orderId || retrying" @click="restoreCart" />
          <UButton to="/" label="Return home" color="neutral" variant="ghost" class="rounded-none" />
        </div>
        <p v-if="restoreError" class="mx-auto mt-4 max-w-md text-sm font-semibold leading-6 text-red-700">{{ restoreError }}</p>
        <div v-if="restoreResult" class="mt-8 border border-neutral-200 bg-[#fcfaf6] p-5 text-left">
          <div class="flex items-start justify-between gap-4"><div><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-glam-gold">Bag recovery</p><h2 class="mt-1 font-display text-2xl">{{ restoreResult.restored_count }} restored, {{ restoreResult.skipped_count }} skipped</h2></div><UButton to="/checkout" label="Checkout" color="neutral" size="sm" class="rounded-none !text-white" :disabled="restoreResult.restored_count === 0" /></div>
          <ul v-if="restoreResult.price_changes.length" class="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
            <li v-for="change in restoreResult.price_changes" :key="`${change.product_id}-${change.product_variant_id || 'base'}`" class="flex justify-between gap-4"><span>{{ change.name }}</span><span>{{ money(change.old_unit_price) }} to {{ money(change.new_unit_price) }}</span></li>
          </ul>
          <ul v-if="restoreResult.skipped_items.length" class="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
            <li v-for="item in restoreResult.skipped_items" :key="`${item.product_id}-${item.product_variant_id || 'base'}-${item.reason}`"><b class="text-neutral-800">{{ item.name }}</b> - {{ item.message }}</li>
          </ul>
        </div>
        <UButton to="/account#orders" label="View order history" color="neutral" variant="link" class="mt-5 rounded-none" />
      </template>
    </main>
  </div>
</template>
