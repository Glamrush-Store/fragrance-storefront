<script setup lang="ts">
defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ authenticate: [] }>()
const { clientId } = useGoogleAuth()
</script>

<template>
  <div>
    <UButton
      label="Continue with Google"
      icon="i-lucide-chrome"
      color="neutral"
      variant="outline"
      size="xl"
      block
      class="rounded-none"
      :loading="loading"
      :disabled="!clientId"
      @click="emit('authenticate')"
    />
    <p v-if="!clientId" class="mt-2 text-center text-[11px] text-neutral-400">Google sign-in requires NUXT_PUBLIC_GOOGLE_CLIENT_ID.</p>
  </div>
</template>
