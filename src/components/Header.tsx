import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/story', label: 'Story' },
    { path: '/event-gallery', label: 'Event Gallery' },
    { path: '/video-gallery', label: 'Video Gallery' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/consultation', label: 'Free Book Consultation' },
    { path: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-surface/80 backdrop-blur-lg shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="EuProximaX Logo"
              className="h-12 w-auto object-contain"
            />
            {/* <span className="text-2xl font-bold text-gradient hidden sm:inline-block">
              EuProximaX ajfajfna
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                  ? 'text-primary bg-secondary-50 shadow-sm'
                  : 'text-gray-600 hover:text-secondary-600 hover:bg-secondary-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-secondary-600 transition-colors p-2 rounded-lg hover:bg-secondary-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-1 mt-4 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                      ? 'text-primary bg-secondary-50 shadow-sm'
                      : 'text-gray-600 hover:text-secondary-600 hover:bg-secondary-50'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

