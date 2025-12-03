import { get, post } from '../utils/apiClient'

export interface BlogAuthor {
  name: string
  title?: string
  avatar?: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  heroImageAlt?: string | null
  category: string
  tags?: string[]
  author: BlogAuthor
  readTimeMinutes: number
  status: 'Draft' | 'Published'
  isFeatured: boolean
  publishedAt?: string
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string[]
  submittedByName?: string | null
  submittedByEmail?: string | null
  submissionReference?: string | null
  submissionStatus?: 'Submitted' | 'In Review' | 'Approved' | 'Rejected'
  createdAt: string
  updatedAt: string
}

export interface BlogListResponse {
  items: BlogPost[]
  page: number
  limit: number
  total: number
  totalPages: number
  categories: string[]
}

interface FetchBlogsParams {
  search?: string
  category?: string
  page?: number
  tag?: string
  featured?: boolean
}

export const fetchBlogs = (params: FetchBlogsParams = {}) => {
  const query = new URLSearchParams()

  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.page) query.set('page', String(params.page))
  if (params.tag) query.set('tag', params.tag)
  if (params.featured) query.set('featured', String(params.featured))

  const qs = query.toString()
  return get<BlogListResponse>(`/blog${qs ? `?${qs}` : ''}`, { skipAuth: true })
}

export const fetchBlogBySlug = (slugOrId: string) => {
  return get<BlogPost>(`/blog/${slugOrId}`, { skipAuth: true })
}

export interface BlogSubmissionPayload {
  name: string
  email: string
  title: string
  summary: string
  reference?: string
  category?: string
}

export const submitBlogProposal = (payload: BlogSubmissionPayload) => {
  return post<{ submissionId: string; slug: string }>('/blog/submissions', payload, { skipAuth: true })
}


