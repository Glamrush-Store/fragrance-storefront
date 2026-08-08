import type { CartItem, CartMutationResponse, CartResponse } from '~/types/checkout'

const QUANTITY_DEBOUNCE_MS = 500

interface QueuedQuantityUpdate {
  timer: ReturnType<typeof setTimeout>
  targetQuantity: number
  originalQuantity: number
  onError?: (error: unknown) => void
}

const queuedQuantityUpdates = new Map<string, QueuedQuantityUpdate>()

export const useCart = () => {
  const api = useApi()
  const config = useRuntimeConfig()
  const { user, initialized: authInitialized, ensureSession } = useAuth()
  const cartToken = useCookie<string | null>('glamrush_cart_token', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, default: () => null })
  const items = useState<CartItem[]>('cart.items', () => [])
  const subtotal = useState<number>('cart.subtotal', () => 0)
  const initialized = useState<boolean>('cart.initialized', () => false)
  const loading = useState<boolean>('cart.loading', () => false)
  const quantityQueuedIds = useState<Record<string, boolean>>('cart.quantity-queued', () => ({}))
  const quantitySavingIds = useState<Record<string, boolean>>('cart.quantity-saving', () => ({}))
  const storefront = encodeURIComponent(String(config.public.storefrontSlug))
  const cartPath = `/storefronts/${storefront}/cart`

  const headers = (): Record<string, string> => cartToken.value ? { 'X-Cart-Token': cartToken.value } : {}
  const count = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const recalculateSubtotal = () => {
    subtotal.value = items.value.reduce((total, item) => total + (Number(item.unit_price) * item.quantity), 0)
  }
  const setQuantityState = (state: Ref<Record<string, boolean>>, itemId: string, active: boolean) => {
    const next = { ...state.value }
    if (active) next[itemId] = true
    else delete next[itemId]
    state.value = next
  }
  const applyQueuedQuantities = () => {
    for (const [itemId, update] of queuedQuantityUpdates) {
      const item = items.value.find(candidate => candidate.id === itemId)
      if (item) item.quantity = update.targetQuantity
    }
    recalculateSubtotal()
  }

  const fetchCart = async () => {
    if (!authInitialized.value) await ensureSession()

    if (!user.value && !cartToken.value) {
      items.value = []
      subtotal.value = 0
      initialized.value = true
      return items.value
    }

    loading.value = true
    try {
      const response = await api.request<CartResponse>(cartPath, { headers: headers() })
      items.value = response.data
      subtotal.value = Number(response.subtotal) || 0
      applyQueuedQuantities()
      if (response.cart_token) cartToken.value = response.cart_token
      initialized.value = true
      return response.data
    }
    finally { loading.value = false }
  }

  const ensureCart = () => initialized.value ? Promise.resolve(items.value) : fetchCart()

  const addItem = async (productId: string | number, quantity = 1, productVariantId?: string | number | null) => {
    const response = await api.request<CartMutationResponse>(cartPath, {
      method: 'POST', headers: headers(),
      body: { product_id: String(productId), quantity, ...(productVariantId ? { product_variant_id: String(productVariantId) } : {}) },
    })
    if (response.cart_token) cartToken.value = response.cart_token
    await fetchCart()
    return response.data
  }

  const updateItem = async (itemId: string, quantity: number) => {
    await api.request(`${cartPath}/items/${encodeURIComponent(itemId)}`, {
      method: 'PATCH', headers: headers(), body: { quantity },
    })
    await fetchCart()
  }

  const cancelQueuedQuantityUpdate = (itemId: string, restore = false) => {
    const queued = queuedQuantityUpdates.get(itemId)
    if (!queued) return

    clearTimeout(queued.timer)
    queuedQuantityUpdates.delete(itemId)
    setQuantityState(quantityQueuedIds, itemId, false)

    if (restore) {
      const item = items.value.find(candidate => candidate.id === itemId)
      if (item) item.quantity = queued.originalQuantity
      recalculateSubtotal()
    }
  }

  const queueItemQuantity = (itemId: string, quantity: number, onError?: (error: unknown) => void) => {
    if (quantity < 1 || quantitySavingIds.value[itemId]) return

    const item = items.value.find(candidate => candidate.id === itemId)
    if (!item) return

    const existing = queuedQuantityUpdates.get(itemId)
    if (existing) clearTimeout(existing.timer)

    const update: QueuedQuantityUpdate = {
      targetQuantity: quantity,
      originalQuantity: existing?.originalQuantity ?? item.quantity,
      onError,
      timer: setTimeout(async () => {
        setQuantityState(quantityQueuedIds, itemId, false)
        setQuantityState(quantitySavingIds, itemId, true)
        try {
          await updateItem(itemId, update.targetQuantity)
        }
        catch (error) {
          if (queuedQuantityUpdates.get(itemId) === update) queuedQuantityUpdates.delete(itemId)
          try { await fetchCart() }
          catch {
            const current = items.value.find(candidate => candidate.id === itemId)
            if (current) current.quantity = update.originalQuantity
            recalculateSubtotal()
          }
          update.onError?.(error)
        }
        finally {
          if (queuedQuantityUpdates.get(itemId) === update) queuedQuantityUpdates.delete(itemId)
          setQuantityState(quantitySavingIds, itemId, false)
        }
      }, QUANTITY_DEBOUNCE_MS),
    }

    queuedQuantityUpdates.set(itemId, update)
    item.quantity = quantity
    recalculateSubtotal()
    setQuantityState(quantityQueuedIds, itemId, true)
  }

  const removeItem = async (itemId: string) => {
    cancelQueuedQuantityUpdate(itemId, true)
    await api.request(`${cartPath}/items/${encodeURIComponent(itemId)}`, { method: 'DELETE', headers: headers() })
    await fetchCart()
  }

  const clearCart = async () => {
    for (const item of items.value) cancelQueuedQuantityUpdate(item.id)
    if (user.value || cartToken.value) {
      await api.request(cartPath, { method: 'DELETE', headers: headers() })
    }
    items.value = []
    subtotal.value = 0
    cartToken.value = null
    initialized.value = true
  }

  return {
    cartToken,
    items,
    subtotal,
    count,
    loading,
    initialized,
    quantityQueuedIds,
    quantitySavingIds,
    fetchCart,
    ensureCart,
    addItem,
    updateItem,
    queueItemQuantity,
    cancelQueuedQuantityUpdate,
    removeItem,
    clearCart,
  }
}
