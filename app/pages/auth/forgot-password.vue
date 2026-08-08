<script setup lang="ts">
const router = useRouter()
const { forgotPassword, verifyPasswordCode, resetPassword } = useAuth()

const step = ref<1 | 2 | 3>(1)
const email = ref('')
const code = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const statusMessage = ref('')

const submitEmail = async () => {
  errorMessage.value = ''
  statusMessage.value = ''
  loading.value = true
  try {
    const response = await forgotPassword(email.value.trim())
    statusMessage.value = response.message
    step.value = 2
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not send the reset code.').message
  }
  finally {
    loading.value = false
  }
}

const submitCode = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await verifyPasswordCode(email.value.trim(), code.value.replace(/\D/g, ''))
    statusMessage.value = response.message
    step.value = 3
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'That code is invalid or has expired.').message
  }
  finally {
    loading.value = false
  }
}

const submitPassword = async () => {
  errorMessage.value = ''
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    await resetPassword(email.value.trim(), password.value, passwordConfirmation.value)
    await router.push({ path: '/auth/sign-in', query: { email: email.value.trim(), reset: 'success' } })
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not reset your password.').message
  }
  finally {
    loading.value = false
  }
}

const resendCode = async () => {
  code.value = ''
  await submitEmail()
}

useSeoMeta({ title: 'Reset password — Glamrush', description: 'Recover access to your Glamrush account.' })
</script>

<template>
  <AuthShell eyebrow="Account recovery" title="Find your way back." description="We’ll send a private six-digit code to your email. It expires after fifteen minutes.">
    <div class="mb-7">
      <div class="mb-6 flex gap-2" aria-label="Password reset progress">
        <span v-for="number in 3" :key="number" class="h-1 flex-1 transition-colors" :class="number <= step ? 'bg-glam-gold' : 'bg-neutral-200'" />
      </div>
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Step {{ step }} of 3</p>
      <h2 class="mt-2 font-display text-3xl">{{ step === 1 ? 'Request a code' : step === 2 ? 'Enter your code' : 'Choose a password' }}</h2>
    </div>

    <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" icon="i-lucide-circle-alert" class="mb-5" />
    <UAlert v-if="statusMessage && !errorMessage" :description="statusMessage" color="success" variant="subtle" class="mb-5" />

    <form v-if="step === 1" class="space-y-5" @submit.prevent="submitEmail">
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Email address</span><UInput v-model="email" type="email" autocomplete="email" placeholder="you@example.com" size="xl" class="w-full" required /></label>
      <UButton type="submit" label="Email my code" color="neutral" size="xl" block class="rounded-none !text-white" :loading="loading" />
    </form>

    <form v-else-if="step === 2" class="space-y-5" @submit.prevent="submitCode">
      <p class="text-sm leading-6 text-neutral-600">Code sent to <strong class="text-neutral-950">{{ email }}</strong>.</p>
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Six-digit code</span><UInput v-model="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" size="xl" class="w-full font-mono text-xl tracking-[0.35em]" required /></label>
      <UButton type="submit" label="Verify code" color="neutral" size="xl" block class="rounded-none !text-white" :loading="loading" :disabled="code.replace(/\D/g, '').length !== 6" />
      <div class="flex justify-between text-xs"><button type="button" class="text-neutral-500 underline-offset-4 hover:underline" @click="step = 1">Change email</button><button type="button" class="text-neutral-500 underline-offset-4 hover:underline" :disabled="loading" @click="resendCode">Send another code</button></div>
    </form>

    <form v-else class="space-y-5" @submit.prevent="submitPassword">
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">New password</span><UInput v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" size="xl" class="w-full" required /></label>
      <label class="block"><span class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]">Confirm password</span><UInput v-model="passwordConfirmation" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" size="xl" class="w-full" required /></label>
      <label class="flex items-center gap-2 text-xs text-neutral-500"><input v-model="showPassword" type="checkbox" class="accent-neutral-950"> Show passwords</label>
      <UButton type="submit" label="Set new password" color="neutral" size="xl" block class="rounded-none !text-white" :loading="loading" />
    </form>

    <p class="mt-7 text-center text-sm"><NuxtLink to="/auth/sign-in" class="text-neutral-600 underline decoration-glam-gold underline-offset-4">Return to sign in</NuxtLink></p>
  </AuthShell>
</template>
