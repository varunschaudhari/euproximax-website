import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { handleImageError } from '../utils/imageErrorHandler'

export default function Footer() {
  const quickLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/story', label: 'Story' },
    { to: '/consultation', label: 'Free Book Consultation' },
    { to: '/contact', label: 'Contact' },
  ]

  const services = [
    { to: '/services/patent', label: 'Patent Services' },
    { to: '/services/industrial-design', label: 'Industrial Design' },
    { to: '/services/prototyping', label: 'Prototyping' },
    { to: '/services/electronic', label: 'Electronic Design' },
    { to: '/services/mechanical', label: 'Mechanical Design' },
    { to: '/services/packaging', label: 'Packaging Design' },
  ]

  const resources = [
    { to: '/event-gallery', label: 'Event Gallery' },
    { to: '/video-gallery', label: 'Video Gallery' },
    { to: '/blogs', label: 'Blogs' },
  ]

  const legalLinks = [
    { to: '/terms', label: 'Terms of Service' },
    { to: '/privacy', label: 'Privacy Policy' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/euproximax/', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white mt-auto overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <img
                    src="/logo.png"
                    alt="EuProximaX Logo"
                    className="h-14 w-auto object-contain filter brightness-0 invert mb-6"
                    onError={handleImageError}
                  />
                  {/* <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    EuProximaX
                  </h3> */}
                  <p className="text-gray-400 leading-relaxed mb-8 max-w-md text-sm">
                    Global IP & Innovation Platform. Empowering innovators to protect their ideas and transform them into reality.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-8">
                  <a
                    href="mailto:contact@euproximax.com"
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-all group"
                  >
                    <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <span className="text-sm">contact@euproximax.com</span>
                  </a>
                  <a
                    href="tel:+919270536828"
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-all group"
                  >
                    <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <span className="text-sm">+91 9270536828</span>
                  </a>
                  <div className="flex items-start space-x-3 text-gray-300">
                    <div className="p-2.5 bg-secondary/10 rounded-lg mt-0.5">
                      <MapPin size={16} className="text-secondary" />
                    </div>
                    <div className="text-sm leading-relaxed">
                      <p className="font-medium text-white mb-1">Keshav Nagar, Behind Philosophy Center</p>
                      <p className="text-gray-400">Keshav Nagar (Rural), Amalner</p>
                      <p className="text-gray-400">Jalgaon, 425401, India</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Connect With Us</h4>
                  <div className="flex items-center space-x-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2.5 bg-gray-800/50 hover:bg-gradient-to-br hover:from-primary hover:to-secondary rounded-lg transition-all backdrop-blur-sm border border-gray-800 hover:border-primary/50"
                          aria-label={social.label}
                        >
                          <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h4 className="text-sm font-bold text-white mb-6 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center text-gray-400 hover:text-primary transition-all group text-sm"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services & Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h4 className="text-sm font-bold text-white mb-6 relative inline-block">
                Services
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
              </h4>
              <ul className="space-y-3 mb-8">
                {services.map((service) => (
                  <li key={service.to}>
                    <Link
                      to={service.to}
                      className="flex items-center text-gray-400 hover:text-primary transition-all group text-sm"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span>{service.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-bold text-white mb-6 relative inline-block mt-8">
                Resources
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
              </h4>
              <ul className="space-y-3">
                {resources.map((resource) => (
                  <li key={resource.to}>
                    <Link
                      to={resource.to}
                      className="flex items-center text-gray-400 hover:text-primary transition-all group text-sm"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span>{resource.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h4 className="text-sm font-bold text-white mb-6 relative inline-block">
                Legal
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center text-gray-400 hover:text-primary transition-all group text-sm"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} EuProximaX Innovation Services. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-red-500"
              >
                ❤️
              </motion.span>
              <span>for innovators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
