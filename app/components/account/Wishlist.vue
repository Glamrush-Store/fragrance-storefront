<script setup lang="ts">
import type { SavedItem } from '~/types/account'

const { listSavedItems, removeSavedItem } = useCustomerAccount()
const items = ref<SavedItem[]>([])
const loading = ref(true)
const removingId = ref<string | null>(null)
const errorMessage = ref('')

const load = async () => {
  loading.value = true
  errorMessage.value = ''
  try { items.value = (await listSavedItems()).data }
  catch (error) { errorMessage.value = authErrorDetails(error, 'We could not load your wishlist.').message }
  finally { loading.value = false }
}

const remove = async (item: SavedItem) => {
  removingId.value = item.product_id
  try {
    await removeSavedItem(item.product_id)
    items.value = items.value.filter(saved => saved.product_id !== item.product_id)
  }
  catch (error) { errorMessage.value = authErrorDetails(error, 'We could not remove this item.').message }
  finally { removingId.value = null }
}

onMounted(load)
</script>

<template>
  <section id="wishlist" class="scroll-mt-28 border-t border-neutral-300 pt-10">
    <div>
      <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-glam-gold">02 / The edit</p>
      <h2 class="mt-2 font-display text-4xl sm:text-5xl">Wishlist management</h2>
      <p class="mt-3 max-w-xl text-sm leading-6 text-neutral-500">A private shelf for fragrances worth returning to.</p>
    </div>
    <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" class="mt-6" />
    <div v-if="loading" class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"><USkeleton v-for="index in 4" :key="index" class="aspect-[4/5] rounded-none" /></div>
    <div v-else-if="items.length" class="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      <article v-for="item in items" :key="item.id" class="group min-w-0">
        <div class="relative aspect-[4/5] overflow-hidden bg-[#eee9e1]">
          <NuxtLink :to="`/product/${item.slug}`" class="block h-full"><img v-if="item.thumb" :src="item.thumb" :alt="item.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"><div v-else class="flex h-full items-center justify-center"><span class="font-display text-5xl text-neutral-300">G</span></div></NuxtLink>
          <UButton icon="i-lucide-x" :aria-label="`Remove ${item.name} from wishlist`" color="neutral" variant="soft" square class="absolute right-3 top-3 rounded-full bg-white/90" :loading="removingId === item.product_id" @click="remove(item)" />
        </div>
        <p class="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-glam-gold">Saved fragrance</p>
        <h3 class="mt-1 truncate text-sm font-medium"><NuxtLink :to="`/product/${item.slug}`" class="hover:underline">{{ item.name }}</NuxtLink></h3>
      </article>
    </div>
    <div v-else class="mt-8 border border-dashed border-neutral-300 bg-white/50 px-6 py-14 text-center"><UIcon name="i-lucide-heart" class="mx-auto size-8 text-glam-gold" /><h3 class="mt-4 font-display text-2xl">Your wishlist is quiet</h3><p class="mt-2 text-sm text-neutral-500">Save a fragrance and it will appear here.</p><UButton to="/" label="Explore fragrances" color="neutral" variant="outline" class="mt-6 rounded-none" /></div>
  </section>
</template>
