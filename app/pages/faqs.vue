<script setup lang="ts">
import type { PublicFaqCategory } from '~/types/content'

const route = useRoute()
const router = useRouter()
const { getFaqs } = useContent()
const searchInput = ref(typeof route.query.search === 'string' ? route.query.search : '')
const search = ref(searchInput.value.trim())
const category = ref(typeof route.query.category === 'string' ? route.query.category : '')
const page = ref(Math.max(1, Number(route.query.page) || 1))
const knownCategories = ref<Array<Pick<PublicFaqCategory, 'id' | 'name' | 'slug'>>>([])

const { data: response, status, error, refresh } = await useAsyncData(
  'storefront-faqs',
  () => getFaqs({ category: category.value, search: search.value, page: page.value, perPage: 20 }),
  { watch: [category, search, page] },
)

const groups = computed(() => response.value?.data || [])
const meta = computed(() => response.value?.meta)

watch(groups, (value) => {
  if (!category.value && !search.value && value.length) {
    knownCategories.value = value.map(({ id, name, slug }) => ({ id, name, slug }))
  }
}, { immediate: true })

const syncUrl = () => router.replace({ query: {
  ...(category.value ? { category: category.value } : {}),
  ...(search.value ? { search: search.value } : {}),
  ...(page.value > 1 ? { page: String(page.value) } : {}),
} })

const runSearch = () => {
  search.value = searchInput.value.trim()
  page.value = 1
  void syncUrl()
}

const selectCategory = (slug: string) => {
  category.value = category.value === slug ? '' : slug
  page.value = 1
  void syncUrl()
}

const changePage = (nextPage: number) => {
  page.value = nextPage
  void syncUrl()
  if (import.meta.client) window.scrollTo({ top: 300, behavior: 'smooth' })
}

useSeoMeta({
  title: 'Frequently asked questions — Glamrush',
  description: 'Answers about Glamrush fragrances, orders, delivery, payments and returns.',
})
</script>

<template>
  <div class="min-h-screen bg-[#fbf6ef] text-[#19130f]">
    <a href="#faq-content" class="fixed left-4 top-[-60px] z-[100] bg-neutral-950 px-4 py-3 text-sm text-white focus:top-4">Skip to content</a>
    <LayoutAppHeader />

    <main id="faq-content">
      <section class="border-b border-neutral-300 bg-[#19130f] text-[#fbf6ef]">
        <div class="mx-auto grid min-h-[30rem] max-w-[1280px] items-end gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:px-14 lg:py-24">
          <div><p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e2ca82]">The service journal · 01</p><h1 class="mt-7 max-w-4xl font-display text-[clamp(4.2rem,10vw,9rem)] leading-[0.8] tracking-[-0.055em]">Questions,<br><em class="text-[#e2ca82]">answered.</em></h1></div>
          <div class="border-t border-white/25 pt-7"><p class="text-sm leading-7 text-white/65">Everything worth knowing about ordering, delivery and caring for the fragrances you love.</p><form class="mt-7 flex border-b border-white/55" role="search" @submit.prevent="runSearch"><input v-model="searchInput" type="search" aria-label="Search frequently asked questions" placeholder="Search your question" class="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35"><button type="submit" class="px-2 text-[#e2ca82]" aria-label="Search"><UIcon name="i-lucide-arrow-right" class="size-5" /></button></form></div>
        </div>
      </section>

      <section class="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 sm:py-20">
        <div v-if="knownCategories.length" class="mb-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-neutral-300 pb-5" aria-label="FAQ categories">
          <button type="button" class="border-b py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition" :class="!category ? 'border-[#7c183a] text-[#7c183a]' : 'border-transparent text-neutral-400 hover:text-neutral-950'" @click="selectCategory('')">All questions</button>
          <button v-for="item in knownCategories" :key="item.id" type="button" class="border-b py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition" :class="category === item.slug ? 'border-[#7c183a] text-[#7c183a]' : 'border-transparent text-neutral-400 hover:text-neutral-950'" @click="selectCategory(item.slug)">{{ item.name }}</button>
        </div>

        <div v-if="status === 'pending'" class="space-y-10" aria-label="Loading frequently asked questions"><div v-for="row in 3" :key="row"><USkeleton class="mb-5 h-8 w-52 rounded-none" /><USkeleton v-for="line in 3" :key="line" class="mb-2 h-16 rounded-none" /></div></div>

        <section v-else-if="error" class="py-24 text-center"><UIcon name="i-lucide-cloud-off" class="mx-auto size-9 text-neutral-400" /><h2 class="mt-5 font-display text-4xl">The answer desk is unavailable.</h2><p class="mt-3 text-sm text-neutral-500">Please try again in a moment.</p><UButton label="Try again" icon="i-lucide-refresh-cw" color="neutral" class="mt-6 rounded-none !text-white" @click="() => refresh()" /></section>

        <section v-else-if="!groups.length" class="py-24 text-center"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c183a]">No matching notes</p><h2 class="mt-4 font-display text-4xl sm:text-5xl">Try a different question.</h2><p class="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">You can also send our concierge a message and we’ll help personally.</p><UButton to="/contact" label="Contact Glamrush" trailing-icon="i-lucide-arrow-right" color="neutral" class="mt-7 rounded-none !text-white" /></section>

        <div v-else class="space-y-16">
          <section v-for="(group, groupIndex) in groups" :key="group.id" class="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            <header><p class="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7c183a]">{{ String(groupIndex + 1).padStart(2, '0') }}</p><h2 class="mt-2 font-display text-3xl sm:text-4xl">{{ group.name }}</h2><p v-if="group.description" class="mt-4 text-xs leading-6 text-neutral-500">{{ group.description }}</p></header>
            <div class="border-t border-neutral-400">
              <details v-for="faq in group.faqs" :key="faq.id" class="faq-row group border-b border-neutral-300">
                <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-sm font-semibold sm:text-base"><span>{{ faq.question }}</span><span class="grid size-7 shrink-0 place-items-center rounded-full border border-neutral-400 transition group-open:rotate-45 group-open:border-[#7c183a] group-open:text-[#7c183a]">+</span></summary>
                <div class="faq-answer max-w-2xl pb-7 pr-10 text-sm leading-7 text-neutral-600" v-html="faq.answer" />
              </details>
            </div>
          </section>
        </div>

        <nav v-if="meta && meta.last_page > 1" class="mt-20 flex items-center justify-between border-t border-neutral-400 pt-6" aria-label="FAQ pagination"><UButton label="Previous" icon="i-lucide-arrow-left" color="neutral" variant="link" class="p-0" :disabled="page <= 1" @click="changePage(page - 1)" /><span class="text-[10px] uppercase tracking-[0.14em] text-neutral-500">Page {{ meta.current_page }} of {{ meta.last_page }}</span><UButton label="Next" trailing-icon="i-lucide-arrow-right" color="neutral" variant="link" class="p-0" :disabled="page >= meta.last_page" @click="changePage(page + 1)" /></nav>
      </section>
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.faq-row summary::-webkit-details-marker { display: none; }
.faq-answer :deep(p) { margin: 0 0 .8rem; }
.faq-answer :deep(a) { color: #7c183a; text-decoration: underline; text-underline-offset: 3px; }
.faq-answer :deep(ul), .faq-answer :deep(ol) { margin: .75rem 0; padding-left: 1.2rem; }
</style>
