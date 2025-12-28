import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Mail, Phone, MessageCircle, CheckCircle2, ChevronLeft, ChevronRight, Video, X, AlertCircle } from 'lucide-react'
import { getAvailableSlots, ConsultationSlot, bookConsultation } from '../services/consultationService'
import { useToast } from '../context/ToastContext'

interface BookingFormData {
  userName: string
  userEmail: string
  userPhone: string
  message: string
}

interface FormErrors {
  userName?: string
  userEmail?: string
  userPhone?: string
  message?: string
}

export default function ConsultationBooking() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [slots, setSlots] = useState<ConsultationSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    userName: '',
    userEmail: '',
    userPhone: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => {
    const today = new Date()
    today.setDate(today.getDate() + 1)
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = today.getDay()
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - dayOfWeek)
    return weekStart
  })
  const [viewMode, setViewMode] = useState<'week' | 'date'>('week')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load slots - week range for week view, wider range for date view
  useEffect(() => {
    if (viewMode === 'week') {
      loadSlotsForWeek()
    } else {
      loadSlotsForDateView()
    }
  }, [selectedWeekStart, viewMode])

  const loadSlotsForWeek = async () => {
    setLoading(true)
    try {
      const weekEnd = new Date(selectedWeekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      const startDateStr = selectedWeekStart.toISOString().split('T')[0]
      const endDateStr = weekEnd.toISOString().split('T')[0]
      
      const response = await getAvailableSlots({ startDate: startDateStr, endDate: endDateStr })
      const slotsData = response.data || []
      setSlots(slotsData)
    } catch (error: any) {
      showError(error.message || 'Unable to load available slots')
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  const loadSlotsForDateView = async () => {
    setLoading(true)
    try {
      // Load slots for next 60 days (or until we have enough slots)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 1)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 60)
      
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]
      
      const response = await getAvailableSlots({ startDate: startDateStr, endDate: endDateStr })
      const slotsData = response.data || []
      setSlots(slotsData)
    } catch (error: any) {
      showError(error.message || 'Unable to load available slots')
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleSlotSelect = (slot: ConsultationSlot) => {
    setSelectedSlot(slot)
    setShowBookingForm(true)
    // Reset form when selecting a new slot
    setBookingForm({
      userName: '',
      userEmail: '',
      userPhone: '',
      message: ''
    })
    setFormErrors({})
    setTouched({})
  }

  // Validation functions
  const validateField = (name: keyof BookingFormData, value: string): string | undefined => {
    switch (name) {
      case 'userName':
        const trimmedName = value.trim()
        if (!trimmedName) return 'Full name is required'
        if (trimmedName.length < 2) return 'Name must be at least 2 characters'
        if (trimmedName.length > 100) return 'Name must not exceed 100 characters'
        if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
        return undefined
      
      case 'userEmail':
        const trimmedEmail = value.trim()
        if (!trimmedEmail) return 'Email address is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmedEmail)) return 'Please enter a valid email address'
        return undefined
      
      case 'userPhone':
        const trimmedPhone = value.trim()
        if (!trimmedPhone) return 'Phone number is required'
        if (trimmedPhone.length < 5) return 'Phone number must be at least 5 characters'
        if (trimmedPhone.length > 20) return 'Phone number must not exceed 20 characters'
        // Allow digits, spaces, hyphens, parentheses, and + for international numbers
        if (!/^[\d\s\-\+\(\)]+$/.test(trimmedPhone)) return 'Please enter a valid phone number'
        return undefined
      
      case 'message':
        if (value.trim().length > 1000) return 'Message must not exceed 1000 characters'
        return undefined
      
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    errors.userName = validateField('userName', bookingForm.userName)
    errors.userEmail = validateField('userEmail', bookingForm.userEmail)
    errors.userPhone = validateField('userPhone', bookingForm.userPhone)
    errors.message = validateField('message', bookingForm.message)
    
    setFormErrors(errors)
    return !errors.userName && !errors.userEmail && !errors.userPhone && !errors.message
  }

  const handleFieldChange = (name: keyof BookingFormData, value: string) => {
    setBookingForm(prev => ({ ...prev, [name]: value }))
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      setFormErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleFieldBlur = (name: keyof BookingFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, bookingForm[name])
    setFormErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSlot) return

    // Mark all fields as touched
    setTouched({
      userName: true,
      userEmail: true,
      userPhone: true,
      message: true
    })

    // Validate form
    if (!validateForm()) {
      showError('Please correct the errors in the form')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await bookConsultation({
        slotId: selectedSlot._id,
        userName: bookingForm.userName.trim(),
        userEmail: bookingForm.userEmail.trim(),
        userPhone: bookingForm.userPhone.trim(),
        message: bookingForm.message.trim() || undefined
      })

      showSuccess('Consultation booked successfully!')
      navigate(`/consultation/confirmation/${response.data._id}`)
    } catch (error: any) {
      const errorMessage = error.message || 'Unable to book consultation. Please try again.'
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatTime24 = (timeString: string) => {
    return timeString
  }

  // Get week days
  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedWeekStart)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  // Get month days for calendar
  const getMonthDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonth.getDate() - i))
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    return days
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isDateInWeek = (date: Date) => {
    const weekEnd = new Date(selectedWeekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return date >= selectedWeekStart && date <= weekEnd
  }

  const handleDateClick = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return // Can't select past dates
    
    // Set selected date and switch to date view
    setSelectedDate(date)
    setViewMode('date')
    
    // Also update week view to include this date (for when switching back to week view)
    const weekStart = new Date(date)
    const dayOfWeek = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - dayOfWeek)
    weekStart.setHours(0, 0, 0, 0)
    setSelectedWeekStart(weekStart)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeekStart(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() + 7)
      }
      return newDate
    })
  }

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return slots.filter(slot => {
      // Normalize slot date for comparison (handle both ISO string and date-only string)
      let slotDateStr: string
      if (typeof slot.date === 'string') {
        slotDateStr = slot.date.split('T')[0]
      } else {
        slotDateStr = new Date(slot.date).toISOString().split('T')[0]
      }
      return slotDateStr === dateStr
    }).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // Group slots by date for date-wise view
  const groupSlotsByDate = () => {
    const grouped: Record<string, typeof slots> = {}
    slots.forEach(slot => {
      let dateStr: string
      if (typeof slot.date === 'string') {
        dateStr = slot.date.split('T')[0]
      } else {
        dateStr = new Date(slot.date).toISOString().split('T')[0]
      }
      if (!grouped[dateStr]) {
        grouped[dateStr] = []
      }
      grouped[dateStr].push(slot)
    })
    
    // Sort slots within each date by time
    Object.keys(grouped).forEach(dateStr => {
      grouped[dateStr].sort((a, b) => a.startTime.localeCompare(b.startTime))
    })
    
    // Return sorted dates (earliest first)
    return Object.keys(grouped)
      .sort()
      .map(dateStr => ({
        date: new Date(dateStr + 'T00:00:00'),
        slots: grouped[dateStr]
      }))
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const weekDays = getWeekDays()
  const monthDays = getMonthDays()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const timezoneOffset = new Date().getTimezoneOffset()
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60))
  const offsetMinutes = Math.abs(timezoneOffset % 60)
  const offsetSign = timezoneOffset <= 0 ? '+' : '-'
  const timezoneString = `(GMT${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}) ${timezone}`

  if (showBookingForm && selectedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Book Your Consultation</h2>
                  <div className="flex items-center gap-4 text-blue-100 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {selectedSlot.date && new Date(selectedSlot.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>Video Conference</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowBookingForm(false)
                    setSelectedSlot(null)
                  }}
                  className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="userName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="userName"
                  type="text"
                  value={bookingForm.userName}
                  onChange={(e) => handleFieldChange('userName', e.target.value)}
                  onBlur={() => handleFieldBlur('userName')}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.userName
                      ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:border-blue-500'
                  }`}
                  placeholder="John Doe"
                />
                {formErrors.userName && touched.userName && (
                  <div className="flex items-center gap-1 mt-1.5 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.userName}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="userEmail" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="userEmail"
                  type="email"
                  value={bookingForm.userEmail}
                  onChange={(e) => handleFieldChange('userEmail', e.target.value)}
                  onBlur={() => handleFieldBlur('userEmail')}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.userEmail
                      ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:border-blue-500'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {formErrors.userEmail && touched.userEmail && (
                  <div className="flex items-center gap-1 mt-1.5 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.userEmail}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="userPhone" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="userPhone"
                  type="tel"
                  value={bookingForm.userPhone}
                  onChange={(e) => handleFieldChange('userPhone', e.target.value)}
                  onBlur={() => handleFieldBlur('userPhone')}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.userPhone
                      ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:border-blue-500'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {formErrors.userPhone && touched.userPhone && (
                  <div className="flex items-center gap-1 mt-1.5 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.userPhone}</span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Additional Message <span className="text-gray-400 dark:text-slate-500 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  value={bookingForm.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  onBlur={() => handleFieldBlur('message')}
                  rows={4}
                  maxLength={1000}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors resize-none ${
                    formErrors.message
                      ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:border-blue-500'
                  }`}
                  placeholder="Tell us about your consultation needs, questions, or any specific topics you'd like to discuss..."
                />
                <div className="flex items-center justify-between mt-1.5">
                  {formErrors.message && touched.message ? (
                    <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formErrors.message}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {bookingForm.message.length}/1000 characters
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Booking Your Consultation...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-gray-500 dark:text-slate-400">
                  By booking, you agree to our terms and conditions. You will receive a confirmation email shortly.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              EX
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">EuProximaX Consultation Appointment</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>30 min appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-green-600" />
                  <span>Video conference info added after booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Select an appointment time</h2>
          <div className="text-sm text-gray-600 dark:text-slate-400">{timezoneString}</div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-b-4 border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-slate-400">Loading available slots...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Monthly Calendar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                  </button>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                  </button>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNamesShort.map((day, idx) => (
                    <div key={idx} className="text-center text-xs font-medium text-gray-500 dark:text-slate-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((date, idx) => {
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                    const isToday = isSameDay(date, today)
                    const isInWeek = isDateInWeek(date)
                    const isPast = date < today
                    const hasSlots = getSlotsForDate(date).length > 0
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => !isPast && handleDateClick(date)}
                        disabled={isPast}
                        className={`
                          aspect-square p-2 text-sm rounded-lg transition-colors
                          ${!isCurrentMonth ? 'text-gray-300 dark:text-slate-600' : 'text-gray-700 dark:text-slate-300'}
                          ${isPast ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20'}
                          ${isToday && isCurrentMonth ? 'bg-blue-100 dark:bg-blue-900/30 font-bold' : ''}
                          ${isInWeek && isCurrentMonth && !isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                          ${hasSlots && isCurrentMonth && !isPast ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Time Slots View */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        viewMode === 'week'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      Week View
                    </button>
                    <button
                      onClick={() => setViewMode('date')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        viewMode === 'date'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      Date View
                    </button>
                  </div>
                  {viewMode === 'date' && selectedDate && (
                    <button
                      onClick={() => {
                        setViewMode('week')
                        setSelectedDate(null)
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {viewMode === 'week' ? (
                  <>
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => navigateWeek('prev')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                      </button>
                      <div className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <button
                        onClick={() => navigateWeek('next')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                      </button>
                    </div>

                    {/* Week Days with Time Slots */}
                    <div className="grid grid-cols-7 gap-4">
                      {weekDays.map((date, dayIdx) => {
                        const dateSlots = getSlotsForDate(date)
                        const isToday = isSameDay(date, today)
                        const isPast = date < today
                        
                        return (
                          <div key={dayIdx} className="flex flex-col items-center">
                            {/* Day Header */}
                            <div className={`w-full text-center mb-2 pb-2 ${isToday ? 'border-b-2 border-blue-600' : 'border-b border-gray-200 dark:border-slate-700'}`}>
                              <div className={`text-xs font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}>
                                {dayNames[date.getDay()]}
                              </div>
                              <div className={`text-lg font-semibold mt-1 ${isToday ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-gray-900 dark:text-slate-100'}`}>
                                {date.getDate()}
                              </div>
                            </div>
                            
                            {/* Time Slots */}
                            <div className="w-full space-y-1 min-h-[200px]">
                              {isPast ? (
                                <div className="text-xs text-gray-400 dark:text-slate-500 text-center py-2">—</div>
                              ) : dateSlots.length === 0 ? (
                                <div className="text-xs text-gray-400 dark:text-slate-500 text-center py-2">—</div>
                              ) : (
                                dateSlots.map((slot) => (
                                  <button
                                    key={slot._id}
                                    onClick={() => handleSlotSelect(slot)}
                                    className="w-full px-3 py-2 text-sm border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                                  >
                                    {formatTime24(slot.startTime)}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Date-wise View */}
                    {selectedDate ? (
                      <div>
                        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </h3>
                        </div>
                        {(() => {
                          const dateSlots = getSlotsForDate(selectedDate)
                          return dateSlots.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                              <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                              <p>No available slots for this date.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {dateSlots.map((slot) => (
                                <button
                                  key={slot._id}
                                  onClick={() => handleSlotSelect(slot)}
                                  className="px-4 py-3 text-sm border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all font-medium"
                                >
                                  <div className="font-semibold">{formatTime(slot.startTime)}</div>
                                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">- {formatTime(slot.endTime)}</div>
                                </button>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Available Slots by Date</h3>
                        </div>
                        {(() => {
                          const groupedSlots = groupSlotsByDate()
                          return groupedSlots.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                              <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                              <p>No available slots found.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {groupedSlots.map(({ date, slots }) => (
                                <div key={date.toISOString()} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0">
                                  <div className="mb-3">
                                    <h4 className="text-md font-semibold text-gray-900 dark:text-slate-100">
                                      {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </h4>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {slots.map((slot) => (
                                      <button
                                        key={slot._id}
                                        onClick={() => handleSlotSelect(slot)}
                                        className="px-4 py-3 text-sm border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all font-medium"
                                      >
                                        <div className="font-semibold">{formatTime(slot.startTime)}</div>
                                        <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">- {formatTime(slot.endTime)}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-slate-400">
          Powered by <span className="text-blue-600 dark:text-blue-400">EuProximaX Consultation Booking System</span>
        </div>
      </div>
    </div>
  )
}
