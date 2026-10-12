<script setup lang="ts">
import type { HomepageSection, SplitImageBannerItem } from '~/types/catalog'

const props = defineProps<{ section: HomepageSection }>()

const isSplitImageItem = (item: unknown): item is SplitImageBannerItem => {
  if (!item || typeof item !== 'object') return false

  const candidate = item as Partial<SplitImageBannerItem>

  return (
    (candidate.slot === 'left' || candidate.slot === 'right')
    && typeof candidate.sort_order === 'number'
    && typeof candidate.image === 'string'
    && typeof candidate.description === 'string'
  )
}

const items = computed(() => props.section.items
  .filter(isSplitImageItem)
  .sort((first, second) => first.sort_order - second.sort_order || first.slot.localeCompare(second.slot)))

const mobileItem = computed(() => items.value[0] ?? null)
</script>

<template>
  <section class="bg-[#11100f] text-white" :aria-labelledby="`split-banner-${section.id}`">
    <h2 :id="`split-banner-${section.id}`" class="sr-only">{{ section.title }}</h2>

    <div class="relative hidden min-h-[14.4rem] overflow-hidden border-t border-black md:block lg:min-h-[17.6rem]">
      <article
        v-for="item in items"
        :key="item.slot"
        class="split-panel absolute inset-y-0 overflow-hidden bg-neutral-900"
        :class="`split-panel--${item.slot}`"
      >
        <img v-if="item.image" :src="item.image" :alt="item.description" class="split-panel__image absolute inset-0 size-full object-cover" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
        <div class="split-panel__content absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8">
          <p class="max-w-md font-display text-2xl leading-tight text-balance lg:text-3xl">{{ item.description }}</p>
          <NuxtLink
            v-if="item.cta"
            :to="item.cta.url"
            class="mt-4 inline-flex items-center gap-3 border-b border-white/70 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:border-[#e1ba82] hover:text-[#e1ba82]"
          >
            {{ item.cta.label }}
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </NuxtLink>
        </div>
      </article>
    </div>

    <div class="split-banner-mobile relative min-h-[15.2rem] overflow-hidden border-t border-black md:hidden">
      <img v-if="section.mobile_image" :src="section.mobile_image" :alt="section.title" class="split-banner-mobile__image absolute inset-0 size-full object-cover" loading="lazy">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5" />
      <div v-if="mobileItem" class="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <article class="max-w-sm border-t border-white/40 pt-4">
          <p class="font-display text-2xl leading-tight text-balance">{{ mobileItem.description }}</p>
          <NuxtLink
            v-if="mobileItem.cta"
            :to="mobileItem.cta.url"
            class="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
          >
            {{ mobileItem.cta.label }}
            <UIcon name="i-lucide-arrow-right" class="size-3.5" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.split-panel--left {
  left: 0;
  width: 53%;
  clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
}

.split-panel--right {
  right: 0;
  width: 53%;
  clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
}

.split-panel--left .split-panel__content {
  padding-right: 15%;
}

.split-panel--right .split-panel__content {
  padding-left: 15%;
}

.split-panel__image,
.split-banner-mobile__image {
  transition: transform 1.4s ease-out;
}

.split-panel:hover .split-panel__image,
.split-panel:focus-within .split-panel__image,
.split-banner-mobile:hover .split-banner-mobile__image,
.split-banner-mobile:focus-within .split-banner-mobile__image {
  transform: scale(1.04);
}

@media (prefers-reduced-motion: reduce) {
  .split-panel__image,
  .split-banner-mobile__image {
    transition: none;
  }

  .split-panel:hover .split-panel__image,
  .split-panel:focus-within .split-panel__image,
  .split-banner-mobile:hover .split-banner-mobile__image,
  .split-banner-mobile:focus-within .split-banner-mobile__image {
    transform: none;
  }
}
</style>
