import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, BookOpen, Clock, Search, Filter, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchBlogs, BlogPost, submitBlogProposal } from '../services/blogService'
import { ApiError } from '../utils/apiClient'
import { useToast } from '../context/ToastContext'

const formatDate = (value?: string) => {
    if (!value) return ''
    try {
        return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value))
    } catch {
        return ''
    }
}

export default function Blogs() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [categories, setCategories] = useState<string[]>(['all'])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeSearch, setActiveSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
    const [submissionForm, setSubmissionForm] = useState({
        name: '',
        email: '',
        title: '',
        summary: '',
        reference: '',
    })
    const [submissionError, setSubmissionError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { showSuccess, showError } = useToast()

    useEffect(() => {
        const handler = setTimeout(() => setActiveSearch(searchQuery.trim()), 350)
        return () => clearTimeout(handler)
    }, [searchQuery])

    const loadBlogs = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetchBlogs({
                search: activeSearch || undefined,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
            })
            const data = response.data
            setPosts(data.items || [])
            const uniqueCategories = Array.from(new Set(data.categories || [])).filter(Boolean)
            setCategories(['all', ...uniqueCategories])
        } catch (err) {
            const apiErr = err as ApiError
            setError(apiErr.message || 'Unable to load articles')
            setPosts([])
        } finally {
            setLoading(false)
        }
    }, [activeSearch, selectedCategory])

    useEffect(() => {
        loadBlogs()
    }, [loadBlogs])

    const resetSubmissionForm = () => {
        setSubmissionForm({
            name: '',
            email: '',
            title: '',
            summary: '',
            reference: '',
        })
        setSubmissionError(null)
    }

    const handleSubmissionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setSubmissionForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmitArticle = async (event: FormEvent) => {
        event.preventDefault()
        if (isSubmitting) return
        if (!submissionForm.name.trim() || !submissionForm.email.trim() || !submissionForm.title.trim() || !submissionForm.summary.trim()) {
            setSubmissionError('Please complete the required fields.')
            return
        }

        setSubmissionError(null)
        setIsSubmitting(true)
        try {
            await submitBlogProposal({
                name: submissionForm.name.trim(),
                email: submissionForm.email.trim(),
                title: submissionForm.title.trim(),
                summary: submissionForm.summary.trim(),
                reference: submissionForm.reference?.trim() || undefined,
            })
            showSuccess('Thank you! Our editorial team will review your submission.')
            resetSubmissionForm()
            setSubmissionModalOpen(false)
        } catch (err) {
            const apiErr = err as ApiError
            const message = apiErr.message || 'Unable to submit your article right now.'
            setSubmissionError(message)
            showError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const featuredPost = useMemo(() => {
        if (selectedCategory !== 'all' || activeSearch) return null
        return posts.find((post) => post.isFeatured) || posts[0] || null
    }, [posts, selectedCategory, activeSearch])

    const regularPosts = useMemo(() => {
        if (!posts.length) return []
        const excludeId = featuredPost?._id
        return posts.filter((post) => post._id !== excludeId)
    }, [posts, featuredPost])

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
                            <BookOpen className="text-primary mr-2" size={24} />
                            <span className="text-primary font-semibold text-sm">Knowledge Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
                            Insights &
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Innovation Stories
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            Stay updated with the latest insights on IP protection, innovation strategies, and success stories from the
                            world of intellectual property
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
                                src={featuredPost?.coverImage || '/JPEG_Dark_BG.jpg'}
                                alt={featuredPost?.title || 'Blogs'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = '/MVP.jpg'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
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
                                placeholder="Search articles..."
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

                    {error && (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Post Section */}
            {featuredPost && (
                <section className="py-20">
                    <div className="container-custom">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
                            <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="text-primary" size={20} />
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Article</span>
                            </div>
                            <h2 className="text-3xl font-bold text-text">Trending Now</h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-surface rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                <div className="relative h-64 lg:h-auto overflow-hidden">
                                    <motion.img
                                        src={featuredPost.coverImage || '/MVP.jpg'}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = '/MVP.jpg'
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent lg:hidden"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                                            {featuredPost.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <Calendar size={16} />
                                            <span>{formatDate(featuredPost.publishedAt)}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center space-x-1">
                                            <User size={16} />
                                            <span>{featuredPost.author?.name}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center space-x-1">
                                            <Clock size={16} />
                                            <span>{`${featuredPost.readTimeMinutes} min read`}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-bold text-text mb-4 group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                        {featuredPost.excerpt}
                                    </p>
                                    <Link
                                        to={`/blogs/${featuredPost.slug}`}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all group/btn w-fit"
                                    >
                                        Read Article
                                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={20} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
                        <h2 className="text-3xl font-bold text-text mb-2">
                            {regularPosts.length} {regularPosts.length === 1 ? 'Article' : 'Articles'}
                        </h2>
                        <p className="text-gray-600">
                            {selectedCategory !== 'all' ? `Showing articles in ${selectedCategory}` : 'Browse all our latest articles'}
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="py-20 text-center text-gray-500">Loading articles...</div>
                    ) : regularPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
                            <h3 className="text-2xl font-bold text-gray-600 mb-2">No articles found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {regularPosts.map((post) => (
                                <motion.div
                                    key={post._id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="group bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                                >
                                    {/* Blog Image */}
                                    <div className="relative h-56 overflow-hidden bg-gray-900">
                                        <motion.img
                                            src={post.coverImage || '/MVP.jpg'}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.src = '/MVP.jpg'
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="p-6">
                                        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <Calendar size={14} />
                                                <span>{formatDate(post.publishedAt)}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center space-x-1">
                                                <Clock size={14} />
                                                <span>{`${post.readTimeMinutes} min read`}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User size={14} className="text-primary" />
                                                </div>
                                                <span className="text-sm text-gray-600">{post.author?.name}</span>
                                            </div>
                                            <Link
                                                to={`/blogs/${post.slug}`}
                                                className="text-primary font-semibold text-sm hover:text-primary-700 flex items-center group/link"
                                            >
                                                Read
                                                <ArrowRight className="ml-1 group-hover/link:translate-x-1 transition-transform" size={16} />
                                            </Link>
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
                            Have a Story to Share?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            We're always looking for guest contributors and innovation stories. Share your experience with our community.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSubmissionModalOpen(true)}
                            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Submit Your Article
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {submissionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                        <button
                            className="absolute right-3 top-3 rounded-full p-1 text-gray-500 transition hover:bg-gray-100"
                            onClick={() => {
                                setSubmissionModalOpen(false)
                                resetSubmissionForm()
                            }}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">Share Your Article</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Submit your story idea or draft. Our editorial team will get back to you within 2 business days.
                        </p>
                        <form className="mt-4 space-y-4" onSubmit={handleSubmitArticle}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700" htmlFor="submission-name">
                                        Full Name
                                    </label>
                                    <input
                                        id="submission-name"
                                        name="name"
                                        value={submissionForm.name}
                                        onChange={handleSubmissionChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700" htmlFor="submission-email">
                                        Email
                                    </label>
                                    <input
                                        id="submission-email"
                                        type="email"
                                        name="email"
                                        value={submissionForm.email}
                                        onChange={handleSubmissionChange}
                                        required
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                        placeholder="you@email.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700" htmlFor="submission-title">
                                    Article Title
                                </label>
                                <input
                                    id="submission-title"
                                    name="title"
                                    value={submissionForm.title}
                                    onChange={handleSubmissionChange}
                                    required
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                    placeholder="e.g. Building a Patent-First Hardware Startup"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700" htmlFor="submission-summary">
                                    Summary / Abstract
                                </label>
                                <textarea
                                    id="submission-summary"
                                    name="summary"
                                    value={submissionForm.summary}
                                    onChange={handleSubmissionChange}
                                    required
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                    placeholder="Describe the key insight, audience and outcome in 3–5 sentences."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700" htmlFor="submission-reference">
                                    Reference Link (Optional)
                                </label>
                                <input
                                    id="submission-reference"
                                    name="reference"
                                    value={submissionForm.reference}
                                    onChange={handleSubmissionChange}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                    placeholder="Link to draft, portfolio, or research"
                                />
                            </div>
                            {submissionError && <p className="text-xs text-rose-600">{submissionError}</p>}
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmissionModalOpen(false)
                                        resetSubmissionForm()
                                    }}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-lg bg-gradient-to-r from-primary to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

