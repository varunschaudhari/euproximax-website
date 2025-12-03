import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Award, Star, Shield, Zap, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Home() {
  const heroSlides = [
    {
      title: 'Types of Patent Registration',
      subtitle: 'Product, Process & Biotechnology Patents',
      description: 'Comprehensive patent services covering all types of intellectual property protection',
      image: '/2.png', // Types of Patent Registration infographic
    },
    {
      title: 'Expert Patent Consultation',
      subtitle: 'Collaborative Innovation Services',
      description: 'Work with our expert team to protect and commercialize your innovations',
      image: '/1.jpg', // Business meeting with PATENT clipboard
    },
    {
      title: 'Understanding Patents',
      subtitle: 'Ownership, Rights & Applications',
      description: 'From application to granted rights, we guide you through every aspect of patent protection',
      image: '/3.jpg', // Mind map diagram with PATENT
    },
    {
      title: 'Patent Protection Services',
      subtitle: 'Legal Expertise & Intellectual Property',
      description: 'Professional patent services backed by legal expertise and industry knowledge',
      image: '/4.png', // Torn paper with PATENT and legal doodles
    },
  ]

  const services = [
    {
      name: 'Patent Research & Protection',
      path: '/services/patent',
      icon: '📄',
      description: 'Comprehensive patent research, filing and protection services'
    },
    {
      name: 'Industrial Design & Product Design',
      path: '/services/industrial-design',
      icon: '🎨',
      description: 'Protect the aesthetic and functional design of your products'
    },
    {
      name: 'Prototyping',
      path: '/services/prototyping',
      icon: '🔧',
      description: 'Turn your concepts into tangible prototypes'
    },
    {
      name: 'Electronic Design & Engineering',
      path: '/services/electronic',
      icon: '⚡',
      description: 'Expert electronic design and engineering services'
    },
    {
      name: 'Mechanical Engineering',
      path: '/services/mechanical',
      icon: '⚙️',
      description: 'Professional mechanical engineering and design'
    },
    {
      name: 'Packaging Design & Brand Development',
      path: '/services/packaging',
      icon: '📦',
      description: 'Innovative packaging solutions and brand development for your products'
    },
    {
      name: 'Manufacturing Consulting',
      path: '/services/manufacturing',
      icon: '🏭',
      description: 'End-to-end manufacturing consulting and support services'
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Consultation',
      description: 'Discuss your innovation and IP needs with our experts',
    },
    {
      step: 2,
      title: 'Analysis & Strategy',
      description: 'We analyze your idea and create a comprehensive IP strategy',
    },
    {
      step: 3,
      title: 'Protection',
      description: 'File patents and protect your intellectual property',
    },
    {
      step: 4,
      title: 'Support',
      description: 'Ongoing support for commercialization and growth',
    },
  ]

  const stats = [
    { value: '1000+', label: 'Patents Filed', icon: Award },
    { value: '500+', label: 'Happy Clients', icon: Users },
    { value: '50+', label: 'Countries Served', icon: TrendingUp },
  ]

  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Expert Team',
      description: 'Experienced IP professionals with decades of combined expertise',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick turnaround times for all your IP protection needs',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'International patent filing and protection services worldwide',
    },
    {
      icon: Award,
      title: 'Proven Track Record',
      description: 'Thousands of successful patents filed and protected',
    },
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Innovation Director',
      company: 'Tech Innovations Inc.',
      content: 'EuProximaX helped us protect our breakthrough technology. Their expertise and guidance were invaluable throughout the patent process.',
      rating: 5,
      image: '👩‍💼',
    },
    {
      name: 'Michael Chen',
      role: 'Founder & CEO',
      company: 'StartupXYZ',
      content: 'The team at EuProximaX made the complex world of IP protection simple and accessible. Highly recommended!',
      rating: 5,
      image: '👨‍💼',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Research Lead',
      company: 'Innovation Labs',
      content: 'Professional, efficient, and results-driven. They helped us secure multiple patents for our research innovations.',
      rating: 5,
      image: '👩‍🔬',
    },
  ]

  const clients = [
    { name: 'Client 1', logo: '🏢' },
    { name: 'Client 2', logo: '🏭' },
    { name: 'Client 3', logo: '💼' },
    { name: 'Client 4', logo: '🔬' },
    { name: 'Client 5', logo: '⚡' },
    { name: 'Client 6', logo: '🚀' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="h-full"
        >
          {heroSlides.map((slide, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="h-full relative overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-secondary">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={slide.image || '/MVP.jpg'}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => {
                        // Fallback to default image if the specified image doesn't exist
                        const target = e.target as HTMLImageElement
                        if (target.src !== window.location.origin + '/MVP.jpg') {
                          target.src = '/MVP.jpg'
                        }
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/90"></div>
                    {/* Additional Overlay for Better Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
                  </div>

                  {/* Animated Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                      backgroundSize: '200px 200px',
                    }}
                  ></div>

                  {/* Content Container */}
                  <div className="container-custom h-full flex items-center relative z-10">
                    <div className="w-full text-center">
                      {/* Badge/Indicator */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
                      >
                        <Star className="text-accent" size={16} fill="currentColor" />
                        <span className="text-sm font-semibold text-white">Innovation Services</span>
                      </motion.div>

                      {/* Main Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight text-white drop-shadow-lg"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                      >
                        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-secondary-100 mb-2 drop-shadow-md">
                          {slide.subtitle}
                        </p>
                      </motion.div>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-base md:text-lg lg:text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed drop-shadow-sm"
                      >
                        {slide.description}
                      </motion.p>

                      {/* CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                      >
                        <Link
                          to="/contact"
                          className="group inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg backdrop-blur-sm"
                        >
                          Get Started
                          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <Link
                          to="/services"
                          className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50 text-lg"
                        >
                          Explore Services
                        </Link>
                      </motion.div>

                      {/* Stats or Additional Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex flex-wrap justify-center gap-8 text-white/80"
                      >
                        <div className="flex items-center gap-2">
                          <Award className="text-accent" size={20} />
                          <span className="text-sm font-medium">Expert Team</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="text-accent" size={20} />
                          <span className="text-sm font-medium">Trusted Service</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="text-accent" size={20} />
                          <span className="text-sm font-medium">Global Reach</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-50"></div>
                  <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </section>

      {/* Welcome Section */}
      <section className="section-padding bg-bg">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                Welcome to <span className="text-gradient">EuProximaX</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                Your trusted partner in intellectual property protection and innovation services.
                We help innovators worldwide protect their ideas and bring them to market.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                With years of experience and a global network of IP experts, we provide comprehensive
                services including patent filing, industrial design protection, prototyping, and
                manufacturing support. Our mission is to make IP protection accessible to innovators
                everywhere.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Learn More <ArrowRight className="ml-2" size={20} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-large">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  {/* <source src="/xfire.mp4" type="video/mp4" /> */}
                  <source src="/xfire.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">Why Choose Us</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine expertise, efficiency, and global reach to deliver exceptional IP services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 gradient-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">Our Services</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive innovation and IP services to protect and commercialize your ideas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex"
              >
                <Link
                  to={service.path}
                  className="bg-card rounded-2xl shadow-soft p-8 border border-gray-100 hover:shadow-medium transition-all duration-300 flex flex-col w-full h-full group hover:scale-105"
                >
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-semibold text-text mb-4 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold mt-auto whitespace-nowrap">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All Services <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">How It Works</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A simple, streamlined process to protect your innovations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-20 h-20 gradient-primary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                  <stat.icon className="text-white" size={40} />
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-3">{stat.value}</div>
                <div className="text-xl md:text-2xl text-secondary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Slider Section */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">Our Clients</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by innovators and businesses worldwide
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={30}
            autoplay={{ delay: 3000 }}
            loop
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="py-8"
          >
            {clients.map((client, index) => (
              <SwiperSlide key={index}>
                <div className="bg-card rounded-xl shadow-soft p-6 border border-gray-100 text-center h-32 flex items-center justify-center group hover:scale-110 hover:shadow-medium transition-all duration-300">
                  <div className="text-5xl">{client.logo}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">Client Testimonials</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See what our clients say about working with EuProximaX
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-100 to-teal-100 flex items-center justify-center text-3xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-primary">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-accent fill-accent" size={20} />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section Preview */}
      <section className="section-padding bg-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">Latest Blog Posts</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest insights on IP protection and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-secondary-100 to-teal-100 rounded-xl mb-6 flex items-center justify-center text-4xl">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors">
                  Blog Post {item}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Latest insights on IP protection and innovation strategies...
                </p>
                <Link
                  to="/blogs"
                  className="text-primary font-semibold text-sm hover:text-primary-700 flex items-center"
                >
                  Read More <ArrowRight className="ml-2" size={16} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All Blogs <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Ready to Protect Your Innovation?</h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-secondary-100 leading-relaxed">
              Get in touch with our experts and start your IP journey today
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
            >
              Contact Us <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

