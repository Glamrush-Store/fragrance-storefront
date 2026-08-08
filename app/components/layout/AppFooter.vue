<script setup lang="ts">
const api = useApi()
const email = ref('')
const submitting = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')

const joinNewsletter = async () => {
  if (!email.value || submitting.value) return

  submitting.value = true
  statusMessage.value = ''
  errorMessage.value = ''

  try {
    await api.post<null>('/newsletter/subscriptions', {
      email: email.value,
      source: 'storefront-footer',
    })

    email.value = ''
    statusMessage.value = 'Check your inbox to confirm your subscription.'
  }
  catch (error) {
    errorMessage.value = authErrorDetails(
      error,
      'We could not save your subscription. Please try again.',
    ).message
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <footer class="bg-glam-ivory">
    <div class="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-10 border-b border-neutral-300 pb-14 md:grid-cols-2 md:items-end">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-glam-gold">Stay in the know</p>
          <h2 class="font-display text-4xl sm:text-5xl">New notes,<br><em>before anyone else.</em></h2>
        </div>
        <div>
          <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="joinNewsletter">
            <UInput
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              aria-label="Email address"
              aria-describedby="newsletter-feedback"
              size="xl"
              class="flex-1"
              :disabled="submitting"
              required
            />
            <UButton
              type="submit"
              label="Join us"
              trailing-icon="i-lucide-arrow-right"
              color="neutral"
              class="justify-center rounded-none px-5"
              :loading="submitting"
              :disabled="submitting"
            />
          </form>
          <div id="newsletter-feedback" class="mt-3 min-h-5 text-sm" aria-live="polite">
            <p v-if="statusMessage" class="text-neutral-600" role="status">{{ statusMessage }}</p>
            <p v-else-if="errorMessage" class="text-red-700" role="alert">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 pt-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink to="/" class="font-display text-xl tracking-[0.12em] text-neutral-950">GLAMRUSH</NuxtLink>
        <div class="flex flex-wrap gap-6"><NuxtLink to="/#shop">Shop</NuxtLink><NuxtLink to="/#story">About</NuxtLink><a href="mailto:hello@glamrush.com">Contact</a><a href="#">Instagram</a></div>
        <p>© {{ new Date().getFullYear() }} Glamrush</p>
      </div>
    </div>
  </footer>
</template>
