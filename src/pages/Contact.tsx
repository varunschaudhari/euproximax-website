import { useState, FormEvent, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, Phone, MessageCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { submitContact } from '../services/contactService'
import { useToast } from '../context/ToastContext'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Subject mapping: value -> display text
  const subjectMap: Record<string, string> = {
    'patent': 'Patent Services',
    'design': 'Industrial Design',
    'prototyping': 'Prototyping',
    'electronic': 'Electronic Design',
    'mechanical': 'Mechanical Design',
    'packaging': 'Packaging Design',
    'manufacturing': 'Manufacturing',
    'general': 'General Inquiry'
  }

  // Pre-fill form from URL parameters
  useEffect(() => {
    const subjectParam = searchParams.get('subject')
    if (subjectParam) {
      setFormData(prev => ({
        ...prev,
        subject: subjectParam,
        message: subjectParam === 'patent'
          ? 'I am interested in patent registration services. Please provide more information about the process, timeline, and pricing.'
          : prev.message
      }))
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Validate file if present
      if (selectedFile) {
        const maxSize = 10 * 1024 * 1024 // 10MB in bytes
        if (selectedFile.size > maxSize) {
          showError('File size exceeds 10MB limit. Please choose a smaller file.')
          setIsSubmitting(false)
          return
        }
      }

      // Transform subject value to display text before submitting
      const submitData = {
        ...formData,
        subject: subjectMap[formData.subject] || formData.subject,
        file: selectedFile || undefined
      }
      const response = await submitContact(submitData)
      showSuccess(response.message || 'Thank you! We have received your enquiry.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setSelectedFile(null)
    } catch (error: any) {
      // Check if there are validation errors and use the first error message
      let errorMessage = 'Unable to submit your enquiry right now.'
      
      if (error?.errors && error.errors.length > 0) {
        errorMessage = error.errors[0].msg || error.errors[0].message || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      // Handle network errors specifically
      if (error?.status === 0 || 
          error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('Network error') ||
          error?.message?.includes('load failed') ||
          error?.message?.includes('load error')) {
        errorMessage = selectedFile 
          ? 'File upload failed. Please check your connection and try again. If the file is large, it may take longer to upload.'
          : 'Network error. Please check your connection and try again.'
      }
      
      // Handle timeout errors
      if (error?.message?.includes('timeout') || error?.name === 'TimeoutError') {
        errorMessage = 'Upload timed out. Please try again with a smaller file or check your connection.'
      }
      
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: 'Keshav Nagar, Behind Philosophy Center, Keshav Nagar (Rural), Amalner, Jalgaon, 425401',
      link: null,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@euproximax.com',
      link: 'mailto:contact@euproximax.com',
      color: 'from-primary to-primary-700',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 9270536828',
      link: 'tel:+919270536828',
      color: 'from-green-500 to-green-600',
    },
    // {
    //   icon: Clock,
    //   title: 'Business Hours',
    //   content: 'Monday - Friday: 9:00 AM - 6:00 PM IST',
    //   link: null,
    //   color: 'from-purple-500 to-purple-600',
    // },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-primary/10 via-bg to-secondary/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Let's Build Something
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Extraordinary Together
              </span>
            </h1>
            {/* <p className="text-lg text-gray-600">
              Have a question? We're here to help you protect your ideas and bring them to life.
            </p> */}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 items-start">
            <div className="space-y-4">
              {/* Contact Info Cards */}
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const content = info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 hover:text-primary transition-colors break-words text-sm"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600 break-words text-sm">{info.content}</p>
                )

                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-surface rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${info.color} opacity-10 rounded-bl-2xl rounded-tr-xl transition-opacity group-hover:opacity-20`}></div>

                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${info.color} text-white mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={20} />
                    </div>

                    <h3 className="text-lg font-bold text-text mb-2">{info.title}</h3>
                    <div>
                      {content}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Contact Form Section */}
            <div className="max-w-3xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-primary to-primary-700 rounded-lg text-white">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text">Send Us a Message</h2>
                    <p className="text-gray-600 text-sm">We'll get back to you within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-sm font-semibold text-text">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-sm font-semibold text-text">
                        Email <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-sm font-semibold text-text">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="block text-sm font-semibold text-text">
                        Subject <span className="text-primary">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                      >
                        <option value="">Select a Subject</option>
                        <option value="patent">Patent Services</option>
                        <option value="design">Industrial Design</option>
                        <option value="prototyping">Prototyping</option>
                        <option value="electronic">Electronic Design</option>
                        <option value="mechanical">Mechanical Design</option>
                        <option value="packaging">Packaging Design</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-sm font-semibold text-text">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none bg-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="file" className="block text-sm font-semibold text-text">
                      Attach File (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (file) {
                            const maxSize = 10 * 1024 * 1024 // 10MB
                            if (file.size > maxSize) {
                              showError('File size exceeds 10MB limit. Please choose a smaller file.')
                              e.target.value = '' // Clear the input
                              setSelectedFile(null)
                              return
                            }
                            setSelectedFile(file)
                          } else {
                            setSelectedFile(null)
                          }
                        }}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.7z"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="px-3 py-2 text-sm text-rose-600 hover:text-rose-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {selectedFile && (
                      <p className="text-xs text-gray-500">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, Images, ZIP, RAR, 7Z (Max 10MB)
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    {!isSubmitting && <Send className="group-hover:translate-x-1 transition-transform" size={18} />}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
