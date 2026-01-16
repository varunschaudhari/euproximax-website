import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, CheckCircle, Image as ImageIcon, ArrowRight, ExternalLink, Search, Filter, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { fetchPublicEvents, EventRecord } from '../services/eventService'
import { getApiHost } from '../utils/apiClient'
import { ApiError } from '../utils/apiClient'
import { handleImageError } from '../utils/imageErrorHandler'

/**
 * Process image URL to ensure it's valid and accessible
 * Handles both absolute and relative URLs, and fixes localhost issues
 */
const processImageUrl = (url: string | undefined | null): string => {
  if (!url) return '/JPEG_Dark_BG.jpg'
  
  const apiBase = getApiHost()
  let imageUrl = url
  
  // If URL is already absolute (starts with http/https)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const parsed = new URL(imageUrl)
      
      // Extract just the pathname from the URL
      // Always use the API base to ensure CORS and correct origin
      if (parsed.pathname.startsWith('/uploads/')) {
        imageUrl = `${apiBase}${parsed.pathname}`
      }
      // If it's a full URL but not an upload path, keep it as-is
    } catch (error) {
      // If URL parsing fails, try to extract path manually
      if (imageUrl.includes('/uploads/')) {
        const pathMatch = imageUrl.match(/\/uploads\/.+$/)
        if (pathMatch) {
          imageUrl = `${apiBase}${pathMatch[0]}`
        }
      }
    }
  } else {
    // Relative URL - prepend API base
    // Ensure it starts with / if not already
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
    imageUrl = `${apiBase}${path}`
  }
  
  return imageUrl
}

