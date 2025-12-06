import { get } from '../utils/apiClient'

export interface Partner {
  _id: string
  name: string
  slug: string
  location: string
  role: string
  email?: string | null
  phone?: string | null
  bio?: string | null
  expertise?: string[]
  image?: string | null
  status: 'Active' | 'Inactive'
  order?: number
  createdAt: string
  updatedAt: string
}

export const fetchPartners = () => {
  return get<Partner[]>('/partner', { skipAuth: true })
}

export const fetchPartnerBySlug = (slug: string) => {
  return get<Partner>(`/partner/${slug}`, { skipAuth: true })
}

