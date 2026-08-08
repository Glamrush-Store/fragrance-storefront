<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="min-h-screen bg-glam-ivory text-glam-ink">
    <LayoutAppHeader />
    <main class="relative isolate overflow-hidden">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -right-24 top-12 size-[34rem] rounded-full bg-[#e7d7bd]/45 blur-3xl" />
        <div class="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-[#7c183a]/10 blur-3xl" />
        <div class="absolute inset-y-0 left-[54%] hidden w-px bg-neutral-900/10 lg:block" />
      </div>

      <div class="mx-auto grid min-h-[calc(100svh-97px)] max-w-[1280px] lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)]">
        <section class="flex flex-col justify-between px-6 pb-10 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:py-20">
          <div class="max-w-2xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-glam-gold">{{ eyebrow }}</p>
            <h1 class="mt-5 max-w-xl font-display text-[clamp(3.5rem,7vw,7rem)] leading-[.88] tracking-[-0.045em]">{{ title }}</h1>
            <p class="mt-8 max-w-md text-sm leading-7 text-neutral-600 sm:text-base">{{ description }}</p>
          </div>
          <p class="mt-14 hidden max-w-sm border-l border-glam-gold pl-5 font-display text-2xl leading-tight text-neutral-700 lg:block">Your fragrance wardrobe, remembered and ready whenever you return.</p>
        </section>

        <section class="flex items-start justify-center px-4 pb-16 sm:px-8 lg:items-center lg:px-8 lg:py-20">
          <div class="w-full max-w-md border border-neutral-900/10 bg-white/90 p-6 shadow-[0_30px_90px_rgba(44,31,20,.1)] backdrop-blur sm:p-9">
            <slot />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