export default function EventGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [events, setEvents] = useState<EventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(['all'])

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch all published events (not just upcoming) to show gallery images from all events
        const response = await fetchPublicEvents({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          // Don't filter by status - get all published events
        })
        const data = response.data || []
        setEvents(data)
        const uniqueCategories = Array.from(new Set(data.map((e) => e.category).filter(Boolean)))
        setCategories(['all', ...uniqueCategories])
      } catch (err) {
        const apiErr = err as ApiError
        setError(apiErr.message || 'Unable to load events')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [selectedCategory])

  const galleryImages = useMemo(() => {
    const images: Array<{ src: string; alt: string; title: string; category: string }> = []
    
    events.forEach((event) => {
      // Include images from Published and Completed events
      if ((event.status === 'Published' || event.status === 'Completed') && event.images && event.images.length > 0) {
        event.images.forEach((img) => {
          if (img.url) {
            images.push({
              src: processImageUrl(img.url),
              alt: img.alt || event.title,
              title: event.title,
              category: event.category,
            })
          }
        })
      }
    })
    return images
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Only show upcoming events (Published status and future startDate, exclude Completed)
      const isUpcoming = event.status === 'Published' && new Date(event.startDate) >= new Date()
      if (!isUpcoming) return false
      
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [events, searchQuery, selectedCategory])

  const filteredPastEvents = useMemo(() => {
    return events.filter((event) => {
      // Show past events: Completed status OR Published events with endDate < now
      const isPast = event.status === 'Completed' || 
                     (event.status === 'Published' && new Date(event.endDate) < new Date())
      if (!isPast) return false
      
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [events, searchQuery, selectedCategory])

  const filteredImages = useMemo(() => {
    return galleryImages.filter((image) => {
      const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [galleryImages, searchQuery, selectedCategory])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-bg to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <ImageIcon className="text-primary mr-2" size={24} />
              <span className="text-primary font-semibold text-sm">Event Gallery</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
              Capturing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Moments of Innovation
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore our past events and see the impact we've made in the innovation community
            </p>
          </motion.div>

          {/* Hero Image */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/JPEG_Dark_BG.jpg"
                alt="Event Gallery"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
          </motion.div> */}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-surface border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events and photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="text-gray-600 mr-2" size={20} />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-text mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} available
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Error loading events</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {filteredEvents.map((event) => {
                const startDate = new Date(event.startDate)
                const endDate = new Date(event.endDate)
                const isSameDay = startDate.toDateString() === endDate.toDateString()
                const dateStr = isSameDay
                  ? startDate.toLocaleDateString('en-IN', { dateStyle: 'long' })
                  : `${startDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })} - ${endDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })}`

                return (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-900">
                      <motion.img
                        src={processImageUrl(event.heroImage)}
                        alt={event.heroImageAlt || event.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>

                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold">
                          {event.status === 'Published' ? 'Upcoming' : event.status}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <div className="p-2 bg-primary/10 rounded-lg mr-3">
                            <Calendar className="text-primary" size={16} />
                          </div>
                          <span className="text-sm font-medium">{dateStr}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="p-2 bg-secondary/10 rounded-lg mr-3">
                            <MapPin className="text-secondary" size={16} />
                          </div>
                          <span className="text-sm font-medium">{event.venue}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">{event.description}</p>

                      {event.outcomes && event.outcomes.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-text mb-2 text-sm">What You'll Get:</h4>
                          <ul className="space-y-1.5">
                            {event.outcomes.slice(0, 3).map((outcome, idx) => (
                              <li key={idx} className="flex items-center text-gray-600 text-sm">
                                <CheckCircle className="mr-2 text-primary flex-shrink-0" size={14} />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {event.registrationLink ? (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all group/btn"
                          >
                            <span>Register Now</span>
                            <ExternalLink className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                          </a>
                        ) : (
                          <Link
                            to="/contact"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all group/btn"
                          >
                            <span>Contact Us</span>
                            <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                          </Link>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 via-bg to-primary/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-text mb-4">Past Events</h2>
            <p className="text-lg text-gray-600">
              {filteredPastEvents.length} {filteredPastEvents.length === 1 ? 'Event' : 'Events'} completed
            </p>
          </motion.div>

          {filteredPastEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No past events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {filteredPastEvents.map((event) => {
                const startDate = new Date(event.startDate)
                const endDate = new Date(event.endDate)
                const isSameDay = startDate.toDateString() === endDate.toDateString()
                const dateStr = isSameDay
                  ? startDate.toLocaleDateString('en-IN', { dateStyle: 'long' })
                  : `${startDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })} - ${endDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })}`

                return (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-secondary/20"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-900">
                      <motion.img
                        src={processImageUrl(event.heroImage)}
                        alt={event.heroImageAlt || event.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>

                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold">
                          {event.status === 'Completed' ? 'Completed' : 'Past'}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-secondary transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <div className="p-2 bg-secondary/10 rounded-lg mr-3">
                            <Calendar className="text-secondary" size={16} />
                          </div>
                          <span className="text-sm font-medium">{dateStr}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <div className="p-2 bg-primary/10 rounded-lg mr-3">
                            <MapPin className="text-primary" size={16} />
                          </div>
                          <span className="text-sm font-medium">{event.venue}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">{event.description}</p>

                      {event.outcomes && event.outcomes.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-text mb-2 text-sm">What Was Covered:</h4>
                          <ul className="space-y-1.5">
                            {event.outcomes.slice(0, 3).map((outcome, idx) => (
                              <li key={idx} className="flex items-center text-gray-600 text-sm">
                                <CheckCircle className="mr-2 text-secondary flex-shrink-0" size={14} />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={`/event/${event.slug}`}
                          className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-secondary to-secondary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all group/btn"
                        >
                          <span>View Details</span>
                          <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-bg to-secondary/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-text mb-4">Event Gallery</h2>
            <p className="text-lg text-gray-600">
              {filteredImages.length} {filteredImages.length === 1 ? 'Photo' : 'Photos'} available
            </p>
          </motion.div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No photos found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={`${image.title}-${index}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
                  onClick={() => setSelectedImage(image.src)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-white font-semibold mb-1">{image.title}</h4>
                      <div className="flex items-center text-white/80 text-sm">
                        <ExternalLink size={14} className="mr-1" />
                        Click to view
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Gallery"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onError={handleImageError}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-r from-primary via-primary-700 to-secondary rounded-3xl p-12 text-center text-white shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to See More?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our next event and be part of the innovation community
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                >
                  Contact Us
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
