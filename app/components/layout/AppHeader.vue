<script setup lang="ts">
withDefaults(defineProps<{ bagCount?: number }>(), { bagCount: 0 })

const config = useRuntimeConfig()
const router = useRouter()
const menuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const { user, ensureSession, logout } = useAuth()
const { ensureCart } = useCart()
const { getConfiguration } = useStorefront()
const loggingOut = ref(false)

const { data: configurationResponse } = await useAsyncData(
  'storefront-configuration',
  () => getConfiguration(),
  { dedupe: 'defer' },
)
const announcementPrimaryText = computed(() => configurationResponse.value?.data.announcement.primary_text?.trim() || '')
const announcementSecondaryText = computed(() => configurationResponse.value?.data.announcement.secondary_text?.trim() || '')
const hasAnnouncement = computed(() => Boolean(announcementPrimaryText.value || announcementSecondaryText.value))

const navigation = [
  { label: 'New in', to: '/#new' },
  { label: 'Shop fragrance', to: '/#shop' },
  { label: 'Our story', to: '/about-us' },
  { label: 'Help & FAQs', to: '/faqs' },
]

const submitSearch = () => {
  const value = searchQuery.value.trim()
  if (!value) return
  searchOpen.value = false
  router.push({ path: `/category/${config.public.storefrontSlug}`, query: { search: value } })
}

const signOut = async () => {
  loggingOut.value = true
  try {
    await logout()
    menuOpen.value = false
    await router.push('/')
  }
  finally {
    loggingOut.value = false
  }
}

onMounted(async () => {
  await ensureSession()
  await ensureCart().catch(() => undefined)
})
</script>

<template>
  <div v-if="hasAnnouncement" class="bg-neutral-950 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-white sm:text-xs">
    <span v-if="announcementPrimaryText">{{ announcementPrimaryText }}</span><span v-if="announcementPrimaryText && announcementSecondaryText" class="mx-4 hidden text-glam-gold sm:inline">✦</span><span v-if="announcementSecondaryText" class="hidden sm:inline">{{ announcementSecondaryText }}</span>
  </div>

    <header class="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <UButton icon="i-lucide-menu" aria-label="Open menu" color="neutral" variant="ghost" square class="md:hidden" @click="menuOpen = true" />
        <NuxtLink to="/" class="font-display text-xl tracking-[0.12em]">GLAMRUSH</NuxtLink>
        <nav class="hidden items-center gap-8 text-sm text-neutral-600 md:flex" aria-label="Main navigation">
          <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to" class="transition hover:text-neutral-950">{{ item.label }}</NuxtLink>
        </nav>
        <div class="flex items-center gap-1">
          <UButton icon="i-lucide-search" aria-label="Search" color="neutral" variant="ghost" square @click="searchOpen = true" />
          <UButton v-if="user" :label="user.name.split(' ')[0] || 'Account'" to="/account" icon="i-lucide-user-round" color="neutral" variant="ghost" class="hidden sm:inline-flex" />
          <UButton v-else label="Sign in" to="/auth/sign-in" color="neutral" variant="ghost" class="hidden sm:inline-flex" />
          <CartPreview />
        </div>
      </div>
    </header>

    <UDrawer v-model:open="menuOpen" title="Menu" direction="left">
      <template #body>
        <nav class="flex flex-col gap-1">
          <UButton v-for="item in navigation" :key="item.to" :to="item.to" :label="item.label" color="neutral" variant="ghost" block class="justify-start" @click="menuOpen = false" />
          <UButton v-if="user" label="My account" to="/account" icon="i-lucide-user-round" color="neutral" variant="ghost" block class="mt-4 justify-start border-t border-neutral-200 pt-5" @click="menuOpen = false" />
          <UButton v-if="user" label="Sign out" icon="i-lucide-log-out" color="neutral" variant="ghost" block class="justify-start" :loading="loggingOut" @click="signOut" />
          <UButton v-else label="Sign in" to="/auth/sign-in" color="neutral" variant="ghost" block class="mt-4 justify-start border-t border-neutral-200 pt-5" @click="menuOpen = false" />
        </nav>
      </template>
    </UDrawer>

    <UModal v-model:open="searchOpen" title="Search Glamrush" description="Find a fragrance by name, note or mood.">
      <template #body>
        <form class="flex gap-2" @submit.prevent="submitSearch">
          <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Try “vanilla perfume”" size="xl" autofocus class="flex-1" />
          <UButton type="submit" label="Search" color="neutral" />
        </form>
      </template>
    </UModal>
</template>
