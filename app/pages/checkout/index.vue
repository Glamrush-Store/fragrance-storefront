<script setup lang="ts">
import { PRODUCT_IMAGE_FALLBACK } from '~/utils/catalog'
import type { CustomerAddress } from '~/types/account'
import type { CartItem, CheckoutAddress, DiscountQuote, PaymentMethod, ShippingOption } from '~/types/checkout'

const router = useRouter()
const toast = useToast()
const { user, ensureSession } = useAuth()
const { listAddresses } = useCustomerAccount()
const { cartToken, items, subtotal, count, loading: cartLoading, quantityQueuedIds, quantitySavingIds, ensureCart, queueItemQuantity, removeItem, clearCart } = useCart()
const { getShippingOptions, getPaymentMethods, validateDiscount, createOrder, initializePayment } = useCheckout()

const addresses = ref<CustomerAddress[]>([])
const paymentMethods = ref<PaymentMethod[]>([])
const shippingOptions = ref<ShippingOption[]>([])
const selectedAddressId = ref('')
const selectedRateId = ref('')
const selectedPaymentCode = ref<PaymentMethod['code'] | ''>('')
const sameBilling = ref(true)
const loadingPage = ref(true)
const quoting = ref(false)
const submitting = ref(false)
const pendingItemIds = ref(new Set<string>())
const errorMessage = ref('')
const quoteMessage = ref('')
const discountCode = ref('')
const discountQuote = ref<DiscountQuote | null>(null)
const discountMessage = ref('')
const applyingDiscount = ref(false)
const pendingOrder = ref<{ id: string; order_number: string } | null>(null)
const checkoutIdempotencyKey = ref('')
const paymentIdempotencyKey = ref('')
const paymentIdempotencyMethod = ref<PaymentMethod['code'] | ''>('')
const checkoutAttemptStorageKey = 'glamrush_checkout_attempt'

const newIdempotencyKey = () => globalThis.crypto?.randomUUID?.()
  || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
const persistCheckoutAttempt = () => {
  if (!import.meta.client) return
  sessionStorage.setItem(checkoutAttemptStorageKey, JSON.stringify({
    checkoutKey: checkoutIdempotencyKey.value,
    paymentKey: paymentIdempotencyKey.value,
    paymentMethod: paymentIdempotencyMethod.value,
    order: pendingOrder.value,
  }))
}
const restoreCheckoutAttempt = () => {
  if (!import.meta.client) return
  try {
    const attempt = JSON.parse(sessionStorage.getItem(checkoutAttemptStorageKey) || 'null')
    if (!attempt || typeof attempt !== 'object') return
    if (typeof attempt.checkoutKey === 'string') checkoutIdempotencyKey.value = attempt.checkoutKey
    if (typeof attempt.paymentKey === 'string') paymentIdempotencyKey.value = attempt.paymentKey
    if (typeof attempt.paymentMethod === 'string') paymentIdempotencyMethod.value = attempt.paymentMethod
    if (attempt.order?.id && attempt.order?.order_number) pendingOrder.value = attempt.order
  }
  catch { sessionStorage.removeItem(checkoutAttemptStorageKey) }
}

const blankAddress = (): CheckoutAddress => ({ full_name: '', email: '', phone: '', country: 'NGA', state: '', city: '', postal_code: '', line1: '', line2: '' })
const shipping = reactive<CheckoutAddress>(blankAddress())
const billing = reactive<CheckoutAddress>(blankAddress())

const formatMoney = (amount: number | string, currency = 'NGN') => new Intl.NumberFormat('en-NG', {
  style: 'currency', currency, maximumFractionDigits: 0,
}).format(Number(amount) || 0)
const selectedShipping = computed(() => shippingOptions.value.find(option => option.rate_id === selectedRateId.value))
const grandTotal = computed(() => discountQuote.value
  ? Number(discountQuote.value.total)
  : subtotal.value + Number(selectedShipping.value?.amount || 0))
