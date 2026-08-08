<script setup lang="ts">
const route = useRoute()
const { user, ensureSession } = useAuth()
const orderNumber = computed(() => typeof route.query.order === 'string' && route.query.order ? route.query.order : null)
const payOnDelivery = computed(() => route.query.payment === 'pending_on_delivery')

onMounted(() => ensureSession())
useSeoMeta({ title: 'Order confirmed — Glamrush', description: 'Your Glamrush order has been received.', robots: 'noindex' })
</script>

<template>
  <div class="min-h-screen bg-[#f3eee5] text-glam-ink">
    <header class="border-b border-neutral-900/10"><div class="mx-auto flex h-20 max-w-[1100px] items-center justify-between px-5"><NuxtLink to="/" class="font-display text-xl tracking-[0.12em]">GLAMRUSH</NuxtLink><span class="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Order confirmed</span></div></header>
    <main class="mx-auto grid min-h-[calc(100svh-81px)] max-w-[1100px] items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_.8fr]">
      <div>
        <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-full bg-emerald-800 text-white"><UIcon name="i-lucide-check" class="size-5" /></span><span class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">Order received</span></div>
        <h1 class="mt-8 max-w-2xl font-display text-[clamp(4rem,9vw,7.5rem)] leading-[.84] tracking-[-0.05em]">Your scent is on its way.</h1>
        <p class="mt-8 max-w-lg text-sm leading-7 text-neutral-600">{{ payOnDelivery ? 'Your order is confirmed. Payment will be collected according to the selected delivery method.' : 'Payment is confirmed and we’re preparing your order. A confirmation has been sent to your email.' }}</p>
      </div>
      <aside class="border border-neutral-900/10 bg-white/70 p-7 sm:p-9">
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-glam-gold">Receipt</p>
        <div class="mt-6 border-y border-neutral-200 py-6"><p class="text-xs text-neutral-400">Order number</p><p class="mt-2 font-display text-3xl">{{ orderNumber ? `#${orderNumber}` : 'Confirmed' }}</p></div>
        <div class="mt-6 space-y-3 text-sm text-neutral-600"><p class="flex items-center gap-3"><UIcon name="i-lucide-mail-check" class="size-4 text-glam-gold" /> Confirmation sent by email</p><p class="flex items-center gap-3"><UIcon name="i-lucide-package-check" class="size-4 text-glam-gold" /> Tracking follows after dispatch</p></div>
        <div class="mt-8 grid gap-3"><UButton v-if="user" to="/account#orders" label="View order history" color="neutral" class="rounded-none !text-white" /><UButton v-else to="/auth/sign-in" label="Sign in to your account" color="neutral" class="rounded-none !text-white" /><UButton to="/" label="Continue shopping" color="neutral" variant="outline" class="rounded-none" /></div>
      </aside>
    </main>
  </div>
</template>
