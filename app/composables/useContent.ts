import type { ApiResponse } from '~/types/catalog'
import type { ContactSubmissionPayload, ContactSubmissionReceipt, PublicContentPage, PublicFaqCategory } from '~/types/content'

export const useContent = () => {
  const api = useApi()
  const config = useRuntimeConfig()
  const storefront = encodeURIComponent(String(config.public.storefrontSlug))
  const basePath = `/storefronts/${storefront}`

  const getPage = (slug: string) => api.get<PublicContentPage>(`${basePath}/pages/${encodeURIComponent(slug)}`)

  const getFaqs = (options: { category?: string; search?: string; page?: number; perPage?: number } = {}) => api.get<PublicFaqCategory[]>(`${basePath}/faqs`, {
    category: options.category || undefined,
    search: options.search || undefined,
    page: options.page ?? 1,
    per_page: options.perPage ?? 20,
  })

  const submitContact = (payload: ContactSubmissionPayload) => api.request<ApiResponse<ContactSubmissionReceipt>>(`${basePath}/contact-submissions`, {
    method: 'POST',
    body: { ...payload },
  })

  return { getPage, getFaqs, submitContact }
}
