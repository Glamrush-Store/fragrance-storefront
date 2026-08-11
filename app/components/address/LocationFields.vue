<script setup lang="ts">
import type { CountryOption, LocationOption } from '~/types/location'

const props = defineProps<{
  country: string
  state: string
  city: string
}>()

const emit = defineEmits<{
  'update:country': [value: string]
  'update:state': [value: string]
  'update:city': [value: string]
}>()

const { getCountries, getStates, getCities } = useLocations()
const countries = ref<CountryOption[]>([])
const states = ref<LocationOption[]>([])
const cities = ref<LocationOption[]>([])
const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadError = ref('')
let countriesRequest: Promise<void> | null = null
let hydrationSequence = 0

const optionMatches = (option: { label: string, value?: string, code?: string }, value: string) => {
  const needle = value.trim().toLocaleLowerCase()
  return option.label.trim().toLocaleLowerCase() === needle
    || option.value?.trim().toLocaleLowerCase() === needle
    || option.code?.trim().toLocaleLowerCase() === needle
}

const loadCountries = () => {
  if (countries.value.length) return Promise.resolve()
  if (countriesRequest) return countriesRequest

  loadingCountries.value = true
  countriesRequest = getCountries()
    .then(response => { countries.value = response.data })
    .finally(() => {
      loadingCountries.value = false
      countriesRequest = null
    })

  return countriesRequest
}

const hydrate = async (countryValue: string, stateValue: string) => {
  const sequence = ++hydrationSequence
  loadError.value = ''

  try {
    await loadCountries()
    if (sequence !== hydrationSequence) return

    const countryOption = countries.value.find(option => optionMatches(option, countryValue))
    const country = countryOption?.code || countryValue
    if (countryOption && country !== countryValue) emit('update:country', country)

    states.value = []
    cities.value = []
    if (!country) return

    loadingStates.value = true
    const stateResponse = await getStates(country)
    if (sequence !== hydrationSequence) return
    states.value = stateResponse.data

    const stateOption = states.value.find(option => optionMatches(option, stateValue))
    const state = stateOption?.value || stateValue
    if (stateOption && state !== stateValue) emit('update:state', state)
    if (!state) return

    loadingCities.value = true
    const cityResponse = await getCities(country, state)
    if (sequence !== hydrationSequence) return
    cities.value = cityResponse.data

    const cityOption = cities.value.find(option => optionMatches(option, props.city))
    if (cityOption && cityOption.value !== props.city) emit('update:city', cityOption.value)
  }
  catch (error) {
    if (sequence === hydrationSequence) {
      loadError.value = authErrorDetails(error, 'We could not load locations.').message
    }
  }
  finally {
    if (sequence === hydrationSequence) {
      loadingStates.value = false
      loadingCities.value = false
    }
  }
}

const selectedValue = (event: Event) => (event.target as HTMLSelectElement).value

const onCountryChange = (event: Event) => {
  const country = selectedValue(event)
  emit('update:country', country)
  emit('update:state', '')
  emit('update:city', '')
}

const onStateChange = (event: Event) => {
  const state = selectedValue(event)
  emit('update:state', state)
  emit('update:city', '')
}

watch(
  () => [props.country, props.state] as const,
  ([country, state]) => { void hydrate(country, state) },
  { immediate: true },
)
</script>

<template>
  <div class="contents">
    <label class="block">
      <span class="mb-2 block text-xs font-semibold">Country</span>
      <select
        :value="country"
        autocomplete="country"
        class="h-10 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-950 disabled:cursor-wait disabled:bg-neutral-50"
        :disabled="loadingCountries"
        required
        @change="onCountryChange"
      >
        <option value="" disabled>{{ loadingCountries ? 'Loading countries…' : 'Select country' }}</option>
        <option v-for="option in countries" :key="option.code" :value="option.code">{{ option.label }}</option>
      </select>
    </label>

    <label class="block">
      <span class="mb-2 block text-xs font-semibold">State</span>
      <select
        v-if="loadingStates || states.length"
        :value="state"
        autocomplete="address-level1"
        class="h-10 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-950 disabled:cursor-wait disabled:bg-neutral-50"
        :disabled="!country || loadingStates"
        required
        @change="onStateChange"
      >
        <option value="" disabled>{{ loadingStates ? 'Loading states…' : 'Select state' }}</option>
        <option v-for="option in states" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <UInput v-else :model-value="state" autocomplete="address-level1" class="w-full" required @update:model-value="emit('update:state', String($event || ''))" />
    </label>

    <label class="block">
      <span class="mb-2 block text-xs font-semibold">City</span>
      <select
        v-if="loadingCities || cities.length"
        :value="city"
        autocomplete="address-level2"
        class="h-10 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-950 disabled:cursor-wait disabled:bg-neutral-50"
        :disabled="!state || loadingCities"
        required
        @change="emit('update:city', selectedValue($event))"
      >
        <option value="" disabled>{{ loadingCities ? 'Loading cities…' : 'Select city' }}</option>
        <option v-for="option in cities" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <UInput v-else :model-value="city" autocomplete="address-level2" class="w-full" required @update:model-value="emit('update:city', String($event || ''))" />
    </label>

    <p v-if="loadError" class="text-xs text-red-700 sm:col-span-2" role="alert">{{ loadError }}</p>
  </div>
</template>
