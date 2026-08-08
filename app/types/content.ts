import type { MediaImage } from '~/types/catalog'

export interface ContactSocialLink {
  label?: string
  name?: string
  platform?: string
  url: string
}

export interface PublicContactSettings {
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  business_hours?: string | null
  address?: string | null
  map_url?: string | null
  social_links?: ContactSocialLink[] | Record<string, string> | null
}

export interface PublicContentPage {
  id: string
  slug: string
  title: string
  navigation_title?: string | null
  excerpt?: string | null
  content: string
  page_type: 'about' | 'contact' | 'privacy_policy' | 'terms' | 'shipping_policy' | 'returns_policy' | 'custom'
  settings?: PublicContactSettings | null
  meta_title?: string | null
  meta_description?: string | null
  media?: Array<string | MediaImage> | string | MediaImage | null
  published_at?: string | null
  updated_at?: string | null
}

export interface PublicFaq {
  id: string
  question: string
  answer: string
}

export interface PublicFaqCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  faqs: PublicFaq[]
}

export interface ContactSubmissionPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  source: string
  website: string
}

export interface ContactSubmissionReceipt {
  reference: string
}
