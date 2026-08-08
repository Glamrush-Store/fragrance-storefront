<script setup lang="ts">
import type { ContactSocialLink, PublicContentPage } from '~/types/content'

const { getPage, submitContact } = useContent()
const { user, ensureSession } = useAuth()
const { data: pageResponse } = await useAsyncData('content-page:contact', async () => {
  try { return await getPage('contact') }
  catch { return null }
})

const fallbackPage: PublicContentPage = {
  id: 'contact', slug: 'contact', title: 'Let’s talk', navigation_title: 'Contact',
  excerpt: 'Questions about an order, a fragrance or finding your next signature? Our concierge is here.',
  content: '', page_type: 'contact', settings: null,
}
const page = computed(() => pageResponse.value?.data || fallbackPage)
const settings = computed(() => page.value.settings || {})
const submitting = ref(false)
const errorMessage = ref('')
const reference = ref('')
const form = reactive({ name: '', email: '', phone: '', subject: '', message: '', website: '' })

const socialLinks = computed<ContactSocialLink[]>(() => {
  const links = settings.value.social_links
  if (!links) return []
  if (Array.isArray(links)) return links.filter(link => safeHttpsUrl(link.url))
  return Object.entries(links).map(([label, url]) => ({ label, url })).filter(link => safeHttpsUrl(link.url))
})
const safeHttpsUrl = (value?: string | null) => {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : null
  }
  catch { return null }
}
const whatsappUrl = computed(() => {
  const digits = String(settings.value.whatsapp || '').replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
})

const submit = async () => {
  if (submitting.value) return
  submitting.value = true
  errorMessage.value = ''
  try {
    const response = await submitContact({
      name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined,
      subject: form.subject.trim() || undefined, message: form.message.trim(), source: 'contact-page', website: form.website,
    })
    reference.value = response.data.reference
    Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '', website: '' })
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not send your message. Please review the details and try again.').message
  }
  finally { submitting.value = false }
}

onMounted(async () => {
  await ensureSession().catch(() => undefined)
  if (user.value) {
    form.name ||= user.value.name || ''
    form.email ||= user.value.email || ''
    form.phone ||= user.value.phone || ''
  }
})

useSeoMeta({
  title: () => `${page.value.meta_title || page.value.title} — Glamrush`,
  description: () => page.value.meta_description || page.value.excerpt || 'Contact the Glamrush concierge.',
})
</script>

