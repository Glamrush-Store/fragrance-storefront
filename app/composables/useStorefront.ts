import type { Category, Product, StorefrontConfiguration, StorefrontHomepage } from '~/types/catalog'

export const useStorefront = () => {
  const config = useRuntimeConfig()
  const api = useApi()
  const basePath = `/storefronts/${config.public.storefrontSlug}`

  const getHomepage = () => api.get<StorefrontHomepage>(`${basePath}/homepage`)
  const getConfiguration = () => api.get<StorefrontConfiguration>(`${basePath}/configuration`)
  const getCategories = () => api.get<Category[]>(`${basePath}/categories`, { deep: true })
  const getFeaturedProducts = () => api.get<Product[]>(`${basePath}/products`, { featured: true, per_page: 8 })
  const getSaleProducts = () => api.get<Product[]>(`${basePath}/products`, { onSale: true, per_page: 8 })
  const getProduct = (slug: string) => api.get<Product>(`${basePath}/products/${slug}`)
  const getCategoryProducts = (category: string, options: {
    page?: number
    perPage?: number
    sort?: string
    direction?: 'asc' | 'desc'
    brand?: string
    search?: string
    priceMin?: number
    priceMax?: number
    onSale?: boolean
    filters?: string
  } = {}) => api.get<Product[]>(`${basePath}/products`, {
      category,
      page: options.page ?? 1,
      per_page: options.perPage ?? 12,
      sort: options.sort ?? 'sort_order',
      direction: options.direction ?? 'asc',
      brand: options.brand,
      search: options.search,
      price_min: options.priceMin,
      price_max: options.priceMax,
      onSale: options.onSale,
      filters: options.filters,
  })

  return { getHomepage, getConfiguration, getCategories, getFeaturedProducts, getSaleProducts, getProduct, getCategoryProducts }
}
