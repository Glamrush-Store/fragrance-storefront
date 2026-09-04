<script setup lang="ts">
import type { StorefrontCampaign } from '~/types/catalog'

const props = defineProps<{ campaign: StorefrontCampaign }>()

const desktopImage = computed(() => props.campaign.desktop_image || props.campaign.mobile_image || null)
const mobileImage = computed(() => props.campaign.mobile_image || desktopImage.value)
const headingId = computed(() => `campaign-${props.campaign.id}`)
const imageFailed = ref(false)
const showImage = computed(() => Boolean(desktopImage.value) && !imageFailed.value)

watch(desktopImage, () => { imageFailed.value = false })
</script>

<template>
  <section id="new" :aria-labelledby="headingId" class="campaign-hero group relative isolate flex w-full overflow-hidden bg-[#391722] text-white">
    <picture v-if="showImage" class="absolute inset-0 z-0 block h-full w-full overflow-hidden">
      <source media="(max-width: 767px)" :srcset="mobileImage || undefined">
      <img :src="desktopImage || undefined" :alt="campaign.title" class="h-full w-full object-cover transition duration-[1.4s] ease-out motion-safe:group-hover:scale-[1.025]" width="1920" height="1200" fetchpriority="high" @error="imageFailed = true">
    </picture>

    <div v-else class="campaign-art absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="campaign-orbit campaign-orbit--large" />
        <span class="campaign-orbit campaign-orbit--small" />
      </div>
    </div>

    <div class="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(9,7,5,0.82)_0%,rgba(9,7,5,0.56)_38%,rgba(9,7,5,0.12)_68%,rgba(9,7,5,0.18)_100%)] max-md:bg-[linear-gradient(0deg,rgba(9,7,5,0.88)_0%,rgba(9,7,5,0.2)_68%,rgba(9,7,5,0.18)_100%)]" />

    <div class="relative z-20 flex w-full items-end px-6 py-14 sm:px-10 sm:py-20 md:items-center lg:px-[7vw]">
      <div class="campaign-copy max-w-2xl">
        <p v-if="campaign.eyebrow" class="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#e1ba82]">{{ campaign.eyebrow }}</p>
        <h1 :id="headingId" class="font-display max-w-[11ch] text-[clamp(3.6rem,8vw,8.5rem)] leading-[0.84] tracking-[-0.05em] text-balance">{{ campaign.title }}</h1>
        <p v-if="campaign.description" class="mt-7 max-w-md text-sm leading-7 text-white/80 sm:text-base">{{ campaign.description }}</p>
        <UButton v-if="campaign.cta_label && campaign.cta_url" :to="campaign.cta_url" :label="campaign.cta_label" trailing-icon="i-lucide-arrow-up-right" color="neutral" size="lg" class="mt-8 rounded-none px-6 !bg-white !text-neutral-950 hover:!bg-[#e1ba82]" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.campaign-hero { min-height: max(36rem, calc(100dvh - var(--storefront-header-height, 65px))); }
.campaign-copy { animation: campaign-reveal .8s cubic-bezier(.22, 1, .36, 1) both; }
.campaign-art { background-image: radial-gradient(circle at 50% 42%, #753a4c 0, #391722 58%, #240c14 100%); }
.campaign-orbit { position: absolute; border: 1px solid rgb(217 180 129 / 35%); border-radius: 9999px; }
.campaign-orbit--large { width: min(72vw, 42rem); aspect-ratio: 1; }
.campaign-orbit--small { width: min(42vw, 22rem); aspect-ratio: 1; box-shadow: 0 0 80px rgb(217 180 129 / 12%); }
@keyframes campaign-reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .campaign-copy { animation: none; } }
</style>
