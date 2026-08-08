<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()
const loggingOut = ref(false)

const signOut = async () => {
  loggingOut.value = true
  try {
    await logout()
    await router.push('/')
  }
  finally {
    loggingOut.value = false
  }
}

const initials = computed(() => user.value?.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'GR')

useSeoMeta({ title: 'My account — Glamrush', description: 'Manage your Glamrush account.' })
</script>

<template>
  <div class="min-h-screen bg-glam-ivory text-glam-ink">
    <LayoutAppHeader />
    <main class="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <UAlert v-if="route.query.welcome" title="Welcome to Glamrush" description="Your private fragrance account is ready." color="success" variant="subtle" class="mb-8" />

      <header class="grid gap-8 border-b border-neutral-300 pb-10 md:grid-cols-[auto_1fr_auto] md:items-end">
        <div class="flex size-20 items-center justify-center rounded-full bg-neutral-950 font-display text-2xl text-white">{{ initials }}</div>
        <div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-glam-gold">Private account</p><h1 class="mt-2 font-display text-5xl sm:text-6xl">Hello, {{ user?.name?.split(' ')[0] }}.</h1><p class="mt-3 text-sm text-neutral-500">{{ user?.email }}</p></div>
        <UButton label="Sign out" icon="i-lucide-log-out" color="neutral" variant="outline" class="rounded-none" :loading="loggingOut" @click="signOut" />
      </header>

      <div class="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section class="border border-neutral-200 bg-white p-6 sm:p-8">
          <div class="flex items-start justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Profile</p><h2 class="mt-2 font-display text-3xl">Your details</h2></div><UIcon name="i-lucide-user-round" class="size-6 text-glam-gold" /></div>
          <dl class="mt-8 divide-y divide-neutral-100 text-sm">
            <div class="grid grid-cols-[110px_1fr] gap-4 py-4"><dt class="text-neutral-400">Name</dt><dd>{{ user?.name }}</dd></div>
            <div class="grid grid-cols-[110px_1fr] gap-4 py-4"><dt class="text-neutral-400">Email</dt><dd class="break-all">{{ user?.email }}</dd></div>
            <div class="grid grid-cols-[110px_1fr] gap-4 py-4"><dt class="text-neutral-400">Phone</dt><dd>{{ user?.phone || 'Not provided' }}</dd></div>
          </dl>
        </section>

        <div class="grid gap-3">
          <NuxtLink to="#addresses" class="group flex min-h-28 items-end justify-between border border-neutral-200 bg-white p-5 hover:border-glam-gold"><div><p class="text-[10px] uppercase tracking-[0.18em] text-neutral-400">01</p><h2 class="mt-1 font-display text-2xl">Addresses</h2></div><UIcon name="i-lucide-map-pin" class="size-5 text-glam-gold transition group-hover:-translate-y-1" /></NuxtLink>
          <NuxtLink to="#wishlist" class="group flex min-h-28 items-end justify-between border border-neutral-200 bg-white p-5 hover:border-glam-gold"><div><p class="text-[10px] uppercase tracking-[0.18em] text-neutral-400">02</p><h2 class="mt-1 font-display text-2xl">Wishlist</h2></div><UIcon name="i-lucide-heart" class="size-5 text-glam-gold transition group-hover:-translate-y-1" /></NuxtLink>
          <NuxtLink to="#orders" class="group flex min-h-28 items-end justify-between border border-neutral-200 bg-white p-5 hover:border-glam-gold"><div><p class="text-[10px] uppercase tracking-[0.18em] text-neutral-400">03</p><h2 class="mt-1 font-display text-2xl">Order archive</h2></div><UIcon name="i-lucide-package" class="size-5 text-glam-gold transition group-hover:-translate-y-1" /></NuxtLink>
        </div>
      </div>

      <div class="mt-20 space-y-20">
        <AccountAddressBook />
        <AccountWishlist />
        <AccountOrderHistory />
      </div>
    </main>
    <LayoutAppFooter />
  </div>
</template>
