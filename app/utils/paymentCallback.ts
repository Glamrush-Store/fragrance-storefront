import type { PaymentProvider } from '~/types/checkout'

interface PendingPaymentHint {
  provider?: string
  reference?: string
}

interface PaymentCallback {
  provider: PaymentProvider | null
  transactionId: string
}

const queryString = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return ''
}

const supportedProvider = (value: string | undefined): PaymentProvider | null => {
  const normalized = value?.toLowerCase()
  return normalized === 'bachs' || normalized === 'paystack' || normalized === 'flutterwave' ? normalized : null
}

const embeddedBachsCheckoutId = (provider: string): string => {
  const match = provider.match(/[?&]checkout_id=([^&]+)/i)
  if (!match?.[1]) return ''

  try {
    return decodeURIComponent(match[1])
  }
  catch {
    return match[1]
  }
}

export const resolvePaymentCallback = (
  query: Record<string, unknown>,
  pending: PendingPaymentHint = {},
): PaymentCallback => {
  const rawProvider = queryString(query.provider)
  const checkoutId = queryString(query.checkout_id) || embeddedBachsCheckoutId(rawProvider)
  const provider = checkoutId
    ? 'bachs'
    : supportedProvider(rawProvider)
      || supportedProvider(pending.provider)
      || (queryString(query.transaction_id) ? 'flutterwave' : null)
      || (queryString(query.reference) ? 'paystack' : null)

  if (provider === 'bachs') {
    return { provider, transactionId: checkoutId }
  }

  return {
    provider,
    transactionId: queryString(query.transaction_id)
      || queryString(query.reference)
      || pending.reference
      || '',
  }
}
