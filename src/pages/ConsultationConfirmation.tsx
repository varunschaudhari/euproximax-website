import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, MessageCircle, ArrowLeft, XCircle } from 'lucide-react'
import { getBookingDetails, cancelBooking, ConsultationBooking } from '../services/consultationService'
import { useToast } from '../context/ToastContext'

export default function ConsultationConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [booking, setBooking] = useState<ConsultationBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  useEffect(() => {
    if (bookingId) {
      loadBooking()
    }
  }, [bookingId])

  const loadBooking = async () => {
    if (!bookingId) return
    setLoading(true)
    try {
      const response = await getBookingDetails(bookingId)
      setBooking(response.data)
    } catch (error: any) {
      showError(error.message || 'Unable to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!bookingId || !booking) return

    // Get email from user
    const email = prompt('Please enter your email address to confirm cancellation:')
    if (!email || email.trim() !== booking.userEmail) {
      showError('Email does not match. Cancellation cancelled.')
      return
    }

    setCancelling(true)
    try {
      await cancelBooking(bookingId, { userEmail: email })
      showSuccess('Booking cancelled successfully')
      navigate('/consultation')
    } catch (error: any) {
      showError(error.message || 'Unable to cancel booking')
    } finally {
      setCancelling(false)
      setShowCancelConfirm(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const slot = booking?.slotId && typeof booking.slotId === 'object' ? booking.slotId : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-b-4 border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking || !slot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Booking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Your consultation has been successfully booked
            </p>
          </motion.div>

          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <h2 className="text-2xl font-bold text-white">Booking Details</h2>
              <p className="text-blue-100 text-sm mt-1">Booking ID: {booking._id}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Slot Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 border border-blue-200 dark:border-blue-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Consultation Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-slate-100">{formatDate(slot.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Time</p>
                      <p className="font-semibold text-gray-900 dark:text-slate-100">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)} ({slot.duration} minutes)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Your Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Name</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.userPhone}</p>
                    </div>
                  </div>
                  {booking.message && (
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-500 dark:text-slate-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Message</p>
                        <p className="font-medium text-gray-900 dark:text-slate-100 whitespace-pre-wrap">{booking.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {booking.status === 'confirmed' && <CheckCircle2 className="w-4 h-4" />}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/consultation"
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold rounded-xl transition-colors text-center flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Book Another Consultation
            </Link>
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
          </motion.div>

          {/* Cancel Confirmation Modal */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCancelConfirm(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Cancel Booking?</h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  Are you sure you want to cancel this consultation booking? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-medium rounded-lg transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

