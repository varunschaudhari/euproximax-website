import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Mail, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchPartnerBySlug, Partner } from '../services/partnerService'
import { ApiError } from '../utils/apiClient'
export default function PartnerDetail() {
    const { slug } = useParams<{ slug: string }>()
    const [partner, setPartner] = useState<Partner | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        const loadPartner = async () => {
            if (!slug) {
                setError('Invalid partner identifier')
                setLoading(false)
                return
            }
            setLoading(true)
            setError(null)
            try {
                const response = await fetchPartnerBySlug(slug)
                setPartner(response.data)
                setImageError(false)
            } catch (err) {
                const apiErr = err as ApiError
                const message = apiErr.message || 'Partner not found'
                setError(message)
                setPartner(null)
            } finally {
                setLoading(false)
            }
        }
        loadPartner()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-bg py-12 md:py-20">
                <div className="container-custom">
                    <div className="text-center py-20 text-gray-500">Loading partner details...</div>
                </div>
            </div>
        )
    }

    if (error || !partner) {
        return (
            <div className="min-h-screen bg-bg py-12 md:py-20">
                <div className="container-custom">
                    <div className="text-center py-20">
                        <p className="text-rose-500 mb-4">{error || 'Partner not found'}</p>
                        <Link
                            to="/about#partners"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-700"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Partners</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg py-12 md:py-20">
            <div className="container-custom">
                {/* Back Button */}
                <Link
                    to="/about#partners"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Partners</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-3xl shadow-xl overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Profile Photo */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-5xl md:text-6xl shadow-xl overflow-hidden">
                                    {partner.image && !imageError ? (
                                        <img
                                            src={partner.image.startsWith('http') ? partner.image : `${import.meta.env.VITE_API_URL || ''}${partner.image}`}
                                            alt={partner.name}
                                            className="w-full h-full rounded-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <span className="text-5xl md:text-6xl">👤</span>
                                    )}
                                </div>

                                {/* Name and Role */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{partner.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                        <MapPin size={18} />
                                        <span className="text-white/90">{partner.location}</span>
                                    </div>
                                    <p className="text-xl text-white/90">{partner.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-12">
                            {/* Bio */}
                            {partner.bio && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-text mb-4">About</h2>
                                    <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                                        {partner.bio.split('\n\n').map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Expertise */}
                            {partner.expertise && partner.expertise.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-text mb-4">Areas of Expertise</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {partner.expertise.map((area, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Information */}
                            <div className="border-t border-gray-200 pt-8">
                                <h2 className="text-2xl font-bold text-text mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    {partner.email && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <Mail className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <a
                                                    href={`mailto:${partner.email}`}
                                                    className="text-primary font-medium hover:underline"
                                                >
                                                    {partner.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {partner.phone && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <Phone className="text-primary" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <a
                                                    href={`tel:${partner.phone}`}
                                                    className="text-primary font-medium hover:underline"
                                                >
                                                    {partner.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <MapPin className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="text-text font-medium">{partner.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    <Mail size={20} />
                                    Contact {partner.name.split(' ')[0]}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

