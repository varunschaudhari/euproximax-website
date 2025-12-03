import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Eye, Lightbulb, Cog, Cpu, Zap, FileText, Wrench, Shield, DollarSign, UserPlus, Search, Brain, Settings, FileCheck, TrendingUp, Users, ArrowUp, Menu, X, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  const [activeSection, setActiveSection] = useState('overview')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Helper function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/dr\.\s*/g, 'dr-')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  const partners = [
    {
      name: 'Tanaya Chaudhari',
      location: 'INDIA',
      role: 'Administrative Assistant – EuProximaX Innovation Services',
      image: 'https://euproximax.com/uploads/partners/1762188881_1761162623_1761151095_1760668198_WhatsApp%20Image%202025-10-16%20at%209.41.14%20PM.jpeg'
    },
    {
      name: 'Dr. Jyoti Chaudhari',
      location: 'INDIA',
      role: 'Strategic Advisor & Founder – EuProximaX Innovation Services',
      image: 'https://euproximax.com/uploads/partners/1762188894_1761163830_1761162813_WhatsApp%20Image%202025-10-21%20at%204.58.43%20AM.jpeg'
    },
    {
      name: 'Prerana Chaudhari',
      location: 'INDIA',
      role: 'Project Manager (South Asia & India)– EuProximaX Innovation Services',
      image: 'https://euproximax.com/uploads/partners/1762188906_1761145881_1760668450_WhatsApp%20Image%202025-10-16%20at%2010.01.01%20PM%20(1).jpeg'
    },
    {
      name: 'Pravin Shinde',
      location: 'USA & INDIA',
      role: 'Director of Innovation Services – EuProximaX Innovation Services',
      image: 'https://euproximax.com/uploads/partners/1762190145_Pravin.jpeg'
    },
    {
      name: 'Dr. Sandeep Sonawane',
      location: 'INDIA',
      role: 'Scientific & Academic Collaboration',
      image: 'https://euproximax.com/uploads/partners/1762190168_Dr.%20Sandeep.jpg'
    },
    {
      name: 'Umesh Patil',
      location: 'INDIA',
      role: 'Industrial Professional – External Associate',
      image: undefined
    },
    {
      name: 'Dhananjay Patil',
      location: 'INDIA',
      role: 'Industrial Professional – External Associate',
      image: undefined
    },
    {
      name: 'Dr. Prakash Wankhedkar',
      location: 'INDIA',
      role: 'Academic & Research Associate– External Associate EuProximaX Innovation Services',
      image: undefined
    },
    {
      name: 'Harshika Suryawanshi',
      location: 'INDIA',
      role: 'Digital Development & AI/ML Lead – External Associate',
      image: 'https://euproximax.com/uploads/partners/1762188922_1761145947_1760848012_harshika%20mam.jpg'
    },
    {
      name: 'Hemant Suryawanshi',
      location: 'USA',
      role: 'Business Development (USA, Europe, and Asia) & Innovation Lead- External Associate',
      image: 'https://euproximax.com/uploads/partners/1762188938_1761151591_1647957911258.jpg'
    },
    {
      name: 'Shubham Wagh',
      location: 'USA',
      role: 'Global Innovation (USA, UK, Canada & India) & Client Partnerships Lead – EuProximaX Innovation Services',
      image: 'https://euproximax.com/uploads/partners/1762271221_Shubham.jpg'
    },
    {
      name: 'Sandeep Narayan Patil',
      location: 'UK',
      role: 'Scientific Advisor – External Collaboration, EuProximaX Innovation Services',
      image: undefined
    },
  ]

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
            <h2 className="text-xl font-bold text-text hidden md:block">About EuProximaX</h2>

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
      <section id="overview" className="relative py-20 bg-gradient-to-br from-primary/10 via-bg to-secondary/10 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <Target className="text-primary mr-2" size={24} />
              <span className="text-primary font-semibold text-sm">Who We Are</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                EuProximaX
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
              A global IP & innovation platform based in India, dedicated to helping
              innovators protect and commercialize their ideas.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We provide comprehensive services in patents, industrial design, prototyping, and manufacturing support to transform your innovative concepts into protected, market-ready products.
            </p>
          </motion.div>

          {/* Hero Image */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/JPEG_White_BG.jpg"
                alt="EuProximaX"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/MVP.jpg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
          </motion.div> */}

          {/* Key Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Shield,
                title: 'IP Protection',
                description: 'Comprehensive patent and design protection services',
              },
              {
                icon: Zap,
                title: 'Innovation Support',
                description: 'From concept to prototype and market launch',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Serving innovators worldwide from our base in India',
              },
            ].map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-surface rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-700 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{highlight.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                </motion.div>
              )
            })}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/partner/${generateSlug(partner.name)}`}
                  className="block card p-6 group hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors shadow-md">
                    {partner.image && !imageErrors[partner.name] ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setImageErrors(prev => ({ ...prev, [partner.name]: true }))
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
