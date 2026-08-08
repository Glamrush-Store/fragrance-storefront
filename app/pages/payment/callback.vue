<script setup lang="ts">
import type { PaymentInitialization } from '~/types/checkout'

type CallbackState = 'verifying' | 'completed' | 'failed'

const route = useRoute()
const { verifyPayment } = useCheckout()
const { user, ensureSession } = useAuth()
const state = ref<CallbackState>('verifying')
const message = ref('Confirming this transaction directly with the payment provider.')
const result = ref<PaymentInitialization | null>(null)
const confirmedAt = ref<Date | null>(null)

const pendingPayment = ref<{ orderId?: string; orderNumber?: string; provider?: string; reference?: string }>({})
const provider = computed(() => {
  const value = typeof route.query.provider === 'string' ? route.query.provider.toLowerCase() : pendingPayment.value.provider?.toLowerCase()
  return value === 'paystack' || value === 'flutterwave' ? value : null
})
const transactionId = computed(() => String(route.query.transaction_id || route.query.reference || pendingPayment.value.reference || ''))
const callbackReference = computed(() => String(route.query.tx_ref || route.query.reference || result.value?.reference || ''))
const receiptOrder = computed(() => pendingPayment.value.orderNumber || result.value?.payment.order_id || 'Unavailable')