const paymentIcon = (code: PaymentMethod['code']) => code === 'pay_on_delivery' ? 'i-lucide-banknote' : code === 'paystack' ? 'i-lucide-credit-card' : 'i-lucide-wallet-cards'
const deliveryEstimate = (option: ShippingOption) => {
  if (!option.estimated_days_min && !option.estimated_days_max) return 'Delivery estimate provided after dispatch'
  if (option.estimated_days_min === option.estimated_days_max) return `${option.estimated_days_min} business days`
  return `${option.estimated_days_min || 1}–${option.estimated_days_max} business days`
}
const itemDetails = (item: CartItem) => {
  if (Array.isArray(item.attributes)) {
    return item.attributes.map(attribute => attribute.value || attribute.type).filter(Boolean).join(' · ')
  }
  if (item.attributes) return Object.values(item.attributes).filter(Boolean).join(' · ')
  return item.sku || ''
}

const setItemPending = (itemId: string, pending: boolean) => {
  const next = new Set(pendingItemIds.value)
  if (pending) next.add(itemId)
  else next.delete(itemId)
  pendingItemIds.value = next
}

const invalidateCheckoutQuote = () => {
  selectedRateId.value = ''
  shippingOptions.value = []
  quoteMessage.value = 'Bag updated. Recalculate delivery to continue.'
  if (discountQuote.value) discountMessage.value = 'Your bag changed. Apply the code again after recalculating delivery.'
  discountQuote.value = null
  checkoutIdempotencyKey.value = ''
  paymentIdempotencyKey.value = ''
  paymentIdempotencyMethod.value = ''
  if (import.meta.client) sessionStorage.removeItem(checkoutAttemptStorageKey)
}

const removeDiscount = () => {
  discountQuote.value = null
  discountCode.value = ''
  discountMessage.value = ''
  checkoutIdempotencyKey.value = ''
}

const applyDiscount = async () => {
  const code = discountCode.value.trim().toUpperCase()
  if (!code) {
    discountMessage.value = 'Enter a discount code first.'
    return
  }
  applyingDiscount.value = true
  discountMessage.value = ''
  try {
    const response = await validateDiscount(code, shipping.email, Number(selectedShipping.value?.amount || 0))
    discountQuote.value = response.data
    discountCode.value = response.data.code
    discountMessage.value = `${response.data.name} has been applied.`
    checkoutIdempotencyKey.value = ''
  }
  catch (error) {
    discountQuote.value = null
    discountMessage.value = authErrorDetails(error, 'This discount code could not be applied.').message
  }
  finally { applyingDiscount.value = false }
}

watch(selectedRateId, (rateId, previousRateId) => {
  if (rateId !== previousRateId && discountQuote.value && !applyingDiscount.value) void applyDiscount()
})

watch(() => shipping.email, (email, previousEmail) => {
  if (email !== previousEmail && discountQuote.value) {
    discountQuote.value = null
    discountMessage.value = 'Your checkout email changed. Apply the code again to confirm eligibility.'
    checkoutIdempotencyKey.value = ''
  }
})

watch(
  () => [shipping.country, shipping.state, shipping.city] as const,
  (location, previousLocation) => {
    if (!previousLocation || location.every((value, index) => value === previousLocation[index])) return
    selectedRateId.value = ''
    shippingOptions.value = []
    quoteMessage.value = ''
    checkoutIdempotencyKey.value = ''
  },
)

const changeItemQuantity = (item: CartItem, quantity: number) => {
  if (quantity < 1 || pendingOrder.value || pendingItemIds.value.has(item.id) || quantitySavingIds.value[item.id]) return
  invalidateCheckoutQuote()
  queueItemQuantity(item.id, quantity, (error) => {
    const details = authErrorDetails(error, 'The quantity could not be updated.')
    toast.add({ title: 'Could not update quantity', description: details.message, color: 'error' })
  })
}

const removeCartItem = async (item: CartItem) => {
  if (pendingOrder.value || pendingItemIds.value.has(item.id) || quantitySavingIds.value[item.id]) return
  setItemPending(item.id, true)
  try {
    await removeItem(item.id)
    invalidateCheckoutQuote()
  }
  catch (error) {
    const details = authErrorDetails(error, 'The item could not be removed.')
    toast.add({ title: 'Could not remove item', description: details.message, color: 'error' })
  }
  finally { setItemPending(item.id, false) }
}

