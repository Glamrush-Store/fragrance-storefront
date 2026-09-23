<script setup lang="ts">
const config = useRuntimeConfig()
const { absoluteUrl, canonicalUrl, siteUrl } = useSiteSeo()
const storefrontSlug = computed(() => String(config.public.storefrontSlug || 'fragrances'))

useSeoMeta({
  ogSiteName: 'Glamrush',
  ogLocale: 'en_NG',
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl.value }],
}))

useJsonLd('site-identity', () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      'name': 'Glamrush',
      'url': siteUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      'url': siteUrl,
      'name': 'Glamrush',
      'publisher': { '@id': `${siteUrl}/#organization` },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${absoluteUrl(`/category/${storefrontSlug.value}`)}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}))
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
