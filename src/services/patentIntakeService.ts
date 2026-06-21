import { post } from '../utils/apiClient'

export interface PatentIntakePayload {
  clientName: string
  email: string
  phone: string
  whatsapp?: string
  track: 'A' | 'B'
  inventionTitle?: string
  inventionDomain?: string
  inventionSummary?: string
  jurisdiction?: string[]
  hearAboutUs?: string
}

export const submitPatentIntake = (payload: PatentIntakePayload) => {
  return post<{ caseNumber: string }>('/cases/intake', payload, { skipAuth: true })
}