const fillFromSavedAddress = () => {
  const address = addresses.value.find(item => item.id === selectedAddressId.value)
  if (!address) return
  Object.assign(shipping, {
    full_name: `${address.first_name} ${address.last_name}`.trim(), email: user.value?.email || '', phone: address.phone || '',
    country: address.country, state: address.state, city: address.city, postal_code: address.postal_code,
    line1: address.address_line_1, line2: address.address_line_2 || '',
  })
  selectedRateId.value = ''
  shippingOptions.value = []
  quoteMessage.value = ''
}

const quoteShipping = async () => {
  errorMessage.value = ''
  quoteMessage.value = ''
  selectedRateId.value = ''
  if (!shipping.country || !shipping.state || !shipping.city) {
    quoteMessage.value = 'Enter your country, state and city to see delivery options.'
    return
  }
  quoting.value = true
  try {
    const response = await getShippingOptions({
      country: shipping.country, state: shipping.state, city: shipping.city,
      postal_code: shipping.postal_code || undefined, cart_subtotal: subtotal.value,
    })
    shippingOptions.value = response.data
    if (response.data.length === 1) selectedRateId.value = response.data[0]!.rate_id
    if (!response.data.length) quoteMessage.value = 'No delivery service is currently available for this address.'
  }
  catch (error) { quoteMessage.value = authErrorDetails(error, 'We could not calculate delivery for this address.').message }
  finally { quoting.value = false }
}

const submitOrder = async () => {
  errorMessage.value = ''
  if (!items.value.length && !pendingOrder.value) { errorMessage.value = 'Your bag is empty.'; return }
  if (!selectedRateId.value) { errorMessage.value = 'Select a delivery option before continuing.'; return }
  if (!selectedPaymentCode.value) { errorMessage.value = 'Select a payment method before continuing.'; return }

  submitting.value = true
  try {
    let order = pendingOrder.value
    if (!order) {
      checkoutIdempotencyKey.value ||= newIdempotencyKey()
      const orderResponse = await createOrder({
        shipping_rate_id: selectedRateId.value,
        payment_method: selectedPaymentCode.value,
        shipping_address: { ...shipping },
        billing_address: sameBilling.value ? { same_as_shipping: true } : { ...billing },
        ...(discountQuote.value ? { discount_code: discountQuote.value.code } : {}),
      }, checkoutIdempotencyKey.value)
      order = orderResponse.data
      pendingOrder.value = { id: order.id, order_number: order.order_number }
      persistCheckoutAttempt()
    }
    if (!paymentIdempotencyKey.value || paymentIdempotencyMethod.value !== selectedPaymentCode.value) {
      paymentIdempotencyKey.value = newIdempotencyKey()
      paymentIdempotencyMethod.value = selectedPaymentCode.value
      persistCheckoutAttempt()
    }
    const paymentResponse = await initializePayment(order.id, selectedPaymentCode.value, paymentIdempotencyKey.value)
    const payment = paymentResponse.data

    if (import.meta.client) {
      sessionStorage.setItem('glamrush_pending_payment', JSON.stringify({ orderId: order.id, orderNumber: order.order_number, provider: payment.provider, reference: payment.reference, paymentMethod: selectedPaymentCode.value, cartToken: cartToken.value }))
      sessionStorage.removeItem(checkoutAttemptStorageKey)
    }
    await clearCart()

    if (payment.authorization_url) {
      window.location.assign(payment.authorization_url)
      return
    }
    await router.push({ path: '/checkout/success', query: { order: order.order_number, payment: payment.status } })
  }
  catch (error) { errorMessage.value = authErrorDetails(error, pendingOrder.value ? 'Your order was created, but payment could not start. Use the button to retry payment without creating another order.' : 'We could not place your order. Please review your details and try again.').message }
  finally { submitting.value = false }
}

