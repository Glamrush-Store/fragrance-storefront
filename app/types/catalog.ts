export interface MediaImage {
  id?: string | number
  name?: string
  url?: string
  thumb?: string
  medium?: string
}

export interface Category {
  id: string | number
  name: string
  slug: string
  images?: string | MediaImage | Array<string | MediaImage> | null
  children?: Category[]
  product_count?: number
}

export interface Product {
  id: string | number
  name: string
  slug: string
  sku?: string | null
  type?: 'simple' | 'variable' | string
  shortDescription?: string | null
  description?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  price: number | string | ProductPrice
  salePrice?: number | string | ProductPrice | null
  currentPrice?: number | string
  originalPrice?: number | string | null
  isOnSale?: boolean
  is_featured?: boolean
  available?: boolean
  images?: string | MediaImage | Array<string | MediaImage> | null
  category?: { name: string; slug: string } | null
  brand?: { name: string; slug: string } | null
  variants?: ProductVariant[]
  default_attributes?: ProductAttribute[]
  stock_quantity?: number
}

export interface ProductPrice {
  amount: number | string
  currency?: string
  saleAmount?: number | string | null
  onSale?: boolean
}

export interface ProductVariant {
  id: string | number
  isDefault?: boolean
  price: number | string | ProductPrice
  salePrice?: number | string | ProductPrice | null
  isOnSale?: boolean
  currentPrice?: number | string
  sku?: string | null
  images?: string | MediaImage | Array<string | MediaImage> | null
  stock_quantity?: number
  inStock?: boolean
  available?: boolean
  attributes?: ProductAttribute[]
}

export interface ProductAttribute {
  type: string
  value: string
  code?: string | null
  display_type?: string | null
  meta?: string | Record<string, unknown> | null
}

export interface StorefrontCampaign {
  id: string
  eyebrow?: string | null
  title: string
  description?: string | null
  desktop_image?: string | null
  mobile_image?: string | null
  cta_label?: string | null
  cta_url?: string | null
  starts_at?: string | null
  ends_at?: string | null
}

export type HomepageSectionType =
  | 'featured_products'
  | 'collection_products'
  | 'category_products'
  | 'sale_products'
  | 'manual_products'
  | 'newest_products'
  | 'random_categories'

export interface HomepageSection {
  id: string
  type: HomepageSectionType
  title: string
  subtitle?: string | null
  display_order: number
  items: Array<Product | Category>
}

export interface StorefrontHomepage {
  storefront: { slug: string; name: string }
  campaign: StorefrontCampaign | null
  sections: HomepageSection[]
}

export interface FacetOption {
  value: string
  label: string
  code?: string | null
  display_type?: string | null
  meta?: string | Record<string, unknown> | null
  count: number
}

export interface AttributeFacet {
  type: string
  display_type?: string | null
  options: FacetOption[]
}

export interface ProductFacets {
  price_range?: { min: number; max: number }
  brands?: Array<{ id: string | number; name: string; slug: string; count: number }>
  categories?: Array<{ id: string | number; name: string; slug: string; count: number }>
  attributes?: AttributeFacet[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number | null
    to?: number | null
  } | null
  links?: Record<string, string | null> | null
  facets?: ProductFacets
}
