import { get, post, put } from '../utils/apiClient'

export interface ContactPayload {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    file?: File
}

export const submitContact = (payload: ContactPayload) => {
    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('email', payload.email)
    if (payload.phone) formData.append('phone', payload.phone)
    formData.append('subject', payload.subject)
    formData.append('message', payload.message)
    if (payload.file) {
        formData.append('file', payload.file)
    }

    return post<{ contactId: string; success: boolean; message: string }>('/contact', formData, {
        skipAuth: true,
        isFormData: true
    })
}

export interface ContactAssignee {
  _id: string
  name: string
  email: string
  designation?: string
}

export interface ScheduledCall {
  scheduledAt?: string | null
  callNotes?: string | null
  scheduledBy?: ContactAssignee | null
  scheduledAtTime?: string | null
  meetingLink?: string | null
}

export interface ContactProjectSummary {
  _id: string
  projectName: string
  status: string
  currentStage?: string
  createdAt?: string
  assignedApprover?: string | null
  assignedApproverName?: string | null
  assignedApproverEmail?: string | null
  assignedApproverAt?: string | null
  internalApprovalDate?: string | null
}

export interface ContactRecord {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  file?: string
  fileName?: string
  status: string
  createdAt: string
  assignedTo?: ContactAssignee | null
  assignedToName?: string | null
  assignedAt?: string | null
  scheduledCall?: ScheduledCall | null
  remarks?: string | null
  closedAt?: string | null
  closedBy?: ContactAssignee | null
  project?: ContactProjectSummary | null
}

export interface ContactListResponse {
  items: ContactRecord[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const fetchContacts = (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  const qs = query.toString()
  return get<ContactListResponse>(`/contact${qs ? `?${qs}` : ''}`)
}

export const getContactById = (contactId: string) => {
  return get<ContactRecord>(`/contact/${contactId}`)
}

export interface UpdateContactPayload {
  assignedTo?: string | null
  status?: 'New' | 'In-Progress' | 'Closed'
  scheduledCall?: {
    scheduledAt?: string | null
    callNotes?: string | null
    scheduledAtTime?: string | null
    meetingLink?: string | null
  } | null
  remarks?: string | null
}

export const updateContact = (contactId: string, payload: UpdateContactPayload) => {
  return put<ContactRecord>(`/contact/${contactId}`, payload)
}

