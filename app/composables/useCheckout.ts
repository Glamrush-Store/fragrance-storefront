import type { ApiResponse } from '~/types/catalog'
import type { CheckoutOrder, CheckoutPayload, DiscountQuote, PaymentInitialization, PaymentMethod, ShippingOption } from '~/types/checkout'

export const useCheckout = () => {
  const api = useApi()
  const config = useRuntimeConfig()
  const { cartToken } = useCart()
  const storefront = encodeURIComponent(String(config.public.storefrontSlug))
  const cartHeaders = (): Record<string, string> => cartToken.value ? { 'X-Cart-Token': cartToken.value } : {}

  const getShippingOptions = (address: { country: string; state: string; city: string; postal_code?: string; cart_subtotal?: number }) => api.request<{ data: ShippingOption[] }>('/shipping/getoptions', {
    method: 'POST', body: address,
  })
  const getPaymentMethods = () => api.request<ApiResponse<PaymentMethod[]>>('/payment-methods')
  const validateDiscount = (code: string, email: string, shippingAmount: number) => api.request<ApiResponse<DiscountQuote>>(`/storefronts/${storefront}/discounts/validate`, {
    method: 'POST', body: { code, email: email || undefined, shipping_amount: shippingAmount }, headers: cartHeaders(),
  })
  const createOrder = (payload: CheckoutPayload, idempotencyKey: string) => api.request<ApiResponse<CheckoutOrder>>(`/storefronts/${storefront}/checkout/cart`, {
    method: 'POST', body: { ...payload }, headers: { ...cartHeaders(), 'Idempotency-Key': idempotencyKey },
  })
  const initializePayment = (orderId: string, paymentMethod: PaymentMethod['code'], idempotencyKey: string) => api.request<ApiResponse<PaymentInitialization>>('/payments/initialize', {
    method: 'POST', body: { order_id: orderId, payment_method: paymentMethod }, headers: { ...cartHeaders(), 'Idempotency-Key': idempotencyKey },
  })
  const verifyPayment = (provider: 'paystack' | 'flutterwave', transactionId: string) => api.request<ApiResponse<PaymentInitialization>>('/payments/verify', {
    method: 'POST', body: { provider, transaction_id: transactionId },
  })

  return { getShippingOptions, getPaymentMethods, validateDiscount, createOrder, initializePayment, verifyPayment }
}
