<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { user, login, socialLogin, ensureSession } = useAuth()
const { requestAccessToken } = useGoogleAuth()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const socialLoading = ref(false)
const errorMessage = ref('')

const redirectPath = computed(() => {
  const target = typeof route.query.redirect === 'string' ? route.query.redirect : '/account'
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account'
})

const finishAuthentication = () => router.push(redirectPath.value)

const submit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await login(email.value.trim(), password.value)
    await finishAuthentication()
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not sign you in. Check your details and try again.').message
  }
  finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  errorMessage.value = ''
  socialLoading.value = true
  try {
    const accessToken = await requestAccessToken()
    await socialLogin('google', accessToken)
    await finishAuthentication()
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, error instanceof Error ? error.message : 'Google sign-in failed.').message
  }
  finally {
    socialLoading.value = false
  }
}

onMounted(async () => {
  await ensureSession()
  if (user.value) await finishAuthentication()
})

useSeoMeta({ title: 'Sign in — Glamrush', description: 'Sign in to your Glamrush account.' })
</script>

<template>
  <AuthShell eyebrow="Private access" title="Welcome back." description="Sign in to revisit saved fragrances, manage delivery details and follow your orders.">
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Your account</p>
      <h2 class="mt-2 font-display text-3xl">Sign in</h2>
    </div>

    <UAlert v-if="route.query.reset === 'success'" title="Password updated" description="Your new password is ready. Sign in to continue." color="success" variant="subtle" class="mb-5" />
    <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" icon="i-lucide-circle-alert" class="mb-5" />

    <form class="space-y-5" @submit.prevent="submit">
      <label class="block">
        <span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Email address</span>
        <UInput v-model="email" type="email" name="email" autocomplete="email" placeholder="you@example.com" size="xl" class="w-full" required />
      </label>
      <label class="block">
        <span class="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em]"><span>Password</span><NuxtLink to="/auth/forgot-password" class="normal-case tracking-normal text-neutral-500 underline-offset-4 hover:underline">Forgot password?</NuxtLink></span>
        <UInput v-model="password" :type="showPassword ? 'text' : 'password'" name="password" autocomplete="current-password" placeholder="Your password" size="xl" class="w-full" required>
          <template #trailing><UButton :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" :aria-label="showPassword ? 'Hide password' : 'Show password'" color="neutral" variant="ghost" size="xs" square @click="showPassword = !showPassword" /></template>
        </UInput>
      </label>
      <UButton type="submit" label="Sign in" color="neutral" size="xl" block class="rounded-none !text-white" :loading="loading" />
    </form>

    <div class="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-neutral-400"><span class="h-px flex-1 bg-neutral-200" /><span>or</span><span class="h-px flex-1 bg-neutral-200" /></div>
    <AuthGoogleButton :loading="socialLoading" @authenticate="signInWithGoogle" />

    <p class="mt-7 text-center text-sm text-neutral-600">New to Glamrush? <NuxtLink to="/auth/register" class="font-semibold text-neutral-950 underline decoration-glam-gold underline-offset-4">Create an account</NuxtLink></p>
  </AuthShell>
</template>
