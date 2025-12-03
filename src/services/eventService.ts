import { get } from '../utils/apiClient'

export interface EventImage {
  _id?: string
  url: string
  alt?: string
  caption?: string
  order?: number
}

export interface EventRecord {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  venue: string
  startDate: string
  endDate: string
  registrationLink?: string
  maxAttendees?: number
  outcomes?: string[]
  images?: EventImage[]
  heroImage?: string
  heroImageAlt?: string
  status: 'Draft' | 'Published' | 'Cancelled' | 'Completed'
  isFeatured: boolean
  publishedAt?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  createdAt: string
  updatedAt: string
}

export const fetchPublicEvents = (params: {
  category?: string
  featured?: boolean
  status?: 'upcoming' | 'past'
  limit?: number
} = {}) => {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.featured) query.set('featured', String(params.featured))
  if (params.status) query.set('status', params.status)
  if (params.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return get<EventRecord[]>(`/event${qs ? `?${qs}` : ''}`, { skipAuth: true })
}

