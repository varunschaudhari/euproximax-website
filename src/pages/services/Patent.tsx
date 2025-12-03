import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Search, FileText, Briefcase, Scale, Heart, ShoppingBag, Car, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Patent() {
  const benefits = [
    'Avoid costly legal disputes.',
    'Identify potential competitors and market gaps.',
    'Strengthen your IP strategy.',
  ]

  const services = [
    {
      icon: Search,
      title: 'In-Depth Analysis',
      description: 'In-depth analysis of existing patents, trademarks, and publications.',
    },
    {
      icon: CheckCircle,
      title: 'Patentability Assessment',
      description: 'Evaluate if your invention is patent-worthy.',
    },
    {
      icon: FileText,
      title: 'Patent Drafting & Filing',
      description: 'Professional documentation to meet legal standards.',
    },
    {
      icon: Briefcase,
      title: 'IP Strategy Consulting',
      description: 'Build a strong, future-proof patent portfolio.',
    },
    {
      icon: Scale,
      title: 'Legal Support',
      description: 'Guidance in case of disputes or infringement.',
    },
  ]

  const industries = [
    {
      name: 'Medical Devices',
      icon: Heart,
      description: 'Healthcare innovation protection',
    },
    {
      name: 'Consumer Products',
      icon: ShoppingBag,
      description: 'Retail and consumer goods',
    },
    {
      name: 'Automotive',
      icon: Car,
      description: 'Vehicle and transportation tech',
    },
    {
      name: 'Electronics',
      icon: Cpu,
      description: 'Electronic components and systems',
    },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/patent-mindmap.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-primary-700/5 to-secondary-700/10"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
              Patent Research <br />& Protection
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
              Safeguard Your Innovation — Protect What You Create
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Patents give you exclusive rights to your invention and shield your business from copycats.
              Our expert team conducts thorough research, ensures novelty, and provides strategic filing
              and protection services, so your innovation stays uniquely yours.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg shadow-soft"
                >
                  <CheckCircle className="text-success flex-shrink-0" size={20} />
                  <span className="text-text">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <Link
              to="/contact?subject=patent"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              Enquire About Patent Registration <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
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
            <p className="text-lg md:text-xl text-gray-600 mb-4">Our Services Include</p>
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Comprehensive Intellectual Property Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 gradient-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Enquiry Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-bg to-secondary/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                  Ready to Register Your Patent?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Get started with a free consultation. Our experts will guide you through the patent registration process,
                  from initial research to filing and protection.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact?subject=patent"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 shadow-lg hover:scale-105 text-lg"
                >
                  Enquire Now <ArrowRight className="ml-2" size={20} />
                </Link>
                <a
                  href="mailto:contact@euproximax.com?subject=Patent Registration Enquiry"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200 shadow-lg border-2 border-primary hover:scale-105 text-lg"
                >
                  Email Us
                </a>
                <a
                  href="tel:+919270536828"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200 shadow-lg border-2 border-primary hover:scale-105 text-lg"
                >
                  Call Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
              Industries We Support
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We work with inventors, startups, manufacturers, and technology firms across sectors
              like medical devices, consumer products, automotive, and electronics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full p-8 text-center hover:shadow-medium transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary/20">
                  <div className="w-20 h-20 gradient-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <industry.icon size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Protect Your Innovation?</h2>
            <p className="text-xl mb-8 text-secondary-100 leading-relaxed">
              Contact our patent experts to discuss your IP protection needs and get started today.
            </p>
            <Link
              to="/contact?subject=patent"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
            >
              Enquire About Patent Registration <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

