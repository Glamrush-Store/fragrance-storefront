<script setup lang="ts">
import type { PublicContentPage } from '~/types/content'

const props = defineProps<{ page: PublicContentPage }>()

const typeLabel = computed(() => ({
  about: 'Our story',
  contact: 'Concierge',
  privacy_policy: 'Your privacy',
  terms: 'Terms of service',
  shipping_policy: 'Delivery notes',
  returns_policy: 'Returns & exchanges',
  custom: 'Glamrush journal',
}[props.page.page_type] || 'Glamrush journal'))

const image = computed(() => {
  const media = Array.isArray(props.page.media) ? props.page.media[0] : props.page.media
  if (typeof media === 'string') return media
  return media?.medium || media?.url || null
})
</script>

<template>
  <section class="relative overflow-hidden border-b border-neutral-300 bg-[#efe6da]">
    <div class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-[#7c183a]/15" />
    <div class="pointer-events-none absolute right-10 top-10 size-36 rounded-full border border-[#7c183a]/10" />
    <div class="mx-auto grid min-h-[34rem] max-w-[1280px] lg:grid-cols-[minmax(0,1fr)_40%]">
      <div class="relative z-10 flex flex-col justify-between px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div class="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7c183a]"><span class="h-px w-10 bg-current" />{{ typeLabel }}</div>
        <div class="mt-20 max-w-3xl">
          <h1 class="font-display text-[clamp(4rem,10vw,8.8rem)] font-normal leading-[0.82] tracking-[-0.055em]">{{ page.title }}</h1>
          <p v-if="page.excerpt" class="mt-8 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">{{ page.excerpt }}</p>
        </div>
      </div>
      <div v-if="image" class="relative min-h-80 overflow-hidden bg-neutral-200 lg:min-h-full">
        <img :src="image" :alt="page.title" class="absolute inset-0 h-full w-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div v-else class="relative hidden overflow-hidden border-l border-neutral-300 bg-[#19130f] lg:block" aria-hidden="true">
        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[13rem] text-[#e2ca82]/15">G</span>
        <span class="absolute bottom-12 left-12 text-[9px] uppercase tracking-[0.32em] text-[#fbf6ef]/45">Notes from Glamrush</span>
      </div>
    </div>
  </section>
</template>
