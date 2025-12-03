import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Tag } from 'lucide-react'
import { fetchBlogBySlug, BlogPost } from '../services/blogService'
import { ApiError } from '../utils/apiClient'

const formatDate = (value?: string) => {
    if (!value) return ''
    try {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date(value))
    } catch {
        return ''
    }
}

export default function BlogDetail() {
    const { slug } = useParams<{ slug: string }>()
    const [blog, setBlog] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) {
            setError('Article not found')
            setLoading(false)
            return
        }

        const loadBlog = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetchBlogBySlug(slug)
                setBlog(response.data)
            } catch (err) {
                const apiErr = err as ApiError
                setError(apiErr.message || 'Unable to load article')
            } finally {
                setLoading(false)
            }
        }

        loadBlog()
    }, [slug])

    const contentBlocks = useMemo(() => {
        if (!blog?.content) return []
        return blog.content
            .split(/\n{2,}/)
            .map((block) => block.trim())
            .filter(Boolean)
    }, [blog?.content])

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <p className="text-gray-500">Loading article...</p>
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl font-semibold text-gray-700">{error || 'Article not found'}</p>
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                        <ArrowLeft size={16} />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg">
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-bg to-secondary/10">
                <div className="container-custom relative z-10 py-16">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Articles
                    </Link>
                    <div className="mt-6 max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            {blog.category}
                        </div>
                        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">{blog.title}</h1>
                        <p className="mt-4 text-lg text-gray-600">{blog.excerpt}</p>

                        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-2">
                                <User size={16} />
                                {blog.author?.name}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Calendar size={16} />
                                {formatDate(blog.publishedAt)}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Clock size={16} />
                                {`${blog.readTimeMinutes} min read`}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent"></div>
            </section>

            <section className="container-custom relative z-20 -mt-24 pb-20">
                <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                    <div className="h-80 w-full overflow-hidden bg-gray-900">
                        <img
                            src={blog.coverImage || '/MVP.jpg'}
                            alt={blog.heroImageAlt || blog.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/MVP.jpg'
                            }}
                        />
                    </div>
                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none text-gray-700">
                            {contentBlocks.length > 0 ? (
                                contentBlocks.map((block, index) => (
                                    <p key={index} className="mb-6 leading-relaxed">
                                        {block}
                                    </p>
                                ))
                            ) : (
                                <p>{blog.content}</p>
                            )}
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-10 border-t border-gray-100 pt-6">
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <Tag size={16} className="text-primary" />
                                    {blog.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-custom">
                    <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-700 p-8 text-white">
                        <h2 className="text-2xl font-semibold">Have questions about IP or innovation?</h2>
                        <p className="mt-2 text-white/80">
                            Our team responds within 24 hours. Share your challenge—we’ll help you chart the right path.
                        </p>
                        <Link
                            to="/contact"
                            className="mt-6 inline-flex items-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                        >
                            Contact Us
                            <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}


