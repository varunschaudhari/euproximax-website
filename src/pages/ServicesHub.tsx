import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Sparkles } from 'lucide-react'

export default function ServicesHub() {
  const [searchQuery, setSearchQuery] = useState('')

  const services = [
    {
      name: 'Patent Research & Protection',
      path: '/services/patent',
      description: 'Comprehensive patent research, filing and protection services',
      icon: '📄',
      category: 'IP Protection',
      color: 'from-blue-500 to-blue-700',
    },
    {
      name: 'Industrial Design & Product Design',
      path: '/services/industrial-design',
      description: 'Protect the aesthetic and functional design of your products',
      icon: '🎨',
      category: 'Design',
      color: 'from-purple-500 to-purple-700',
    },
    {
      name: 'Prototyping',
      path: '/services/prototyping',
      description: 'Turn your concepts into tangible prototypes',
      icon: '🔧',
      category: 'Development',
      color: 'from-orange-500 to-orange-700',
    },
    {
      name: 'Electronic Design & Engineering',
      path: '/services/electronic',
      description: 'Expert electronic design and engineering services',
      icon: '⚡',
      category: 'Engineering',
      color: 'from-yellow-500 to-yellow-700',
    },
    {
      name: 'Mechanical Engineering',
      path: '/services/mechanical',
      description: 'Professional mechanical engineering and design',
      icon: '⚙️',
      category: 'Engineering',
      color: 'from-green-500 to-green-700',
    },
    {
      name: 'Packaging Design & Brand Development',
      path: '/services/packaging',
      description: 'Innovative packaging solutions and brand development for your products',
      icon: '📦',
      category: 'Design',
      color: 'from-pink-500 to-pink-700',
    },
    {
      name: 'Manufacturing Consulting',
      path: '/services/manufacturing',
      description: 'End-to-end manufacturing consulting and support services',
      icon: '🏭',
      category: 'Consulting',
      color: 'from-indigo-500 to-indigo-700',
    },
  ]

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6"
            >
              <Sparkles className="text-primary" size={20} />
              <span className="text-sm font-semibold text-primary">Our Services</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text mb-6 leading-tight">
              Comprehensive Innovation
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                & IP Services
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Protect and commercialize your ideas with our comprehensive suite of innovation services
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg shadow-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
              <p className="text-gray-600">
                Found <span className="font-bold text-primary">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </motion.div>
          )}

          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-text mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search query</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    to={service.path}
                    className="block h-full"
                  >
                    <div className="bg-card rounded-2xl shadow-soft p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group-hover:scale-105 group-hover:border-primary/20 relative overflow-hidden">
                      {/* Background Gradient on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                      {/* Category Badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                          {service.category}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-primary transition-colors leading-tight">
                        {service.name}
                      </h3>

                      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                        {service.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center text-primary font-semibold mt-auto pt-4 border-t border-gray-100 group-hover:border-primary/20 transition-colors">
                        <span>Explore Service</span>
                        <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
                      </div>

                      {/* Decorative Element */}
                      <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-tl-full transition-opacity duration-300`}></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary-700 to-secondary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto text-white"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Protect Your Innovation?
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Get in touch with our experts to discuss how we can help bring your ideas to life and protect your intellectual property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/consultation"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
              >
                Book Free Consultation
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 text-lg"
              >
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '7+', label: 'Service Categories' },
              { number: '100+', label: 'Projects Completed' },
              { number: '50+', label: 'Happy Clients' },
              { number: '10+', label: 'Years Experience' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
