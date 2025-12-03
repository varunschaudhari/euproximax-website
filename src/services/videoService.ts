import { get } from '../utils/apiClient'

export interface VideoRecord {
  _id: string
  title: string
  description: string
  category?: string
  tags?: string[]
  durationSeconds?: number
  videoUrl: string
  thumbnailUrl?: string
  heroImageAlt?: string
  status: 'Draft' | 'Published'
  isFeatured: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export const fetchPublicVideos = (params: { category?: string; featured?: boolean; limit?: number } = {}) => {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.featured) query.set('featured', String(params.featured))
  if (params.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return get<VideoRecord[]>(`/video${qs ? `?${qs}` : ''}`, { skipAuth: true })
}


