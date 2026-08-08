import type { ApiResponse } from '~/types/catalog'
import type { AddressPayload, CustomerAddress, CustomerOrder, SavedItem } from '~/types/account'

export const useCustomerAccount = () => {
  const api = useApi()

  const listAddresses = () => api.request<ApiResponse<CustomerAddress[]>>('/addresses')
  const createAddress = (payload: AddressPayload) => api.request<ApiResponse<CustomerAddress>>('/addresses', {
    method: 'POST',
    body: payload,
  })
  const updateAddress = (id: string, payload: AddressPayload) => api.request<ApiResponse<CustomerAddress>>(`/addresses/${id}`, {
    method: 'PATCH',
    body: payload,
  })
  const deleteAddress = (id: string) => api.request<void>(`/addresses/${id}`, { method: 'DELETE' })
  const setDefaultAddress = (id: string) => api.request<ApiResponse<CustomerAddress>>(`/addresses/${id}/default`, {
    method: 'PATCH',
  })

  const listSavedItems = () => api.request<ApiResponse<SavedItem[]>>('/saved-items')
  const removeSavedItem = (productId: string) => api.request<void>(`/saved-items/${productId}`, {
    method: 'DELETE',
  })

  const listOrders = (page = 1, perPage = 10) => api.request<ApiResponse<CustomerOrder[]>>('/orders', {
    query: { page, per_page: perPage },
  })

  return {
    listAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    listSavedItems,
    removeSavedItem,
    listOrders,
  }
}
