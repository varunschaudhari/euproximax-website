import { motion } from 'framer-motion'
import { Play, Video, Clock, Filter, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchPublicVideos, VideoRecord } from '../services/videoService'
import { ApiError } from '../utils/apiClient'
import { useToast } from '../context/ToastContext'

export default function VideoGallery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(['all'])
  const { showError } = useToast()

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchPublicVideos()
        const data = response.data || []
        setVideos(data)
        const uniqueCategories = Array.from(new Set(data.map((video) => video.category).filter(Boolean)))
        setCategories(['all', ...uniqueCategories])
      } catch (err) {
        const apiErr = err as ApiError
        const message = apiErr.message || 'Unable to load videos'
        setError(message)
        showError(message)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [showError])

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [videos, searchQuery, selectedCategory])

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
              <Video className="text-primary mr-2" size={24} />
              <span className="text-primary font-semibold text-sm">Video Library</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
              Learn from
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Expert Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore our comprehensive video library covering IP protection, patents, design, and innovation strategies
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
                src="/JPEG_White_BG.jpg"
                alt="Video Gallery"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/MVP.jpg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-white transition-colors"
                >
                  <Play className="text-primary ml-1" size={40} fill="currentColor" />
                </motion.div>
              </div>
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
                placeholder="Search videos..."
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

      {/* Video Grid Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-text mb-2">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'}
            </h2>
            <p className="text-gray-600">
              {selectedCategory !== 'all' ? `Showing videos in ${selectedCategory}` : 'Browse all our educational content'}
            </p>
          </motion.div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading videos...</div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <Video className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No videos found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredVideos.map((video) => (
                <motion.div
                  key={video._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-900">
                    {video.thumbnailUrl ? (
                      <motion.img
                        src={video.thumbnailUrl}
                        alt={video.heroImageAlt || video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/MVP.jpg'
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <video src={video.videoUrl} className="w-full h-full object-cover" muted />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(video.videoUrl, '_blank')}
                        className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl cursor-pointer group-hover:bg-white transition-colors"
                      >
                        <Play className="text-primary ml-1" size={36} fill="currentColor" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                      <Clock size={14} />
                      <span>
                        {video.durationSeconds
                          ? `${Math.floor(video.durationSeconds / 60)
                            .toString()
                            .padStart(2, '0')}:${Math.floor(video.durationSeconds % 60)
                              .toString()
                              .padStart(2, '0')}`
                          : '—'}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold">
                        {video.category || 'General'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{video.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Category: {video.category || 'General'}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(video.videoUrl, '_blank')}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Watch Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-bg to-secondary/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Want to Create Your Own Video Content?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Partner with us to create educational content about IP protection and innovation
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
