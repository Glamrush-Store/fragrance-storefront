import type { ApiErrorBody, AuthSession, AuthUser, ValidationErrors } from '~/types/auth'
import type { CartMergeResponse } from '~/types/checkout'

export const authErrorDetails = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  const response = error as { data?: ApiErrorBody; statusMessage?: string; message?: string }
  const errors: ValidationErrors = response?.data?.errors ?? {}
  const firstValidationMessage = Object.values(errors).flat()[0]

  return {
    message: firstValidationMessage || response?.data?.message || response?.statusMessage || fallback,
    errors,
  }
}

export const useAuth = () => {
  const api = useApi()
  const config = useRuntimeConfig()
  const toast = useToast()
  const guestCartToken = useCookie<string | null>('glamrush_cart_token')
  const legacyAuthToken = useCookie<string | null>('glamrush_auth_token')
  const user = useState<AuthUser | null>('auth.user', () => null)
  const initialized = useState('auth.initialized', () => false)
  const cartMergeError = useState<string | null>('auth.cart-merge-error', () => null)

  if (legacyAuthToken.value) legacyAuthToken.value = null

  const acceptSession = (session: AuthSession) => {
    user.value = session.user
    initialized.value = true
  }

  const clearSession = () => {
    user.value = null
    initialized.value = true
  }

  const mergeGuestCart = async (): Promise<boolean> => {
    if (!guestCartToken.value || !user.value) return true
    const storefront = encodeURIComponent(String(config.public.storefrontSlug))
    try {
      const response = await api.request<CartMergeResponse>(`/storefronts/${storefront}/cart/merge`, {
        method: 'POST', body: { cart_token: guestCartToken.value },
      })
      if (response.guest_cart_empty) guestCartToken.value = null
      cartMergeError.value = null
      useState<boolean>('cart.initialized').value = false
      return true
    }
    catch (error) {
      const details = authErrorDetails(error, 'Your saved bag could not be merged. Please try again.')
      cartMergeError.value = details.message
      if (import.meta.client) {
        toast.add({
          title: 'Your guest bag was preserved',
          description: details.message,
          color: 'warning',
        })
      }
      return false
    }
  }

  const register = async (payload: {
    name: string
    email: string
    phone?: string
    password: string
    password_confirmation: string
  }) => {
    const response = await api.post<AuthSession>('/auth/register', payload)
    acceptSession(response.data)
    await mergeGuestCart()
    return response
  }

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthSession>('/auth/login', { email, password })
    acceptSession(response.data)
    await mergeGuestCart()
    return response
  }

  const socialLogin = async (provider: 'google', providerToken: string) => {
    const response = await api.post<AuthSession>(`/auth/social/${provider}`, { token: providerToken })
    acceptSession(response.data)
    await mergeGuestCart()
    return response
  }

  const fetchMe = async () => {
    try {
      const response = await api.request<import('~/types/catalog').ApiResponse<AuthUser>>('/auth/me')
      user.value = response.data
      initialized.value = true
      await mergeGuestCart()
      return response.data
    }
    catch (error) {
      clearSession()
      throw error
    }
  }

  const ensureSession = async () => {
    if (initialized.value) return user.value

    try {
      return await fetchMe()
    }
    catch {
      return null
    }
  }

  const logout = async () => {
    try {
      if (user.value) {
        await api.request<void>('/auth/logout', { method: 'POST' })
      }
    }
    finally {
      clearSession()
    }
  }

  const forgotPassword = (email: string) => api.post<null>('/auth/password/forgot', { email })
  const verifyPasswordCode = (email: string, code: string) => api.post<null>('/auth/password/verify', { email, code })
  const resetPassword = (email: string, password: string, passwordConfirmation: string) => api.post<null>('/auth/password/reset', {
    email,
    password,
    password_confirmation: passwordConfirmation,
  })

  return {
    user,
    initialized,
    register,
    login,
    socialLogin,
    fetchMe,
    ensureSession,
    logout,
    forgotPassword,
    verifyPasswordCode,
    resetPassword,
    mergeGuestCart,
    cartMergeError,
    clearSession,
  }
}