const formatMoney = (amount: number | string, currency: string) => new Intl.NumberFormat('en-NG', {
  style: 'currency', currency: currency || 'NGN', minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(Number(amount) || 0)
const formatDate = (value: Date | null) => value ? new Intl.DateTimeFormat('en-NG', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(value) : '—'
const providerName = computed(() => provider.value === 'flutterwave' ? 'Flutterwave' : provider.value === 'paystack' ? 'Paystack' : 'Payment provider')

const validatePayment = async () => {
  state.value = 'verifying'
  message.value = 'Confirming this transaction directly with the payment provider.'
  result.value = null

  if (!provider.value) {
    state.value = 'failed'
    message.value = 'The callback contains an unsupported or missing payment provider.'
    return
  }
  if (!transactionId.value) {
    state.value = 'failed'
    message.value = 'The callback does not contain a transaction ID that can be verified.'
    return
  }

  try {
    const response = await verifyPayment(provider.value, transactionId.value)
    result.value = response.data

    if (response.data.payment.status !== 'paid') {
      state.value = 'failed'
      message.value = `The provider returned “${response.data.payment.status}”. This payment has not been confirmed.`
      return
    }

    confirmedAt.value = new Date()
    state.value = 'completed'
    message.value = 'Your payment was independently verified and your order is confirmed.'
    sessionStorage.removeItem('glamrush_pending_payment')
  }
  catch (error) {
    state.value = 'failed'
    message.value = authErrorDetails(error, 'We could not verify this transaction. The order has not been marked as paid.').message
  }
}

const printReceipt = () => window.print()

onMounted(async () => {
  try { pendingPayment.value = JSON.parse(sessionStorage.getItem('glamrush_pending_payment') || '{}') }
  catch { pendingPayment.value = {} }
  ensureSession()
  await validatePayment()
})

useSeoMeta({ title: 'Payment confirmation — Glamrush', description: 'Verify your Glamrush payment and view your receipt.', robots: 'noindex' })
</script>

<template>
  <div class="payment-callback min-h-screen bg-[#f2ede4] text-glam-ink">
    <header class="receipt-nav border-b border-neutral-900/10">
      <div class="mx-auto flex h-20 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <NuxtLink to="/" class="font-display text-xl tracking-[0.12em]">GLAMRUSH</NuxtLink>
        <span class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500"><UIcon name="i-lucide-shield-check" class="size-4 text-glam-gold" /> Provider verified</span>
      </div>
    </header>

    <main class="mx-auto grid min-h-[calc(100svh-81px)] max-w-[1120px] place-items-center px-5 py-12 sm:px-8 sm:py-20">
      <section v-if="state === 'verifying'" class="w-full max-w-xl border border-neutral-900/10 bg-white p-8 text-center shadow-[0_35px_100px_rgba(48,36,24,.08)] sm:p-12" aria-live="polite">
        <div class="mx-auto grid size-16 place-items-center rounded-full border border-glam-gold/40"><UIcon name="i-lucide-loader-circle" class="size-7 animate-spin text-glam-gold" /></div>
        <p class="mt-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-glam-gold">Secure validation</p>
        <h1 class="mt-3 font-display text-4xl sm:text-5xl">Verifying payment</h1>
        <p class="mx-auto mt-5 max-w-sm text-sm leading-7 text-neutral-500">{{ message }}</p>
        <p class="mt-8 text-[10px] uppercase tracking-[0.14em] text-neutral-400">Do not close this page</p>
      </section>

      <section v-else-if="state === 'completed' && result" class="receipt-sheet w-full overflow-hidden border border-neutral-900/10 bg-[#fffdfa] shadow-[0_35px_100px_rgba(48,36,24,.1)]">
        <div class="grid lg:grid-cols-[1fr_430px]">
          <div class="relative overflow-hidden bg-[#173d31] p-8 text-white sm:p-12 lg:p-16">
            <div class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10" /><div class="pointer-events-none absolute -right-10 -top-10 size-52 rounded-full border border-[#d1ae61]/30" />
            <div class="relative"><div class="grid size-14 place-items-center rounded-full bg-white text-[#173d31]"><UIcon name="i-lucide-check" class="size-7" /></div><p class="mt-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e4ca8a]">Payment complete</p><h1 class="mt-4 max-w-xl font-display text-5xl leading-[.92] sm:text-6xl">Thank you.<br>Your order is confirmed.</h1><p class="mt-7 max-w-md text-sm leading-7 text-white/65">{{ message }}</p></div>
          </div>

          <div class="p-7 sm:p-10">
            <div class="flex items-start justify-between gap-5 border-b border-neutral-200 pb-6"><div><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-glam-gold">Official receipt</p><h2 class="mt-2 font-display text-3xl">Payment details</h2></div><UIcon name="i-lucide-receipt-text" class="size-6 text-neutral-300" /></div>
            <dl class="divide-y divide-neutral-100 text-sm">
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Order</dt><dd class="break-all text-right font-semibold">{{ receiptOrder === 'Unavailable' ? receiptOrder : `#${receiptOrder}` }}</dd></div>
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Amount paid</dt><dd class="text-right font-display text-xl">{{ formatMoney(result.payment.amount, result.payment.currency) }}</dd></div>
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Provider</dt><dd class="text-right">{{ providerName }}</dd></div>
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Reference</dt><dd class="break-all text-right font-mono text-xs">{{ callbackReference || result.payment.reference }}</dd></div>
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Transaction ID</dt><dd class="break-all text-right font-mono text-xs">{{ result.payment.transaction_id || transactionId }}</dd></div>
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Confirmed</dt><dd class="text-right">{{ formatDate(confirmedAt) }}</dd></div>
              <div class="grid grid-cols-[120px_1fr] gap-4 py-4"><dt class="text-neutral-400">Status</dt><dd class="text-right"><span class="bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">Paid</span></dd></div>
            </dl>
            <div class="receipt-actions mt-7 grid gap-3"><UButton to="/" label="Continue shopping" icon="i-lucide-arrow-right" trailing color="neutral" size="xl" class="rounded-none !text-white" /><UButton v-if="user" to="/account#orders" label="View order history" color="neutral" variant="outline" class="rounded-none" /><UButton type="button" label="Print receipt" icon="i-lucide-printer" color="neutral" variant="ghost" class="rounded-none" @click="printReceipt" /></div>
          </div>
        </div>
      </section>

      <section v-else class="w-full max-w-2xl border border-neutral-900/10 bg-white p-8 text-center shadow-[0_35px_100px_rgba(48,36,24,.08)] sm:p-12" aria-live="polite">
        <div class="mx-auto grid size-16 place-items-center rounded-full bg-red-50"><UIcon name="i-lucide-x" class="size-7 text-red-700" /></div>
        <p class="mt-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-700">Payment not confirmed</p>
        <h1 class="mt-3 font-display text-4xl sm:text-5xl">Something didn’t complete.</h1>
        <p class="mx-auto mt-5 max-w-lg text-sm leading-7 text-neutral-500">{{ message }}</p>
        <div class="mt-5 inline-flex items-center gap-2 bg-neutral-100 px-3 py-2 font-mono text-[10px] text-neutral-500"><span>{{ providerName }}</span><span>·</span><span>{{ callbackReference || transactionId || 'No reference' }}</span></div>
        <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><UButton type="button" label="Check payment again" icon="i-lucide-refresh-cw" color="neutral" class="rounded-none !text-white" @click="validatePayment" /><UButton v-if="user" to="/account#orders" label="View order history" color="neutral" variant="outline" class="rounded-none" /><UButton to="/" label="Continue shopping" color="neutral" variant="ghost" class="rounded-none" /></div>
      </section>
    </main>
  </div>
</template>

<style scoped>
@media print {
  .payment-callback { min-height: auto; background: white; }
  .receipt-nav, .receipt-actions { display: none !important; }
  main { min-height: auto; padding: 0; }
  .receipt-sheet { border: 0; box-shadow: none; }
}
</style>
