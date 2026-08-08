<script setup lang="ts">
import type { StorefrontCampaign } from '~/types/catalog'

const props = defineProps<{ campaign: StorefrontCampaign }>()

const desktopImage = computed(() => props.campaign.desktop_image || props.campaign.mobile_image || null)
const mobileImage = computed(() => props.campaign.mobile_image || desktopImage.value)
const headingId = computed(() => `campaign-${props.campaign.id}`)
</script>

<template>
  <section id="new" :aria-labelledby="headingId" class="mx-auto grid min-h-[calc(100svh-97px)] max-w-[1440px] lg:grid-cols-[44%_56%]">
    <div class="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
      <div class="campaign-copy max-w-xl">
        <p v-if="campaign.eyebrow" class="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-glam-gold">{{ campaign.eyebrow }}</p>
        <h1 :id="headingId" class="font-display text-[clamp(3.4rem,7vw,7.4rem)] leading-[0.88] tracking-[-0.045em]">{{ campaign.title }}</h1>
        <p v-if="campaign.description" class="mt-8 max-w-md text-base leading-7 text-neutral-600">{{ campaign.description }}</p>
        <UButton v-if="campaign.cta_label && campaign.cta_url" :to="campaign.cta_url" :label="campaign.cta_label" trailing-icon="i-lucide-arrow-up-right" color="neutral" size="lg" class="mt-8 rounded-none px-6 !text-white" />
      </div>
    </div>

    <div class="campaign-art relative min-h-[58svh] overflow-hidden bg-[#391722] lg:min-h-0">
      <picture v-if="desktopImage">
        <source media="(max-width: 767px)" :srcset="mobileImage">
        <img :src="desktopImage" :alt="campaign.title" class="h-full w-full object-cover transition duration-[1.4s] hover:scale-[1.025]" width="1100" height="1350" fetchpriority="high">
      </picture>

      <div v-else class="absolute inset-0 isolate flex items-center justify-center overflow-hidden px-8 py-16 text-center text-white">
        <span aria-hidden="true" class="campaign-orbit campaign-orbit--large" />
        <span aria-hidden="true" class="campaign-orbit campaign-orbit--small" />
        <div class="relative max-w-xl">
          <p v-if="campaign.eyebrow" class="text-xs font-semibold uppercase tracking-[0.28em] text-[#d9b481]">{{ campaign.eyebrow }}</p>
          <p class="mt-6 font-display text-[clamp(4rem,9vw,8rem)] leading-[0.84] tracking-[-0.05em]">{{ campaign.title }}</p>
        </div>
      </div>

      <div v-if="desktopImage" class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-6 text-white sm:p-8">
        <p v-if="campaign.eyebrow" class="max-w-[15rem] text-xs uppercase leading-5 tracking-[0.18em]">{{ campaign.eyebrow }}</p>
        <span class="font-display text-6xl" aria-hidden="true">G</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.campaign-copy { animation: campaign-reveal .8s cubic-bezier(.22, 1, .36, 1) both; }
.campaign-art { background-image: radial-gradient(circle at 50% 42%, #753a4c 0, #391722 58%, #240c14 100%); }
.campaign-orbit { position: absolute; border: 1px solid rgb(217 180 129 / 35%); border-radius: 9999px; }
.campaign-orbit--large { width: min(72vw, 42rem); aspect-ratio: 1; }
.campaign-orbit--small { width: min(42vw, 22rem); aspect-ratio: 1; box-shadow: 0 0 80px rgb(217 180 129 / 12%); }
@keyframes campaign-reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .campaign-copy { animation: none; } }
</style>
