<script setup lang="ts">
const route = useRoute()
const { getPage } = useContent()
const slug = computed(() => String(route.params.slug || '').trim().toLowerCase())

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: response, error } = await useAsyncData(
  () => `content-page:${slug.value}`,
  () => getPage(slug.value),
  { watch: [slug] },
)

if (error.value) {
  const statusCode = (error.value as { statusCode?: number; status?: number }).statusCode
    || (error.value as { statusCode?: number; status?: number }).status
    || 500
  throw createError({
    statusCode: statusCode === 404 ? 404 : 503,
    statusMessage: statusCode === 404 ? 'Page not found' : 'Content temporarily unavailable',
  })
}

const page = computed(() => response.value?.data)
const updatedLabel = computed(() => page.value?.updated_at
  ? new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(page.value.updated_at))
  : null)

useSeoMeta({
  title: () => `${page.value?.meta_title || page.value?.title || 'Glamrush'} — Glamrush`,
  description: () => page.value?.meta_description || page.value?.excerpt || 'Information from Glamrush.',
  ogTitle: () => page.value?.meta_title || page.value?.title,
  ogDescription: () => page.value?.meta_description || page.value?.excerpt || undefined,
})
</script>

<template>
  <div v-if="page" class="min-h-screen bg-[#fbf6ef] text-[#19130f]">
    <a href="#main-content" class="fixed left-4 top-[-60px] z-[100] bg-neutral-950 px-4 py-3 text-sm text-white focus:top-4">Skip to content</a>
    <LayoutAppHeader />
    <main id="main-content">
      <ContentPageHero :page="page" />
      <section class="mx-auto grid max-w-[1120px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[180px_minmax(0,720px)] lg:gap-20 lg:py-32">
        <aside class="border-b border-neutral-300 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p class="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Document</p>
          <p class="mt-2 text-xs leading-5">{{ page.navigation_title || page.title }}</p>
          <p v-if="updatedLabel" class="mt-6 text-[10px] leading-5 text-neutral-400">Last updated<br>{{ updatedLabel }}</p>
        </aside>
        <article class="content-prose min-w-0" v-html="page.content" />
      </section>
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.content-prose { font-size: 0.95rem; line-height: 1.9; color: #49433e; }
.content-prose :deep(h2) { margin: 3.5rem 0 1.1rem; color: #19130f; font-family: var(--display); font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 400; line-height: 1.05; letter-spacing: -.03em; }
.content-prose :deep(h2:first-child) { margin-top: 0; }
.content-prose :deep(h3) { margin: 2.4rem 0 .8rem; color: #19130f; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.content-prose :deep(p), .content-prose :deep(ul), .content-prose :deep(ol), .content-prose :deep(blockquote) { margin: 0 0 1.35rem; }
.content-prose :deep(ul), .content-prose :deep(ol) { padding-left: 1.35rem; }
.content-prose :deep(li) { margin-bottom: .55rem; }
.content-prose :deep(a) { color: #7c183a; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
.content-prose :deep(blockquote) { border-left: 2px solid #c89b3c; padding: .5rem 0 .5rem 1.5rem; color: #19130f; font-family: var(--display); font-size: 1.7rem; line-height: 1.35; }
.content-prose :deep(hr) { margin: 3rem 0; border: 0; border-top: 1px solid #d6d0c8; }
.content-prose :deep(img) { max-width: 100%; height: auto; margin: 2rem 0; }
</style>
