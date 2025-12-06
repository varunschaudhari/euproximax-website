import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Eye, Lightbulb, Cog, Cpu, Zap, FileText, Wrench, Shield, DollarSign, UserPlus, Search, Brain, Settings, FileCheck, TrendingUp, Users, ArrowUp, Menu, X, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchPartners, Partner } from '../services/partnerService'
import { ApiError } from '../utils/apiClient'

export default function About() {
  const [activeSection, setActiveSection] = useState('overview')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [partners, setPartners] = useState<Partner[]>([])
  const [partnersLoading, setPartnersLoading] = useState(true)
  const [partnersError, setPartnersError] = useState<string | null>(null)

  // Helper function to generate slug from name (fallback if slug not available)
  const generateSlug = (partner: Partner) => {
    return partner.slug || partner.name
      .toLowerCase()
      .replace(/dr\.\s*/g, 'dr-')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  useEffect(() => {
    const loadPartners = async () => {
      setPartnersLoading(true)
      setPartnersError(null)
      try {
        const response = await fetchPartners()
        setPartners(response.data || [])
      } catch (err) {
        const apiErr = err as ApiError
        const message = apiErr.message || 'Unable to load partners'
        setPartnersError(message)
        setPartners([])
      } finally {
        setPartnersLoading(false)
      }
    }
    loadPartners()
  }, [])

  const navSections = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'mission', label: 'Mission & Vision', icon: Eye },
    { id: 'process', label: 'Innovation Process', icon: Settings },
    { id: 'capabilities', label: 'Capabilities', icon: Lightbulb },
    { id: 'partners', label: 'Partners', icon: Users },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      // Update active section based on scroll position
      const sections = navSections.map(s => s.id)
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <h2 className="text-xl font-bold text-text hidden md:block"></h2>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeSection === section.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                      }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col gap-2">
                {navSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${activeSection === section.id
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                        }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </div>
      </div>

      {/* Overview Hero Section */}
      <section id="overview" className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-bg to-secondary/5 overflow-hidden scroll-mt-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-6 border border-primary/30"
            >
              <Target className="text-primary" size={20} />
              <span className="text-primary font-semibold text-sm tracking-wide">Who We Are</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text mb-6 leading-tight">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-600 to-secondary mt-2">
                EuProximaX
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-6 font-medium"
            >
              A global IP & innovation platform based in India, dedicated to helping
              innovators protect and commercialize their ideas.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            >
              We provide comprehensive services in patents, industrial design, prototyping, and manufacturing support to transform your innovative concepts into protected, market-ready products.
            </motion.p>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-16"
          >
            {[
              { value: '500+', label: 'Innovations Supported', icon: Lightbulb },
              { value: '12+', label: 'Global Partners', icon: Users },
              { value: '100+', label: 'Patents Filed', icon: FileText },
              { value: '50+', label: 'Prototypes Delivered', icon: Cog },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                    {stat.value}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Key Highlights - Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Shield,
                title: 'IP Protection',
                description: 'Comprehensive patent and design protection services to safeguard your intellectual property',
                gradient: 'from-blue-500 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100/50',
              },
              {
                icon: Zap,
                title: 'Innovation Support',
                description: 'End-to-end support from concept to prototype and market launch with expert guidance',
                gradient: 'from-yellow-500 to-orange-500',
                bgGradient: 'from-yellow-50 to-orange-100/50',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Serving innovators worldwide from our base in India with international expertise',
                gradient: 'from-green-500 to-emerald-600',
                bgGradient: 'from-green-50 to-emerald-100/50',
              },
            ].map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group"
                >
                  <div className={`bg-gradient-to-br ${highlight.bgGradient} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 backdrop-blur-sm h-full`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${highlight.gradient} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {highlight.description}
                    </p>
                    <div className="mt-6 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ArrowUp className="ml-2 rotate-45" size={16} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Value Proposition Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
                  Your Idea is Your Property™
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At EuProximaX, we believe every innovation deserves protection and the opportunity to make an impact. 
                  Our mission is to bridge the gap between creative ideas and commercial success, providing the expertise, 
                  resources, and support needed to transform your vision into reality.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {['Expert Guidance', 'Global Network', 'End-to-End Support', 'Proven Track Record'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/80 rounded-full text-sm font-semibold text-primary border border-primary/20 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">

        {/* Mission & Vision */}
        <section id="mission" className="mb-20 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 gradient-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-bold text-text mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To empower innovators worldwide by providing accessible, expert IP services that
                protect their intellectual property and accelerate their path to market success.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Eye size={32} />
              </div>
              <h2 className="text-3xl font-bold text-text mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become the world's most trusted innovation services platform, connecting
                innovators with the resources they need to transform ideas into protected,
                commercialized products.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Innovation Process Section */}
        <section id="process" className="mb-20 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">Structured Innovation Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
              Initiation
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: UserPlus,
                title: 'Intellectual Onboarding',
                description: 'Client submits a brief concept or observation. NDA executed before disclosure.',
                step: '01',
              },
              {
                icon: Search,
                title: 'Scientific and Technical Evaluation',
                description: 'Our experts assess feasibility, application domains, and potential technical bottlenecks.',
                step: '02',
              },
              {
                icon: Brain,
                title: 'Brainstorming and Use-Case Modeling',
                description: 'Collaborative ideation and hypothesis-driven refinement to align the idea with practical and scientific value.',
                step: '03',
              },
              {
                icon: Settings,
                title: 'Engineering Design and Validation',
                description: 'CAD modeling, FEA/CFD simulations, material selection, and rapid prototyping.',
                step: '04',
              },
              {
                icon: FileCheck,
                title: 'Patent Drafting and Filing',
                description: 'Strategic IP positioning, claim structuring, and regulatory alignment for domestic and international filings.',
                step: '05',
              },
              {
                icon: TrendingUp,
                title: 'Market Transition',
                description: 'Go-to-market strategy, licensing pathways, fundraising support, and production scaling.',
                step: '06',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 group hover:shadow-lg hover:scale-105 transition-all duration-300 relative"
              >
                <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">{step.step}</div>
                <div className="w-14 h-14 gradient-primary text-white rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <step.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-text mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Capabilities Section */}
        <section id="capabilities" className="mb-20 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">Core Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive capabilities to support your innovation journey from concept to market
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lightbulb, title: 'Product Strategy & Conceptualization' },
              { icon: Cog, title: 'Mechanical, Biomedical, and Electrical Design' },
              { icon: Cpu, title: 'AI/ML-Based Technology Development' },
              { icon: Zap, title: 'Embedded Systems and Smart Devices' },
              { icon: FileText, title: 'Intellectual Property Research & Filing' },
              { icon: Wrench, title: 'Prototype Manufacturing and MVP Validation' },
              { icon: Shield, title: 'Regulatory Documentation and Compliance' },
              { icon: DollarSign, title: 'Licensing, Funding, and Startup Guidance' },
            ].map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 group hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 gradient-primary text-white rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <capability.icon size={28} />
                </div>
                <h3 className="text-base font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                  {capability.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partner & Associates Section */}
        <section id="partners" className="mb-20 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Users className="text-primary mx-auto mb-4" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">Our Partner & Associates</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet our global team of experts dedicated to your innovation success
            </p>
          </motion.div>

          {partnersLoading && (
            <div className="text-center py-12 text-gray-500">Loading partners...</div>
          )}
          {partnersError && (
            <div className="text-center py-12 text-rose-500">{partnersError}</div>
          )}
          {!partnersLoading && !partnersError && partners.length === 0 && (
            <div className="text-center py-12 text-gray-500">No partners found.</div>
          )}
          {!partnersLoading && !partnersError && partners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, index) => (
              <motion.div
                key={partner._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/partner/${generateSlug(partner)}`}
                  className="block card p-6 group hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors shadow-md">
                    {partner.image && !imageErrors[partner._id] ? (
                      <img
                        src={partner.image.startsWith('http') ? partner.image : `${import.meta.env.VITE_API_URL || ''}${partner.image}`}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setImageErrors(prev => ({ ...prev, [partner._id]: true }))
                        }}
                      />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors text-center">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-primary font-semibold mb-3 text-center">{partner.location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed text-center mb-2">{partner.role}</p>
                  <p className="text-xs text-primary text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view profile →
                  </p>
                </Link>
              </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-12 text-center text-white shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Innovation Journey?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Get in touch with our team to discuss how we can help protect and commercialize your ideas.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              Contact Us
            </Link>
          </motion.div>
        </section>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </div>
  )
}
