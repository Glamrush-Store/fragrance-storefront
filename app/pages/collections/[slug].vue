<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug || '').trim().replace(/\s+/g, '-')

definePageMeta({
  robots: 'noindex, follow',
})

await navigateTo(`/category/${encodeURIComponent(slug)}`, {
  redirectCode: 301,
  replace: true,
})
</script>

<template>
  <div />
</template>
