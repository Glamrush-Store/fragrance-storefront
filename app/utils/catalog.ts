import type { Category, MediaImage, Product } from '~/types/catalog'

type CatalogImages = Product['images'] | Category['images']

const mediaUrl = (image: string | MediaImage | undefined | null): string | undefined => {
  if (!image) return undefined
  if (typeof image === 'string') return image
  return image.medium || image.url || image.thumb
}

export const catalogImageUrls = (images: CatalogImages): string[] => {
  const source = Array.isArray(images) ? images : images ? [images] : []
  return source.map(mediaUrl).filter((url): url is string => Boolean(url))
}

export const catalogImageUrl = (images: CatalogImages, fallback = '/favicon.ico'): string => {
  if (Array.isArray(images)) return mediaUrl(images[0]) || fallback
  return mediaUrl(images) || fallback
}

export const facetLabel = (type: string): string => type
  .split('_')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

export const facetSwatch = (code?: string | null, meta?: string | Record<string, unknown> | null): string | undefined => {
  if (code?.startsWith('#')) return code
  if (!meta) return undefined

  try {
    const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta
    return typeof parsed.hex === 'string' ? parsed.hex : undefined
  }
  catch {
    return undefined
  }
}

const priceAmount = (value: Product['price'] | Product['salePrice']): number | undefined => {
  if (value === undefined || value === null) return undefined
  const raw = typeof value === 'object' ? value.amount : value
  const amount = Number(raw)
  return Number.isFinite(amount) ? amount : undefined
}

export const productPricing = (product: Product): { current: number; original?: number; onSale: boolean } => {
  const variant = product.variants?.find(item => item.isDefault) ?? product.variants?.[0]
  const basePrice = variant?.price ?? product.price
  const structuredSale = typeof basePrice === 'object' ? priceAmount(basePrice.saleAmount ?? undefined) : undefined
  const explicitSale = priceAmount(variant?.salePrice ?? product.salePrice)
  const regular = priceAmount(product.originalPrice ?? basePrice) ?? 0
  const sale = explicitSale ?? structuredSale
  const markedOnSale = Boolean(product.isOnSale || variant?.isOnSale || (typeof basePrice === 'object' && basePrice.onSale))
  const hasReduction = markedOnSale && sale !== undefined && sale < regular

  return {
    current: hasReduction ? sale : regular,
    original: hasReduction ? regular : undefined,
    onSale: hasReduction,
  }
}
