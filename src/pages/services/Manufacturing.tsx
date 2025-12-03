import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Search, DollarSign, CheckCircle, ArrowUpRight, Clock, Leaf, Award, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Manufacturing() {
  const services = [
    {
      icon: TrendingUp,
      title: 'Process Optimization',
      description: 'Lean manufacturing, Six Sigma.',
    },
    {
      icon: Search,
      title: 'Supplier Sourcing',
      description: 'Find reliable vendors worldwide.',
    },
    {
      icon: DollarSign,
      title: 'Cost Analysis & Reduction',
      description: 'Identify savings without cutting quality.',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Inspection protocols and compliance.',
    },
    {
      icon: ArrowUpRight,
      title: 'Production Scaling',
      description: 'Smooth transition from prototype to full production.',
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: 'Faster Time to Market',
    },
    {
      icon: Leaf,
      title: 'Reduced Manufacturing Waste',
    },
    {
      icon: Award,
      title: 'Consistent Product Quality',
    },
    {
      icon: TrendingDown,
      title: 'Improved Profitability',
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
              Manufacturing Consulting
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
              Smarter, Leaner, Faster Production
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              We help businesses streamline manufacturing, reduce costs, and scale without compromising quality.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              Book Free Consultation <ArrowRight className="ml-2" size={20} />
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
            <p className="text-lg md:text-xl text-gray-600 mb-4">How We Help</p>
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Manufacturing Support & Production Scaling
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

      {/* Benefits Section */}
      <section className="section-padding bg-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
              Benefits
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full p-8 text-center hover:shadow-medium transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary/20">
                  <div className="w-20 h-20 gradient-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Optimize Your Manufacturing?</h2>
            <p className="text-xl mb-8 text-secondary-100 leading-relaxed">
              Contact our manufacturing consulting experts to streamline your production, reduce costs, and scale efficiently.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
            >
              Book Free Consultation <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

