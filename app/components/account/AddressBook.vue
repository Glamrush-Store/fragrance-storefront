<script setup lang="ts">
import type { AddressPayload, CustomerAddress } from '~/types/account'

const { listAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } = useCustomerAccount()
const addresses = ref<CustomerAddress[]>([])
const loading = ref(true)
const saving = ref(false)
const busyId = ref<string | null>(null)
const errorMessage = ref('')
const showForm = ref(false)
const editingId = ref<string | null>(null)

const emptyForm = (): AddressPayload => ({
  label: '', first_name: '', last_name: '', phone: '', address_line_1: '', address_line_2: '',
  country: 'Nigeria', state: '', city: '', postal_code: '', is_default: false,
})
const form = reactive<AddressPayload>(emptyForm())

const load = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    addresses.value = (await listAddresses()).data
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not load your addresses.').message
  }
  finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, emptyForm())
  editingId.value = null
  showForm.value = false
}

const startCreate = () => {
  Object.assign(form, emptyForm())
  editingId.value = null
  showForm.value = true
}

const startEdit = (address: CustomerAddress) => {
  Object.assign(form, {
    label: address.label || '', first_name: address.first_name, last_name: address.last_name,
    phone: address.phone || '', address_line_1: address.address_line_1,
    address_line_2: address.address_line_2 || '', country: address.country, state: address.state,
    city: address.city, postal_code: address.postal_code, is_default: address.is_default,
  })
  editingId.value = address.id
  showForm.value = true
}

const submit = async () => {
  saving.value = true
  errorMessage.value = ''
  try {
    if (editingId.value) await updateAddress(editingId.value, { ...form })
    else await createAddress({ ...form })
    resetForm()
    await load()
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not save this address.').message
  }
  finally {
    saving.value = false
  }
}

const makeDefault = async (address: CustomerAddress) => {
  busyId.value = address.id
  try {
    await setDefaultAddress(address.id)
    await load()
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not update your default address.').message
  }
  finally {
    busyId.value = null
  }
}

const remove = async (address: CustomerAddress) => {
  if (!window.confirm(`Remove ${address.label || 'this address'} from your address book?`)) return
  busyId.value = address.id
  try {
    await deleteAddress(address.id)
    await load()
  }
  catch (error) {
    errorMessage.value = authErrorDetails(error, 'We could not remove this address.').message
  }
  finally {
    busyId.value = null
  }
}

onMounted(load)
</script>

<template>
  <section id="addresses" class="scroll-mt-28 border-t border-neutral-300 pt-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-glam-gold">01 / Delivery</p>
        <h2 class="mt-2 font-display text-4xl sm:text-5xl">Address management</h2>
        <p class="mt-3 max-w-xl text-sm leading-6 text-neutral-500">Keep delivery destinations ready for a faster checkout.</p>
      </div>
      <UButton v-if="!showForm" label="Add an address" icon="i-lucide-plus" color="neutral" class="rounded-none !text-white" @click="startCreate" />
    </div>

    <UAlert v-if="errorMessage" :description="errorMessage" color="error" variant="subtle" class="mt-6" />

    <form v-if="showForm" class="mt-8 border border-neutral-300 bg-white p-5 sm:p-8" @submit.prevent="submit">
      <div class="mb-7 flex items-start justify-between gap-4">
        <div><p class="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Address editor</p><h3 class="mt-1 font-display text-3xl">{{ editingId ? 'Edit destination' : 'New destination' }}</h3></div>
        <UButton type="button" icon="i-lucide-x" aria-label="Close address form" color="neutral" variant="ghost" square @click="resetForm" />
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block"><span class="mb-2 block text-xs font-semibold">Label</span><UInput v-model="form.label" placeholder="Home, work…" class="w-full" /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">Phone</span><UInput v-model="form.phone" type="tel" autocomplete="tel" class="w-full" /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">First name</span><UInput v-model="form.first_name" autocomplete="given-name" class="w-full" required /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">Last name</span><UInput v-model="form.last_name" autocomplete="family-name" class="w-full" required /></label>
        <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Address line 1</span><UInput v-model="form.address_line_1" autocomplete="address-line1" class="w-full" required /></label>
        <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold">Address line 2</span><UInput v-model="form.address_line_2" autocomplete="address-line2" class="w-full" /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">City</span><UInput v-model="form.city" autocomplete="address-level2" class="w-full" required /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">State</span><UInput v-model="form.state" autocomplete="address-level1" class="w-full" required /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">Postal code</span><UInput v-model="form.postal_code" autocomplete="postal-code" class="w-full" required /></label>
        <label class="block"><span class="mb-2 block text-xs font-semibold">Country</span><UInput v-model="form.country" autocomplete="country-name" class="w-full" required /></label>
      </div>
      <label class="mt-6 flex cursor-pointer items-center gap-3 text-sm"><input v-model="form.is_default" type="checkbox" class="size-4 accent-neutral-950"> Make this my default delivery address</label>
      <div class="mt-8 flex gap-3"><UButton type="submit" :label="editingId ? 'Save changes' : 'Save address'" color="neutral" class="rounded-none !text-white" :loading="saving" /><UButton type="button" label="Cancel" color="neutral" variant="outline" class="rounded-none" @click="resetForm" /></div>
    </form>

    <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2"><USkeleton v-for="index in 2" :key="index" class="h-52 rounded-none" /></div>
    <div v-else-if="addresses.length" class="mt-8 grid gap-4 md:grid-cols-2">
      <article v-for="address in addresses" :key="address.id" class="relative flex min-h-56 flex-col justify-between border p-6" :class="address.is_default ? 'border-glam-gold bg-[#fffdf7]' : 'border-neutral-200 bg-white'">
        <div>
          <div class="flex items-center justify-between gap-4"><p class="text-[10px] font-bold uppercase tracking-[0.18em]">{{ address.label || 'Address' }}</p><span v-if="address.is_default" class="bg-glam-gold px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">Default</span></div>
          <p class="mt-6 font-display text-2xl">{{ address.first_name }} {{ address.last_name }}</p>
          <p class="mt-3 text-sm leading-6 text-neutral-600">{{ address.address_line_1 }}<template v-if="address.address_line_2"><br>{{ address.address_line_2 }}</template><br>{{ address.city }}, {{ address.state }} {{ address.postal_code }}<br>{{ address.country }}</p>
          <p v-if="address.phone" class="mt-3 text-xs text-neutral-400">{{ address.phone }}</p>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-4 border-t border-neutral-100 pt-4 text-xs font-semibold">
          <button class="hover:underline" @click="startEdit(address)">Edit</button>
          <button v-if="!address.is_default" class="hover:underline" :disabled="busyId === address.id" @click="makeDefault(address)">Set as default</button>
          <button class="ml-auto text-red-700 hover:underline" :disabled="busyId === address.id" @click="remove(address)">Remove</button>
        </div>
      </article>
    </div>
    <div v-else-if="!showForm" class="mt-8 border border-dashed border-neutral-300 bg-white/50 px-6 py-14 text-center"><UIcon name="i-lucide-map-pin" class="mx-auto size-8 text-glam-gold" /><h3 class="mt-4 font-display text-2xl">No saved addresses</h3><p class="mt-2 text-sm text-neutral-500">Add your first delivery destination.</p></div>
  </section>
</template>
