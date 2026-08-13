import type { MediaImage } from '~/types/catalog'

export interface CustomerAddress {
  id: string
  label: string | null
  first_name: string
  last_name: string
  phone: string | null
  address_line_1: string
  address_line_2: string | null
  country: string
  state: string
  city: string
  postal_code: string
  is_default: boolean
}

export type AddressPayload = Omit<CustomerAddress, 'id'>

export interface SavedItem {
  id: string | number
  product_id: string
  name: string
  slug: string
  thumb: string | null
}

export interface OrderItem {
  id: string
  product_id: string
  product_variant_id: string | null
  product_name: string
  product_slug: string
  sku: string | null
  unit_price: number | string
  quantity: number
  line_subtotal: number | string
  discount_amount: number | string
  line_total: number | string
  images: Array<string | MediaImage>
}

export interface CustomerOrder {
  id: string
  order_number: string
  status: string
  payment_method?: 'paystack' | 'flutterwave' | 'pay_on_delivery' | null
  discount_code: string | null
  subtotal: number | string
  discount_amount: number | string
  shipping_amount: number | string
  shipping_discount_amount: number | string
  total: number | string
  currency: string
  shipping_method_name: string | null
  shipping_zone_name: string | null
  shipping_address: Record<string, string | null>
  placed_at: string | null
  paid_at: string | null
  items: OrderItem[]
}
