<script setup lang="ts">
import { applyCatalogImageFallback, PRODUCT_IMAGE_FALLBACK } from '~/utils/catalog'

const props = defineProps<{ images: string[]; productName: string }>()

const activeIndex = shallowRef(0)
const zoomOpen = shallowRef(false)
const usingFallback = computed(() => props.images.length === 0)
const displayImages = computed(() => props.images.length ? props.images : [PRODUCT_IMAGE_FALLBACK])
const activeImage = computed(() => displayImages.value[activeIndex.value] || displayImages.value[0])
const hasMultipleImages = computed(() => displayImages.value.length > 1)

const previousImage = () => {
  activeIndex.value = (activeIndex.value - 1 + displayImages.value.length) % displayImages.value.length
}

const nextImage = () => {
  activeIndex.value = (activeIndex.value + 1) % displayImages.value.length
}

const handleKeyboard = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') previousImage()
  if (event.key === 'ArrowRight') nextImage()
}

watch(() => props.images, () => { activeIndex.value = 0 }, { deep: true })
</script>

<template>
  <div
    class="grid gap-3"
    :class="hasMultipleImages ? 'sm:grid-cols-[68px_minmax(0,1fr)]' : 'grid-cols-1'"
    @keydown="handleKeyboard"
  >
    <div v-if="hasMultipleImages" class="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:max-h-[640px] sm:flex-col sm:overflow-y-auto sm:pb-0" aria-label="Choose product image">
      <button v-for="(image, index) in displayImages" :key="`${image}-${index}`" type="button" class="size-16 shrink-0 overflow-hidden border bg-neutral-100 transition sm:size-[68px]" :class="index === activeIndex ? 'border-neutral-950' : 'border-transparent opacity-70 hover:border-neutral-400 hover:opacity-100'" :aria-label="`View image ${index + 1} of ${displayImages.length}`" :aria-current="index === activeIndex ? 'true' : undefined" @click="activeIndex = index">
        <img :src="image" :alt="`${productName}, view ${index + 1}`" class="h-full w-full object-cover" width="152" height="152" @error="applyCatalogImageFallback">
      </button>
    </div>

    <div class="group relative order-1 aspect-[4/5] min-h-0 overflow-hidden bg-neutral-100 sm:order-2">
      <button type="button" class="h-full w-full cursor-zoom-in" :aria-label="`Zoom ${productName}, image ${activeIndex + 1}`" @click="zoomOpen = true">
        <Transition name="gallery-image" mode="out-in">
          <img :key="activeImage" :src="activeImage" :alt="`${productName}, image ${activeIndex + 1} of ${displayImages.length}`" class="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]" :class="usingFallback ? 'object-contain' : 'object-cover'" width="1000" height="1250" @error="applyCatalogImageFallback">
        </Transition>
      </button>

      <template v-if="hasMultipleImages">
        <button type="button" class="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-950 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Previous product image" @click="previousImage">
          <UIcon name="i-lucide-chevron-left" class="size-5" />
        </button>
        <button type="button" class="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-950 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Next product image" @click="nextImage">
          <UIcon name="i-lucide-chevron-right" class="size-5" />
        </button>
        <span class="absolute bottom-3 left-3 bg-neutral-950/75 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white" aria-live="polite">{{ activeIndex + 1 }} / {{ displayImages.length }}</span>
      </template>

      <span class="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-neutral-950 shadow-sm"><UIcon name="i-lucide-scan" class="size-5" /></span>
    </div>

    <UModal v-model:open="zoomOpen" :title="productName" fullscreen>
      <template #body>
        <div class="flex h-full min-h-[70vh] items-center justify-center bg-neutral-100 p-4 sm:p-8">
          <img :src="activeImage" :alt="productName" class="max-h-[85vh] max-w-full object-contain" width="1800" height="2200" @error="applyCatalogImageFallback">
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.gallery-image-enter-active,
.gallery-image-leave-active {
  transition: opacity 180ms ease;
}

.gallery-image-enter-from,
.gallery-image-leave-to {
  opacity: 0;
}
</style>
