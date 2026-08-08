<script setup lang="ts">
const router = useRouter()
const { register, socialLogin } = useAuth()
const { requestAccessToken } = useGoogleAuth()

const form = reactive({ name: '', email: '', phone: '', password: '', passwordConfirmation: '' })
const showPassword = ref(false)
const loading = ref(false)
const socialLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string[]>>({})

const submit = async () => {
  errorMessage.value = ''
  fieldErrors.value = {}
  if (form.password !== form.passwordConfirmation) {
    fieldErrors.value = { password_confirmation: ['Passwords do not match.'] }
    return
  }

  loading.value = true
  try {
    await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      password: form.password,
      password_confirmation: form.passwordConfirmation,
    })
    await router.push('/account?welcome=1')
  }
  catch (error) {
    const details = authErrorDetails(error, 'We could not create your account.')
    errorMessage.value = details.message
    fieldErrors.value = details.errors
  }
  finally {
    loading.value = false
  }
}

const registerWithGoogle = async () => {
  errorMessage.value = ''
  socialLoading.value = true
  try {
    const accessToken = await requestAccessToken()
    await socialLogin('google', accessToken)
    await router.push('/account?welcome=1')
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, error instanceof Error ? error.message : 'Google sign-up failed.').message
  }
  finally {
    socialLoading.value = false
  }
}

useSeoMeta({ title: 'Create account — Glamrush', description: 'Create your Glamrush customer account.' })
</script>

<template>
  <AuthShell eyebrow="The scent list" title="Make it yours." description="Build a private fragrance wardrobe and keep every discovery, delivery and order in one considered place.">
    <div class="mb-7"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Membership</p><h2 class="mt-2 font-display text-3xl">Create account</h2></div>
    <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" icon="i-lucide-circle-alert" class="mb-5" />

    <form class="grid gap-4" @submit.prevent="submit">
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Full name</span><UInput v-model="form.name" name="name" autocomplete="name" size="xl" class="w-full" required /><p v-if="fieldErrors.name?.[0]" class="mt-1 text-xs text-red-700">{{ fieldErrors.name[0] }}</p></label>
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Email address</span><UInput v-model="form.email" type="email" name="email" autocomplete="email" size="xl" class="w-full" required /><p v-if="fieldErrors.email?.[0]" class="mt-1 text-xs text-red-700">{{ fieldErrors.email[0] }}</p></label>
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Phone <span class="font-normal normal-case tracking-normal text-neutral-400">(optional)</span></span><UInput v-model="form.phone" type="tel" name="phone" autocomplete="tel" placeholder="+234…" size="xl" class="w-full" /><p v-if="fieldErrors.phone?.[0]" class="mt-1 text-xs text-red-700">{{ fieldErrors.phone[0] }}</p></label>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Password</span><UInput v-model="form.password" :type="showPassword ? 'text' : 'password'" name="password" autocomplete="new-password" minlength="8" size="xl" class="w-full" required /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Confirm</span><UInput v-model="form.passwordConfirmation" :type="showPassword ? 'text' : 'password'" name="password_confirmation" autocomplete="new-password" minlength="8" size="xl" class="w-full" required /></label>
      </div>
      <label class="flex items-center gap-2 text-xs text-neutral-500"><input v-model="showPassword" type="checkbox" class="accent-neutral-950"> Show passwords</label>
      <p v-if="fieldErrors.password?.[0] || fieldErrors.password_confirmation?.[0]" class="text-xs text-red-700">{{ fieldErrors.password?.[0] || fieldErrors.password_confirmation?.[0] }}</p>
      <UButton type="submit" label="Create my account" color="neutral" size="xl" block class="mt-1 rounded-none !text-white" :loading="loading" />
    </form>

    <div class="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-neutral-400"><span class="h-px flex-1 bg-neutral-200" /><span>or</span><span class="h-px flex-1 bg-neutral-200" /></div>
    <AuthGoogleButton :loading="socialLoading" @authenticate="registerWithGoogle" />
    <p class="mt-7 text-center text-sm text-neutral-600">Already a member? <NuxtLink to="/auth/sign-in" class="font-semibold text-neutral-950 underline decoration-glam-gold underline-offset-4">Sign in</NuxtLink></p>
  </AuthShell>
</template>