<template>
  <div class="min-h-screen bg-[#fbf6ef] text-[#19130f]">
    <a href="#contact-content" class="fixed left-4 top-[-60px] z-[100] bg-neutral-950 px-4 py-3 text-sm text-white focus:top-4">Skip to content</a>
    <LayoutAppHeader />
    <main id="contact-content">
      <ContentPageHero :page="page" />

      <section class="mx-auto grid max-w-[1180px] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:gap-24 lg:py-32">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7c183a]">A human answer</p>
          <h2 class="mt-4 max-w-lg font-display text-4xl leading-[1.05] sm:text-6xl">Tell us what’s on your mind.</h2>
          <div v-if="page.content" class="contact-copy mt-8 max-w-xl text-sm leading-7 text-neutral-600" v-html="page.content" />

          <dl class="mt-12 grid gap-px overflow-hidden border border-neutral-300 bg-neutral-300 sm:grid-cols-2">
            <div v-if="settings.email" class="bg-[#fbf6ef] p-5"><dt class="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Email</dt><dd class="mt-2 text-sm"><a :href="`mailto:${settings.email}`" class="hover:text-[#7c183a]">{{ settings.email }}</a></dd></div>
            <div v-if="settings.phone" class="bg-[#fbf6ef] p-5"><dt class="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Call</dt><dd class="mt-2 text-sm"><a :href="`tel:${settings.phone}`" class="hover:text-[#7c183a]">{{ settings.phone }}</a></dd></div>
            <div v-if="settings.business_hours" class="bg-[#fbf6ef] p-5"><dt class="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Hours</dt><dd class="mt-2 whitespace-pre-line text-sm leading-6">{{ settings.business_hours }}</dd></div>
            <div v-if="settings.address" class="bg-[#fbf6ef] p-5"><dt class="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Find us</dt><dd class="mt-2 text-sm leading-6">{{ settings.address }}</dd><a v-if="safeHttpsUrl(settings.map_url)" :href="safeHttpsUrl(settings.map_url) || undefined" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7c183a]">Open map ↗</a></div>
          </dl>

          <div v-if="whatsappUrl || socialLinks.length" class="mt-7 flex flex-wrap gap-5 text-[10px] font-semibold uppercase tracking-[0.12em]"><a v-if="whatsappUrl" :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="border-b border-neutral-400 pb-1 hover:border-[#7c183a] hover:text-[#7c183a]">WhatsApp ↗</a><a v-for="link in socialLinks" :key="link.url" :href="safeHttpsUrl(link.url) || undefined" target="_blank" rel="noopener noreferrer" class="border-b border-neutral-400 pb-1 hover:border-[#7c183a] hover:text-[#7c183a]">{{ link.label || link.name || link.platform || 'Social' }} ↗</a></div>
        </div>

        <div class="border border-neutral-300 bg-white p-5 shadow-[18px_18px_0_#e8ded1] sm:p-8">
          <div v-if="reference" class="flex min-h-[32rem] flex-col items-center justify-center px-4 text-center" role="status"><span class="grid size-14 place-items-center rounded-full bg-[#e2ca82]/35 text-[#7c183a]"><UIcon name="i-lucide-check" class="size-6" /></span><p class="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c183a]">Message received</p><h2 class="mt-3 font-display text-4xl">We’ll be in touch.</h2><p class="mt-4 max-w-sm text-sm leading-6 text-neutral-500">Thank you for writing to Glamrush. Keep this reference if you need to follow up.</p><code class="mt-5 bg-[#fbf6ef] px-3 py-2 text-xs">{{ reference }}</code><UButton type="button" label="Send another message" color="neutral" variant="outline" class="mt-8 rounded-none" @click="reference = ''" /></div>

          <form v-else @submit.prevent="submit">
            <div class="mb-8 flex items-end justify-between border-b border-neutral-200 pb-5"><div><p class="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#7c183a]">Contact form</p><h2 class="mt-1 font-display text-3xl">Write to us</h2></div><span class="text-[9px] text-neutral-400">Usually within 1–2 days</span></div>
            <div class="grid gap-5 sm:grid-cols-2">
              <label class="block"><span class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em]">Name</span><UInput v-model="form.name" autocomplete="name" class="w-full" maxlength="150" required /></label>
              <label class="block"><span class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em]">Email</span><UInput v-model="form.email" type="email" autocomplete="email" class="w-full" maxlength="255" required /></label>
              <label class="block"><span class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em]">Phone <i class="font-normal normal-case tracking-normal text-neutral-400">optional</i></span><UInput v-model="form.phone" type="tel" autocomplete="tel" class="w-full" maxlength="30" /></label>
              <label class="block"><span class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em]">Subject <i class="font-normal normal-case tracking-normal text-neutral-400">optional</i></span><UInput v-model="form.subject" class="w-full" maxlength="180" /></label>
              <label class="block sm:col-span-2"><span class="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em]">How can we help?</span><UTextarea v-model="form.message" :rows="7" autoresize class="w-full" minlength="10" maxlength="5000" required /></label>
              <label class="absolute -left-[9999px]" aria-hidden="true">Website<input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>
            <UAlert v-if="errorMessage" class="mt-5" color="error" variant="subtle" :description="errorMessage" />
            <div class="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between"><p class="max-w-xs text-[10px] leading-5 text-neutral-400">By sending this message, you agree that we may use these details to respond to your enquiry.</p><UButton type="submit" label="Send message" trailing-icon="i-lucide-arrow-right" color="neutral" size="lg" class="shrink-0 justify-center rounded-none !text-white" :loading="submitting" /></div>
          </form>
        </div>
      </section>
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.contact-copy :deep(p) { margin: 0 0 1rem; }
.contact-copy :deep(a) { color: #7c183a; text-decoration: underline; text-underline-offset: 3px; }
</style>
