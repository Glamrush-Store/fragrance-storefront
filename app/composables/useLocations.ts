import type { CountryOption, LocationOption } from '~/types/location'

export const useLocations = () => {
  const api = useApi()

  const getCountries = () => api.get<CountryOption[]>('/locations/countries')
  const getStates = (country: string) => api.get<LocationOption[]>(
    `/locations/countries/${encodeURIComponent(country)}/states`,
  )
  const getCities = (country: string, state: string) => api.get<LocationOption[]>(
    `/locations/countries/${encodeURIComponent(country)}/states/${encodeURIComponent(state)}/cities`,
  )

  return { getCountries, getStates, getCities }
}
