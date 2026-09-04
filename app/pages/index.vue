<script setup lang="ts">
import type { Product } from '~/types/catalog'

const { getHomepage } = useStorefront()
const config = useRuntimeConfig()
const { data: homepageResponse, status, error, refresh } = await useAsyncData('storefront-homepage', async () => {
  try {
    return await getHomepage()
  }
  catch (requestError) {
    console.error('Unable to load the storefront homepage', requestError)
    throw requestError
  }
})

const homepage = computed(() => homepageResponse.value?.data)
const campaign = computed(() => homepage.value?.campaign ?? null)
const sections = computed(() => [...(homepage.value?.sections ?? [])].sort((a, b) => a.display_order - b.display_order))
const categorySections = computed(() => sections.value.filter(section => section.type === 'random_categories'))
const merchandisingSections = computed(() => sections.value.filter(section => section.type !== 'random_categories'))
const storefrontSlug = computed(() => homepage.value?.storefront.slug || String(config.public.storefrontSlug))
const headerHeight = ref(65)

const { addItem } = useCart()
const notice = shallowRef('')
let noticeTimer: ReturnType<typeof setTimeout> | undefined

const showNotice = (message: string) => {
  notice.value = message
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { notice.value = '' }, 2600)
}
const addToBag = async (product: Product, productVariantId?: string | number) => {
  try {
    await addItem(product.id, 1, productVariantId)
    showNotice(`${product.name} added to your bag`)
  }
  catch (error) { showNotice(authErrorDetails(error, 'We could not add this item to your bag.').message) }
}

useSeoMeta({
  title: () => campaign.value?.title ? `${campaign.value.title} — Glamrush` : 'Glamrush — Fragrance that stays with you',
  description: () => campaign.value?.description || 'Discover perfumes, fragrance oils, body sprays and home scents curated for every mood and memory.',
  ogTitle: () => campaign.value?.title || 'Glamrush — Fragrance that stays with you',
  ogDescription: () => campaign.value?.description || 'A considered edit of unforgettable scents, from skin-close oils to room-filling perfume.',
  ogImage: () => campaign.value?.desktop_image || undefined,
})
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-glam-ink" :style="{ '--storefront-header-height': `${headerHeight}px` }">
    <a href="#main" class="fixed left-4 top-[-60px] z-[100] bg-neutral-950 px-4 py-3 text-sm text-white focus:top-4">Skip to content</a>
    <LayoutAppHeader @height-change="headerHeight = $event" />

    <main id="main">
      <template v-if="status === 'pending'">
        <section class="homepage-hero-height grid w-full lg:grid-cols-[44%_56%]" aria-label="Loading homepage">
          <div class="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24"><div class="w-full max-w-lg space-y-6"><USkeleton class="h-3 w-40" /><USkeleton class="h-20 w-full sm:h-32" /><USkeleton class="h-5 w-4/5" /><USkeleton class="h-12 w-44" /></div></div>
          <USkeleton class="min-h-[58svh] w-full rounded-none lg:min-h-0" />
        </section>
        <section v-for="row in 2" :key="row" class="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8"><USkeleton class="mb-10 h-14 w-72" /><div class="grid grid-cols-2 gap-4 md:grid-cols-4"><USkeleton v-for="card in 4" :key="card" class="aspect-[4/5] rounded-none" /></div></section>
      </template>

      <section v-else-if="error" class="mx-auto flex min-h-[65svh] max-w-[1280px] flex-col items-center justify-center px-6 text-center">
        <UIcon name="i-lucide-cloud-off" class="mb-5 size-10 text-neutral-400" />
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-glam-gold">Connection interrupted</p>
        <h1 class="mt-3 font-display text-4xl sm:text-5xl">The scent cabinet is momentarily closed.</h1>
        <p class="mt-4 max-w-md text-sm leading-6 text-neutral-600">We couldn’t load today’s homepage edit. Please try again in a moment.</p>
        <UButton label="Try again" icon="i-lucide-refresh-cw" color="neutral" class="mt-7 rounded-none !text-white" @click="() => refresh()" />
      </section>

      <template v-else>
        <HomeCampaignHero v-if="campaign" :campaign="campaign" />

        <div id="merchandising">
          <HomeMerchandisingSection v-for="section in categorySections" :key="section.id" :section="section" :storefront-slug="storefrontSlug" :position="0" @add-to-bag="addToBag" />
        </div>

        <div class="overflow-hidden border-y border-neutral-200 bg-glam-ivory py-4" aria-label="Brand values">
          <div class="home-marquee flex w-max items-center gap-8 text-xs font-semibold uppercase tracking-[0.22em]">
            <template v-for="repeat in 2" :key="repeat"><span>Made to linger</span><i class="text-glam-gold">✦</i><span>Skin-close oils</span><i class="text-glam-gold">✦</i><span>Scents with a story</span><i class="text-glam-gold">✦</i></template>
          </div>
        </div>

        <div>
          <HomeMerchandisingSection v-for="(section, index) in merchandisingSections" :key="section.id" :section="section" :storefront-slug="storefrontSlug" :position="index + categorySections.length" @add-to-bag="addToBag" />
        </div>

        <section v-if="!sections.length" class="mx-auto max-w-[1280px] px-4 py-24 text-center sm:px-6 lg:px-8">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-glam-gold">The fragrance edit</p>
          <h2 class="mt-4 font-display text-4xl">A new selection is on its way.</h2>
        </section>

        <section id="story" class="mx-auto max-w-[1280px] px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-glam-gold">Our promise</p>
          <blockquote class="mx-auto mt-6 max-w-4xl font-display text-4xl leading-tight sm:text-6xl">“Fragrance is the memory that arrives before you do.”</blockquote>
          <div class="mx-auto mt-12 grid max-w-4xl gap-8 border-t border-neutral-200 pt-8 text-left md:grid-cols-2">
            <p class="text-sm leading-7 text-neutral-600">Every Glamrush fragrance is selected for character, quality and the way it unfolds on real skin—from the first note to the final trace.</p>
            <div class="grid gap-3 text-sm"><span><b class="mr-4 text-glam-gold">01</b>Mood-led curation</span><span><b class="mr-4 text-glam-gold">02</b>Authenticity guaranteed</span><span><b class="mr-4 text-glam-gold">03</b>Personal scent guidance</span></div>
          </div>
        </section>
      </template>
    </main>

    <LayoutAppFooter />

    <Transition name="toast"><div v-if="notice" class="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 bg-neutral-950 px-5 py-3 text-sm text-white shadow-xl" role="status">{{ notice }}<UButton icon="i-lucide-x" aria-label="Dismiss" color="neutral" variant="ghost" size="xs" square @click="notice = ''" /></div></Transition>
  </div>
</template>

<style scoped>
.homepage-hero-height { min-height: max(36rem, calc(100dvh - var(--storefront-header-height, 65px))); }
.home-marquee { animation: home-marquee 22s linear infinite; }
@keyframes home-marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .home-marquee { animation: none; } }
</style>
