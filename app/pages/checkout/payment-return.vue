<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { verifyPayment } = useCheckout()
const state = ref<'verifying' | 'failed'>('verifying')
const message = ref('Confirming your payment with the provider…')

onMounted(async () => {
  let pending: { orderId?: string; orderNumber?: string; provider?: string; reference?: string } = {}
  try { pending = JSON.parse(sessionStorage.getItem('glamrush_pending_payment') || '{}') }
  catch { pending = {} }

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
      message.value = 'The provider has not confirmed this payment. Please check again or contact support.'
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

useSeoMeta({ title: 'Verifying payment — Glamrush', robots: 'noindex' })
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
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><UButton to="/account#orders" label="View order history" color="neutral" class="rounded-none !text-white" /><UButton to="/" label="Return home" color="neutral" variant="outline" class="rounded-none" /></div>
      </template>
    </main>
  </div>
</template>
