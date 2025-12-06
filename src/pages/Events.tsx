import { motion } from 'framer-motion'
import { Calendar, MapPin, CheckCircle, ArrowRight, Users, Award, TrendingUp, Sparkles, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { handleImageError } from '../utils/imageErrorHandler'

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const eventTypes = ['all', 'Summit', 'Workshop', 'Conference', 'Webinar']

  const upcomingEvents = [
    {
      title: 'Innovation Summit 2024',
      date: 'March 15, 2024',
      location: 'Virtual',
      description: 'Join us for a comprehensive summit on innovation and IP protection. Learn from industry experts and connect with fellow innovators from around the world.',
      outcomes: ['Networking opportunities', 'Expert insights', 'Case studies', 'Q&A sessions'],
      badge: 'Upcoming',
      image: '/JPEG_Dark_BG.jpg',
      type: 'Summit',
      time: '9:00 AM - 6:00 PM',
    },
    {
      title: 'Patent Workshop',
      date: 'April 20, 2024',
      location: 'Mumbai, India',
      description: 'Hands-on workshop on patent filing and protection strategies. Get practical training from experienced IP professionals and learn the complete process.',
      outcomes: ['Practical training', 'Q&A sessions', 'Resource materials', 'Expert guidance'],
      badge: 'Upcoming',
      image: '/JPEG_Dark_BG.jpg',
      type: 'Workshop',
      time: '10:00 AM - 4:00 PM',
    },
  ]

  const pastOutcomes = [
    { icon: Users, text: '500+ participants in last year\'s events', value: '500+' },
    { icon: Award, text: '95% satisfaction rate', value: '95%' },
    { icon: TrendingUp, text: '50+ successful IP filings from event attendees', value: '50+' },
    { icon: CheckCircle, text: 'Networking connections established', value: '100%' },
  ]

  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || event.type === selectedType
    return matchesSearch && matchesType
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
              <Sparkles className="text-primary mr-2" size={24} />
              <span className="text-primary font-semibold text-sm">Join Our Events</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
              Learn, Connect, and
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Innovate Together
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Join our events to learn about innovation, IP protection, and connect with experts in the field
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/JPEG_Dark_BG.jpg"
                alt="Events"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
          </motion.div>
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
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Event Type Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="text-gray-600 mr-2" size={20} />
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedType === type
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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

          {filteredEvents.length === 0 ? (
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
                >
                  {/* Event Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-900">
                    <motion.img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold backdrop-blur-sm">
                        {event.badge}
                      </span>
                    </div>

                    {/* Event Type */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-text mb-4 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <div className="p-2 bg-primary/10 rounded-lg mr-3">
                          <Calendar className="text-primary" size={18} />
                        </div>
                        <div>
                          <span className="font-medium">{event.date}</span>
                          <span className="text-sm text-gray-500 ml-2">• {event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <div className="p-2 bg-secondary/10 rounded-lg mr-3">
                          <MapPin className="text-secondary" size={18} />
                        </div>
                        <span className="font-medium">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-text mb-3 flex items-center">
                        <CheckCircle className="mr-2 text-primary" size={20} />
                        What You'll Get:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.outcomes.map((outcome) => (
                          <li key={outcome} className="flex items-center text-gray-600 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/contact"
                        className="inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all group/btn"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={20} />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-3xl rounded-tr-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Event Outcomes Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-bg to-secondary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-text mb-4">Event Outcomes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our events have made a significant impact on the innovation community
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {pastOutcomes.map((outcome, index) => {
              const Icon = outcome.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon size={24} />
                      </div>
                      {outcome.value && (
                        <div className="text-3xl font-bold opacity-90">
                          {outcome.value}
                        </div>
                      )}
                    </div>
                    <p className="text-white/90 leading-relaxed text-sm">{outcome.text}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-r from-primary via-primary-700 to-secondary rounded-3xl p-12 text-center text-white shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Interested in Hosting an Event?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Partner with us to organize workshops, seminars, or conferences in your area
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
