import type { CustomerOrder } from '~/types/account'

export interface CartItem {
  id: string
  product_id: string
  product_variant_id: string | null
  sku: string | null
  attributes: Array<{ type?: string; value?: string }> | Record<string, string> | null
  name: string
  slug: string
  thumb: string | null
  quantity: number
  unit_price: number | string
  expires_at: string
}

export interface CartResponse {
  success: boolean
  message: string
  data: CartItem[]
  subtotal: number
  cart_token: string | null
}

export interface CartMutationResponse {
  success: boolean
  message: string
  data: CartItem
  cart_token: string | null
}

export interface CartMergeResponse extends Omit<CartResponse, 'subtotal'> {
  guest_cart_empty: boolean
}

export interface CheckoutAddress {
  full_name: string
  email: string
  phone: string
  country: string
  state: string
  city: string
  postal_code: string
  line1: string
  line2: string
}

export interface ShippingOption {
  rate_id: string
  method: string
  method_code: string
  description: string | null
  zone: string
  amount: number | string
  currency: string
  estimated_days_min: number | null
  estimated_days_max: number | null
}

export interface PaymentMethod {
  id: string
  name: string
  code: 'paystack' | 'flutterwave' | 'pay_on_delivery'
  description: string | null
  public_config: Record<string, unknown> | null
}

export interface PaymentInitialization {
  payment: {
    id: string
    order_id: string
    provider: string
    reference: string
    transaction_id: string | null
    amount: number | string
    currency: string
    status: string
  }
  authorization_url: string | null
  access_code: string | null
  reference: string
  provider: string
  status: string
  next_actions?: {
    retry_payment?: boolean
    restore_cart?: boolean
    retry_endpoint?: string
  }
}

export interface RestoredOrderCartItem {
  product_id: string
  product_variant_id: string | null
  name: string
  quantity: number
  unit_price: number | string
  old_unit_price?: number | string | null
  new_unit_price?: number | string | null
}

export interface SkippedOrderCartItem {
  product_id: string | null
  product_variant_id: string | null
  name: string
  reason: string
  message: string
  requested_quantity?: number
  available_quantity?: number | null
}

export interface OrderCartPriceChange {
  product_id: string
  product_variant_id: string | null
  name: string
  old_unit_price: number | string
  new_unit_price: number | string
}

export interface OrderRestoreCartResult {
  order: { id: string; order_number: string; status: string }
  cart_token: string | null
  restored_count: number
  skipped_count: number
  restored_items: RestoredOrderCartItem[]
  skipped_items: SkippedOrderCartItem[]
  price_changes: OrderCartPriceChange[]
  next_action: 'checkout' | 'browse_catalog'
}

export interface DiscountQuote {
  code: string
  name: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping'
  currency: string
  subtotal: number | string
  eligible_subtotal: number | string
  discount_amount: number | string
  shipping_amount: number | string
  shipping_discount_amount: number | string
  total: number | string
}

export interface CheckoutPayload {
  shipping_rate_id: string
  payment_method: PaymentMethod['code']
  shipping_address: CheckoutAddress
  billing_address: CheckoutAddress | { same_as_shipping: true }
  discount_code?: string
}

export type CheckoutOrder = CustomerOrder
