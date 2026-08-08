<script setup lang="ts">
const props = defineProps<{ images: string[]; productName: string }>()

const activeIndex = shallowRef(0)
const zoomOpen = shallowRef(false)
const fallback = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=90'
const displayImages = computed(() => props.images.length ? props.images : [fallback])
const activeImage = computed(() => displayImages.value[activeIndex.value] || displayImages.value[0])

watch(() => props.images, () => { activeIndex.value = 0 })
</script>

<template>
  <div
    class="grid gap-3"
    :class="displayImages.length > 1 ? 'sm:grid-cols-[76px_minmax(0,1fr)]' : 'grid-cols-1'"
  >
    <div v-if="displayImages.length > 1" class="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col" aria-label="Product images">
      <button v-for="(image, index) in displayImages" :key="`${image}-${index}`" type="button" class="size-16 shrink-0 overflow-hidden border bg-neutral-100 transition sm:size-[76px]" :class="index === activeIndex ? 'border-neutral-950' : 'border-transparent hover:border-neutral-400'" :aria-label="`View image ${index + 1}`" @click="activeIndex = index">
        <img :src="image" :alt="`${productName}, view ${index + 1}`" class="h-full w-full object-cover" width="152" height="152">
      </button>
    </div>

    <button type="button" class="group relative order-1 aspect-[4/5] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100 sm:order-2" aria-label="Zoom product image" @click="zoomOpen = true">
      <img :src="activeImage" :alt="productName" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]" width="1200" height="1500">
      <span class="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-neutral-950 shadow-sm"><UIcon name="i-lucide-scan" class="size-5" /></span>
    </button>

    <UModal v-model:open="zoomOpen" :title="productName" fullscreen>
      <template #body>
        <div class="flex h-full min-h-[70vh] items-center justify-center bg-neutral-100 p-4 sm:p-8">
          <img :src="activeImage" :alt="productName" class="max-h-[85vh] max-w-full object-contain" width="1800" height="2200">
        </div>
      </template>
    </UModal>
  </div>
</template>
