import { get, post } from '../utils/apiClient'

export interface ConsultationSlot {
  _id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  isAvailable: boolean
  status: 'available' | 'booked' | 'cancelled' | 'completed'
  maxBookings: number
  notes?: string
  createdAt: string
  updatedAt: string
  bookingCount?: number
  availableSpots?: number
}

export interface ConsultationBooking {
  _id: string
  slotId: ConsultationSlot | string
  userName: string
  userEmail: string
  userPhone: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  meetingLink?: string
  cancelledAt?: string
  cancelledBy?: 'user' | 'admin'
  confirmedAt?: string
  confirmedBy?: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface BookConsultationPayload {
  slotId: string
  userName: string
  userEmail: string
  userPhone: string
  message?: string
}

export interface CancelBookingPayload {
  userEmail: string
}

/**
 * Get available consultation slots
 * @param date Optional specific date (ISO string)
 * @param startDate Optional start date for range (ISO string)
 * @param endDate Optional end date for range (ISO string)
 */
export const getAvailableSlots = (params?: { date?: string; startDate?: string; endDate?: string }) => {
  const query = new URLSearchParams()
  if (params?.date) query.set('date', params.date)
  if (params?.startDate) query.set('startDate', params.startDate)
  if (params?.endDate) query.set('endDate', params.endDate)
  const qs = query.toString()
  return get<ConsultationSlot[]>(`/consultation/slots${qs ? `?${qs}` : ''}`, { skipAuth: true })
}

/**
 * Book a consultation slot
 */
export const bookConsultation = (payload: BookConsultationPayload) => {
  return post<ConsultationBooking>('/consultation/book', payload, { skipAuth: true })
}

/**
 * Get booking details by ID
 */
export const getBookingDetails = (bookingId: string) => {
  return get<ConsultationBooking>(`/consultation/bookings/${bookingId}`, { skipAuth: true })
}

/**
 * Cancel a booking
 */
export const cancelBooking = (bookingId: string, payload: CancelBookingPayload) => {
  return post<ConsultationBooking>(`/consultation/bookings/${bookingId}/cancel`, payload, { skipAuth: true })
}