onMounted(async () => {
  try {
    restoreCheckoutAttempt()
    await ensureSession()
    await ensureCart()
    const tasks: Promise<unknown>[] = [getPaymentMethods().then(response => {
      paymentMethods.value = response.data
      if (paymentIdempotencyMethod.value && response.data.some(method => method.code === paymentIdempotencyMethod.value)) selectedPaymentCode.value = paymentIdempotencyMethod.value
      else if (response.data.length === 1) selectedPaymentCode.value = response.data[0]!.code
    })]
    if (user.value) tasks.push(listAddresses().then(response => {
      addresses.value = response.data
      const preferred = response.data.find(address => address.is_default) || response.data[0]
      if (preferred) { selectedAddressId.value = preferred.id; fillFromSavedAddress() }
      else { shipping.full_name = user.value?.name || ''; shipping.email = user.value?.email || ''; shipping.phone = user.value?.phone || '' }
    }))
    await Promise.all(tasks)
  }
  catch (error) { errorMessage.value = authErrorDetails(error, 'We could not prepare checkout.').message }
  finally { loadingPage.value = false }
})

useSeoMeta({ title: 'Checkout — Glamrush', description: 'Securely complete your Glamrush order.' })
</script>

<template>
  <div class="min-h-screen bg-glam-ivory text-glam-ink">
    <header class="border-b border-neutral-200 bg-white">
      <div class="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="font-display text-xl tracking-[0.12em]">GLAMRUSH</NuxtLink>
        <div class="flex items-center gap-2 text-xs text-neutral-500"><UIcon name="i-lucide-lock-keyhole" class="size-4 text-glam-gold" /> Secure checkout</div>
      </div>
    </header>

    <main class="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div class="mb-10 flex flex-col gap-4 border-b border-neutral-300 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div><p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-glam-gold">The final note</p><h1 class="mt-2 font-display text-5xl sm:text-7xl">Checkout</h1></div>
        <p class="max-w-sm text-sm leading-6 text-neutral-500">Delivery details, your preferred service, then secure payment. Nothing unnecessary.</p>
      </div>

      <div v-if="loadingPage || (cartLoading && !items.length)" class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]"><div class="space-y-5"><USkeleton class="h-72 rounded-none" /><USkeleton class="h-52 rounded-none" /></div><USkeleton class="h-[34rem] rounded-none" /></div>

      <div v-else-if="!items.length" class="border border-dashed border-neutral-300 bg-white px-6 py-20 text-center"><UIcon name="i-lucide-shopping-bag" class="mx-auto size-9 text-glam-gold" /><h2 class="mt-5 font-display text-4xl">Your bag is empty</h2><p class="mt-3 text-sm text-neutral-500">Choose a fragrance before beginning checkout.</p><UButton to="/" label="Explore fragrances" color="neutral" class="mt-7 rounded-none !text-white" /></div>

      <form v-else class="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14" @submit.prevent="submitOrder">
        <div class="space-y-12">
          <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" />

          <section>
            <div class="flex items-baseline gap-4"><span class="font-display text-3xl text-glam-gold">01</span><div><h2 class="font-display text-3xl">Shipping details</h2><p class="mt-1 text-sm text-neutral-500">Where should your fragrance arrive?</p></div></div>
            <div class="mt-6 border border-neutral-200 bg-white p-5 sm:p-8">
              <label v-if="addresses.length" class="mb-6 block border-b border-neutral-100 pb-6"><span class="mb-2 block text-xs font-semibold">Use a saved address</span><select v-model="selectedAddressId" class="h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950" @change="fillFromSavedAddress"><option value="">Enter a different address</option><option v-for="address in addresses" :key="address.id" :value="address.id">{{ address.label || 'Address' }} — {{ address.address_line_1 }}, {{ address.city }}</option></select></label>
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Full name</span><UInput v-model="shipping.full_name" autocomplete="name" class="w-full" required /></label>
                <label class="block"><span class="mb-2 block text-xs font-semibold">Email</span><UInput v-model="shipping.email" type="email" autocomplete="email" class="w-full" required /></label>
                <label class="block"><span class="mb-2 block text-xs font-semibold">Phone</span><UInput v-model="shipping.phone" type="tel" autocomplete="tel" class="w-full" required /></label>
                <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Address line 1</span><UInput v-model="shipping.line1" autocomplete="address-line1" class="w-full" required /></label>
                <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Address line 2 <span class="font-normal text-neutral-400">(optional)</span></span><UInput v-model="shipping.line2" autocomplete="address-line2" class="w-full" /></label>
                <AddressLocationFields v-model:country="shipping.country" v-model:state="shipping.state" v-model:city="shipping.city" />
                <label class="block"><span class="mb-2 block text-xs font-semibold">Postal code</span><UInput v-model="shipping.postal_code" autocomplete="postal-code" class="w-full" /></label>
              </div>
            </div>
          </section>

          <section>
            <div class="flex items-baseline gap-4"><span class="font-display text-3xl text-glam-gold">02</span><div><h2 class="font-display text-3xl">Delivery service</h2><p class="mt-1 text-sm text-neutral-500">Rates are calculated from your destination and bag value.</p></div></div>
            <div class="mt-6 border border-neutral-200 bg-white p-5 sm:p-8">
              <UButton type="button" label="Calculate delivery options" icon="i-lucide-truck" color="neutral" variant="outline" class="rounded-none" :loading="quoting" @click="quoteShipping" />
              <p v-if="quoteMessage" class="mt-4 text-sm text-amber-800">{{ quoteMessage }}</p>
              <div v-if="shippingOptions.length" class="mt-6 grid gap-3">
                <label v-for="option in shippingOptions" :key="option.rate_id" class="flex cursor-pointer items-center gap-4 border p-4 transition" :class="selectedRateId === option.rate_id ? 'border-neutral-950 bg-[#fffdf7]' : 'border-neutral-200 hover:border-neutral-400'"><input v-model="selectedRateId" type="radio" name="shipping-rate" :value="option.rate_id" class="size-4 accent-neutral-950"><span class="min-w-0 flex-1"><b class="block text-sm">{{ option.method }}</b><span v-if="option.description" class="mt-1 block text-xs text-neutral-500">{{ option.description }}</span><span class="mt-1 block text-xs text-neutral-400">{{ option.zone }} · {{ deliveryEstimate(option) }}</span></span><b class="text-sm">{{ Number(option.amount) === 0 ? 'Complimentary' : formatMoney(option.amount, option.currency) }}</b></label>
              </div>
            </div>
          </section>

          <section>
            <div class="flex items-baseline gap-4"><span class="font-display text-3xl text-glam-gold">03</span><div><h2 class="font-display text-3xl">Payment</h2><p class="mt-1 text-sm text-neutral-500">Choose one of the methods currently enabled by Glamrush.</p></div></div>
            <div class="mt-6 border border-neutral-200 bg-white p-5 sm:p-8">
              <div v-if="paymentMethods.length" class="grid gap-3">
                <label v-for="method in paymentMethods" :key="method.id" class="flex cursor-pointer items-center gap-4 border p-4 transition" :class="selectedPaymentCode === method.code ? 'border-neutral-950 bg-[#fffdf7]' : 'border-neutral-200 hover:border-neutral-400'"><input v-model="selectedPaymentCode" type="radio" name="payment-method" :value="method.code" class="size-4 accent-neutral-950"><UIcon :name="paymentIcon(method.code)" class="size-5 text-glam-gold" /><span><b class="block text-sm">{{ method.name }}</b><span v-if="method.description" class="mt-1 block text-xs leading-5 text-neutral-500">{{ method.description }}</span></span></label>
              </div>
              <p v-else class="text-sm text-red-700">No payment methods are currently available.</p>

              <label class="mt-7 flex cursor-pointer items-center gap-3 border-t border-neutral-100 pt-6 text-sm"><input v-model="sameBilling" type="checkbox" class="size-4 accent-neutral-950"> Billing address is the same as shipping</label>
              <div v-if="!sameBilling" class="mt-6 grid gap-5 border-t border-neutral-100 pt-6 sm:grid-cols-2">
                <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Full name</span><UInput v-model="billing.full_name" class="w-full" required /></label><label class="block"><span class="mb-2 block text-xs font-semibold">Email</span><UInput v-model="billing.email" type="email" class="w-full" required /></label><label class="block"><span class="mb-2 block text-xs font-semibold">Phone</span><UInput v-model="billing.phone" type="tel" class="w-full" required /></label><label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Address line 1</span><UInput v-model="billing.line1" class="w-full" required /></label><label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Address line 2</span><UInput v-model="billing.line2" class="w-full" /></label><AddressLocationFields v-model:country="billing.country" v-model:state="billing.state" v-model:city="billing.city" /><label class="block"><span class="mb-2 block text-xs font-semibold">Postal code</span><UInput v-model="billing.postal_code" class="w-full" /></label>
              </div>
            </div>
          </section>
        </div>

        <aside class="border border-neutral-200 bg-white lg:sticky lg:top-8">
          <div class="border-b border-neutral-200 p-6"><div class="flex items-end justify-between"><div><p class="text-[10px] uppercase tracking-[0.18em] text-glam-gold">Your selection</p><h2 class="mt-1 font-display text-3xl">Order summary</h2></div><span class="text-xs text-neutral-400">{{ count }} {{ count === 1 ? 'item' : 'items' }}</span></div></div>
          <p v-if="pendingOrder" class="border-b border-amber-200 bg-amber-50 px-6 py-3 text-xs leading-5 text-amber-900">Your order has already been created. Bag editing is paused while you retry payment.</p>
          <div class="max-h-[30rem] divide-y divide-neutral-100 overflow-auto px-6">
            <div v-for="item in items" :key="item.id" class="grid grid-cols-[68px_minmax(0,1fr)] gap-4 py-5 transition-opacity" :class="pendingItemIds.has(item.id) || quantitySavingIds[item.id] ? 'pointer-events-none opacity-50' : ''">
              <NuxtLink :to="`/product/${item.slug}`" class="aspect-[4/5] overflow-hidden bg-[#eee9e1]"><img :src="item.thumb || PRODUCT_IMAGE_FALLBACK" :alt="item.name" class="h-full w-full" :class="item.thumb ? 'object-cover' : 'object-contain'"></NuxtLink>
              <div class="min-w-0">
                <div class="flex items-start justify-between gap-3"><div class="min-w-0"><NuxtLink :to="`/product/${item.slug}`" class="line-clamp-2 text-sm font-medium leading-5 hover:underline">{{ item.name }}</NuxtLink><p v-if="itemDetails(item)" class="mt-1 truncate text-[10px] uppercase tracking-[0.1em] text-neutral-400">{{ itemDetails(item) }}</p></div><p class="shrink-0 text-sm font-semibold">{{ formatMoney(Number(item.unit_price) * item.quantity) }}</p></div>
                <div class="mt-4 flex items-center justify-between gap-3">
                  <div class="inline-flex h-8 items-center border bg-white transition-colors" :class="quantityQueuedIds[item.id] ? 'border-glam-gold' : 'border-neutral-300'">
                    <UButton type="button" icon="i-lucide-minus" :aria-label="`Decrease ${item.name} quantity`" color="neutral" variant="ghost" square size="xs" class="h-full rounded-none" :disabled="item.quantity <= 1 || pendingItemIds.has(item.id) || quantitySavingIds[item.id] || Boolean(pendingOrder)" @click="changeItemQuantity(item, item.quantity - 1)" />
                    <span class="min-w-8 text-center text-xs font-semibold tabular-nums" aria-live="polite">{{ item.quantity }}</span>
                    <UButton type="button" icon="i-lucide-plus" :aria-label="`Increase ${item.name} quantity`" color="neutral" variant="ghost" square size="xs" class="h-full rounded-none" :disabled="pendingItemIds.has(item.id) || quantitySavingIds[item.id] || Boolean(pendingOrder)" @click="changeItemQuantity(item, item.quantity + 1)" />
                  </div>
                  <span v-if="quantityQueuedIds[item.id] || quantitySavingIds[item.id]" class="ml-auto flex items-center gap-1.5 text-[10px] text-neutral-400"><UIcon name="i-lucide-loader-circle" class="size-3 animate-spin" />{{ quantityQueuedIds[item.id] ? 'Waiting…' : 'Updating…' }}</span>
                  <UButton type="button" label="Remove" icon="i-lucide-trash-2" :aria-label="`Remove ${item.name} from bag`" color="neutral" variant="link" size="xs" class="p-0 text-neutral-400 hover:text-red-700" :disabled="pendingItemIds.has(item.id) || quantitySavingIds[item.id] || Boolean(pendingOrder)" @click="removeCartItem(item)" />
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-neutral-200 bg-[#fcfaf6] px-6 py-5">
            <div class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              <UIcon name="i-lucide-ticket-percent" class="size-3.5 text-glam-gold" />
              A private offer
            </div>
            <div v-if="!discountQuote" class="mt-3 flex gap-2">
              <UInput v-model="discountCode" name="discount-code" autocomplete="off" placeholder="DISCOUNT CODE" class="min-w-0 flex-1" :disabled="applyingDiscount || Boolean(pendingOrder)" @keydown.enter.prevent="applyDiscount" />
              <UButton type="button" label="Apply" color="neutral" variant="outline" class="rounded-none" :loading="applyingDiscount" :disabled="!discountCode.trim() || Boolean(pendingOrder)" @click="applyDiscount" />
            </div>
            <div v-else class="mt-3 flex items-center justify-between gap-4 border border-emerald-700/20 bg-emerald-50 px-3 py-2.5">
              <div class="min-w-0"><p class="truncate text-xs font-bold tracking-[0.08em] text-emerald-900">{{ discountQuote.code }}</p><p class="mt-0.5 truncate text-[11px] text-emerald-800">{{ discountQuote.name }}</p></div>
              <UButton type="button" label="Remove" color="neutral" variant="link" size="xs" class="shrink-0 p-0 text-emerald-900" :disabled="Boolean(pendingOrder)" @click="removeDiscount" />
            </div>
            <p v-if="discountMessage" class="mt-2 text-xs leading-5" :class="discountQuote ? 'text-emerald-800' : 'text-amber-800'" aria-live="polite">{{ discountMessage }}</p>
          </div>
          <dl class="space-y-3 border-t border-neutral-200 p-6 text-sm">
            <div class="flex justify-between text-neutral-500"><dt>Subtotal</dt><dd>{{ formatMoney(subtotal) }}</dd></div>
            <div v-if="discountQuote && Number(discountQuote.discount_amount) > 0" class="flex justify-between text-emerald-800"><dt>Offer · {{ discountQuote.code }}</dt><dd>−{{ formatMoney(discountQuote.discount_amount) }}</dd></div>
            <div class="flex justify-between text-neutral-500"><dt>Delivery</dt><dd>{{ selectedShipping ? (Number(selectedShipping.amount) === 0 ? 'Complimentary' : formatMoney(selectedShipping.amount, selectedShipping.currency)) : 'Calculated next' }}</dd></div>
            <div v-if="discountQuote && Number(discountQuote.shipping_discount_amount) > 0" class="flex justify-between text-emerald-800"><dt>Delivery offer</dt><dd>−{{ formatMoney(discountQuote.shipping_discount_amount) }}</dd></div>
            <div class="flex justify-between border-t border-neutral-200 pt-5 font-display text-2xl"><dt>Total</dt><dd>{{ formatMoney(grandTotal) }}</dd></div>
          </dl>
          <div class="px-6 pb-6"><UButton type="submit" :label="selectedPaymentCode === 'pay_on_delivery' ? 'Place order' : 'Continue to secure payment'" icon="i-lucide-lock-keyhole" color="neutral" size="xl" block class="rounded-none !text-white" :loading="submitting" :disabled="!selectedRateId || !selectedPaymentCode || !paymentMethods.length" /><p class="mt-4 text-center text-[10px] uppercase tracking-[0.12em] text-neutral-400">Encrypted checkout · Secure payment</p></div>
        </aside>
      </form>
    </main>
  </div>
</template>
