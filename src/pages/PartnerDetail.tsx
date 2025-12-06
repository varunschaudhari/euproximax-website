import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Mail, Phone } from 'lucide-react'

// Partner data - should match the data in About.tsx
const partnersData: Record<string, {
    name: string
    location: string
    role: string
    email?: string
    phone?: string
    bio?: string
    expertise?: string[]
    image?: string
}> = {
    'tanaya-chaudhari': {
        name: 'Tanaya Chaudhari',
        location: 'INDIA',
        role: 'Administrative Assistant – EuProximaX Innovation Services',
        email: 'tanaya@euproximax.com',
        bio: 'Tanaya Chaudhari is the Administrative Assistant at EuProximaX Innovation Services. She provides vital support in managing daily operations, coordinating with stakeholders, and ensuring smooth execution of administrative tasks. Her responsibilities include handling documentation, assisting with regulatory and tax-related activities, and supporting company leadership in internal communications and logistics. Tanaya plays an essential role in maintaining the operational backbone of the organization.',
        expertise: ['Administrative Management', 'Documentation', 'Regulatory Compliance', 'Tax Activities', 'Internal Communications', 'Logistics Coordination'],
        image: '/tanaya-chaudhari.jpg',
    },
    'dr-jyoti-chaudhari': {
        name: 'Dr. Jyoti Chaudhari',
        location: 'INDIA',
        role: 'Strategic Advisor & Founder – EuProximaX Innovation Services',
        email: 'jyoti@euproximax.com',
        bio: 'Dr. Jyoti Adhar Chaudhari is the Founder and Strategic Advisor of EuProximaX Innovation Services, where she leads initiatives that connect education, research, and entrepreneurship to accelerate idea-to-impact innovation. A distinguished academic and visionary leader, she has spent over a decade mentoring students, educators, and professionals in fields related to institutional growth, innovation policy, and creative problem-solving. Her leadership philosophy emphasizes empowering individuals to transform learning into practical innovation through collaboration and structured guidance. Under her direction, EuProximaX has evolved into a leading platform supporting patent registration, prototype development, research collaboration, and academic–industry partnerships, serving as a bridge between creativity and commercialization.\n\nDr. Chaudhari has conceptualized and launched pioneering programs such as Patent Writing Retreats, Research Focus Groups, and Innovation & Career Development Workshops, designed to cultivate a culture of intellectual property awareness and entrepreneurial thinking among educators, researchers, and young innovators.\n\nShe is widely recognized for her commitment to integrating educational excellence with innovation-driven growth. Her strategic mentorship promotes a mindset where knowledge creation, intellectual property protection, and societal contribution coexist as core values of progress.\n\nHer guiding principle—"Your Idea is Your Property™"—reflects EuProximaX\'s mission to empower every innovator to protect and elevate their intellectual contributions. Through her leadership, Dr. Chaudhari continues to inspire multidisciplinary collaboration, inclusivity in innovation, and the transformation of visionary concepts into tangible, real-world impact.',
        expertise: ['Strategic Planning', 'Innovation Management', 'IP Strategy', 'Leadership', 'Business Development', 'Educational Excellence', 'Research Collaboration', 'Academic-Industry Partnerships', 'Entrepreneurship', 'Mentorship'],
        image: '/jyoti-chaudhari.jpg',
    },
    'prerana-chaudhari': {
        name: 'Prerana Chaudhari',
        location: 'INDIA',
        role: 'Project Manager (South Asia & India)– EuProximaX Innovation Services',
        email: 'prerana@euproximax.com',
        bio: 'Prerana Chaudhari serves as the Project Manager & Coordinator at EuProximaX Innovation Services. She is responsible for managing project timelines, documentation, and communication across multiple innovation and client engagements. With a strong focus on organization and collaboration, she ensures seamless coordination between internal teams, clients, vendors, and external partners. Her role supports the successful execution of projects from concept to prototype, contributing to the company\'s mission of empowering innovators and startups.',
        expertise: ['Project Management', 'Regional Operations', 'Client Coordination', 'Timeline Management', 'Quality Assurance', 'Documentation', 'Vendor Management', 'Team Collaboration'],
        image: '/prerana-chaudhari.jpg',
    },
    'pravin-shinde': {
        name: 'Pravin Shinde',
        location: 'USA & INDIA',
        role: 'Director of Innovation Services – EuProximaX Innovation Services',
        email: 'pravin@euproximax.com',
        bio: 'Mr. Pravin Shinde brings over 10 years of experience in the pharmaceutical industry, research, and technology innovation. As Director of Innovation Services & Technical Expert at EuProximaX Innovation Services, he leads technical planning and execution for product development and prototyping initiatives. His expertise bridges research and practical implementation, supporting innovators and startups in developing viable, validated, and scalable solutions. He plays a key role in guiding teams through technology-driven innovation and transformation.',
        expertise: ['Innovation Services', 'Strategic Leadership', 'Cross-border Operations', 'Client Success', 'International Business', 'Pharmaceutical Industry', 'Research & Development', 'Technology Innovation', 'Product Development', 'Prototyping', 'Technical Planning'],
        image: '/pravin-shinde.jpg',
    },
    'dr-sandeep-sonawane': {
        name: 'Dr. Sandeep Sonawane',
        location: 'INDIA',
        role: 'Scientific & Academic Collaboration',
        email: 'sandeep.sonawane@euproximax.com',
        bio: 'Dr. Sandeep Sonawane is an External Associate at EuProximaX Innovation Services, supporting scientific innovation and academic collaboration. With a strong background in pharmaceutical education and research, he contributes to project ideation, knowledge exchange, and the development of healthcare-focused innovations. He actively engages in mentoring, scientific advising, and bridging academia with applied innovation to empower students, researchers, and startup teams.',
        expertise: ['Scientific Research', 'Academic Partnerships', 'Research Collaboration', 'Knowledge Transfer', 'Innovation Research', 'Pharmaceutical Education', 'Healthcare Innovation', 'Mentoring', 'Scientific Advising', 'Project Ideation'],
        image: 'https://euproximax.com/uploads/partners/1762190168_Dr.%20Sandeep.jpg',
    },
    'umesh-patil': {
        name: 'Umesh Patil',
        location: 'INDIA',
        role: 'Industrial Professional – External Associate',
        email: 'umesh.patil@euproximax.com',
        bio: 'Umesh Patil brings extensive industrial experience to support client projects and manufacturing initiatives. He provides technical expertise in industrial engineering and manufacturing processes.',
        expertise: ['Industrial Engineering', 'Manufacturing', 'Process Optimization', 'Technical Consulting', 'Production Management'],
        // TODO: Add actual image URL from https://euproximax.com/uploads/partners/
        image: 'https://euproximax.com/uploads/partners/umesh-patil.jpeg',
    },
    'dhananjay-patil': {
        name: 'Dhananjay Patil',
        location: 'INDIA',
        role: 'Industrial Professional – External Associate',
        email: 'dhananjay.patil@euproximax.com',
        bio: 'Dhananjay Patil provides industrial expertise and technical support for various innovation projects. He specializes in industrial design and product development, helping clients bring their ideas to market.',
        expertise: ['Industrial Design', 'Technical Consulting', 'Product Development', 'Manufacturing Support', 'Design Engineering'],
        // TODO: Add actual image URL from https://euproximax.com/uploads/partners/
        image: 'https://euproximax.com/uploads/partners/dhananjay-patil.jpeg',
    },
    'dr-prakash-wankhedkar': {
        name: 'Dr. Prakash Wankhedkar',
        location: 'INDIA',
        role: 'Academic & Research Associate– External Associate EuProximaX Innovation Services',
        email: 'prakash.wankhedkar@euproximax.com',
        bio: 'Dr. Prakash Wankhedkar contributes academic and research expertise to support innovation and development projects. He brings rigorous research methodology and academic rigor to our innovation processes.',
        expertise: ['Academic Research', 'Research Methodology', 'Intellectual Property', 'Research Strategy', 'Academic Collaboration'],
        image: '/prakash-wankhedkar.jpg',
    },
    'harshika-suryawanshi': {
        name: 'Harshika Suryawanshi',
        location: 'INDIA',
        role: 'Digital Development & AI/ML Lead – External Associate',
        email: 'harshika@euproximax.com',
        bio: 'Harshika Suryawanshi leads Digital Development, AI/ML Integration, and Software Innovation at EuProximaX Innovation Services. She specializes in artificial intelligence, machine learning, and full-stack software development, driving the digital backbone of EuProximaX\'s innovation ecosystem.\n\nHer expertise lies in designing and implementing intelligent digital solutions, data-driven platforms, and AI-enabled prototypes that support patentable innovations across domains such as MedTech, CleanTech, and PharmaTech. Harshika plays a key role in transforming conceptual research into functional, scalable, and user-ready applications—bridging scientific innovation with real-world technology deployment.',
        expertise: ['AI/ML Applications', 'Software & Web Development', 'Prototype Design', 'Data Analytics', 'Digital Transformation', 'Machine Learning', 'Full-Stack Development', 'Intelligent Digital Solutions', 'Data-Driven Platforms'],
        image: 'https://euproximax.com/uploads/partners/1762188922_1761145947_1760848012_harshika%20mam.jpg',
    },
    'hemant-suryawanshi': {
        name: 'Hemant Suryawanshi',
        location: 'USA',
        role: 'Business Development (USA, Europe, and Asia) & Innovation Lead- External Associate',
        email: 'hemant@euproximax.com',
        bio: 'Hemant Suryawanshi serves as the Business Development and Innovation Lead at EuProximaX Innovation Services, where he drives strategic collaborations, partnership growth, and commercialization of innovative projects. With over 17 years of professional experience in project management and industrial operations, he brings a strong blend of technical understanding and business acumen to the innovation ecosystem.\n\nAt EuProximaX, Hemant focuses on expanding innovation networks, supporting patent-driven ventures, and facilitating prototype-to-market transitions. His leadership bridges creative research with viable business models, enabling inventors, professionals, and startups to scale their ideas into impactful, real-world solutions.',
        expertise: ['Business Development', 'Innovation Management', 'Strategic Partnerships', 'Project Leadership', 'Commercialization of Patents & Prototypes', 'Global Expansion', 'Market Development', 'International Relations', 'Industrial Operations'],
        image: 'https://euproximax.com/uploads/partners/1762188938_1761151591_1647957911258.jpg',
    },
    'shubham-wagh': {
        name: 'Shubham Wagh',
        location: 'USA',
        role: 'Global Innovation (USA, UK, Canada & India) & Client Partnerships Lead – EuProximaX Innovation Services',
        email: 'shubham@euproximax.com',
        bio: 'Shubham Wagh leads Global Innovation and Client Partnerships at EuProximaX Innovation Services, overseeing patent innovation and prototype development projects across the USA, UK, Canada, and India. With a strong foundation in pharmaceutical engineering, process validation, and technology transfer, he transforms early-stage ideas into patentable and commercially viable prototypes.\n\nDrawing from his experience across biopharmaceutical and medical device industries in the USA, UK, Canada, and Asia, Shubham integrates technical expertise with strategic project management to deliver innovation that meets both regulatory and commercial standards. At EuProximaX, he plays a pivotal role in aligning inventors, researchers, and industrial partners to develop protectable, scalable, and market-ready technologies.\n\nEducation: M.S. Mechanical Engineering – University of Bridgeport, USA',
        expertise: ['Patent & Prototype Development', 'Global Innovation Management', 'Client & Partner Relations', 'Process Validation', 'Technology Integration', 'Pharmaceutical Engineering', 'Technology Transfer', 'Regulatory Compliance', 'Strategic Project Management'],
        image: 'https://euproximax.com/uploads/partners/1762271221_Shubham.jpg',
    },
    'sandeep-narayan-patil': {
        name: 'Sandeep Narayan Patil',
        location: 'UK',
        role: 'Scientific Advisor – External Collaboration, EuProximaX Innovation Services',
        email: 'sandeep.patil@euproximax.com',
        bio: 'Sandeep Narayan Patil provides scientific advisory services and facilitates external collaborations from the UK. He brings international scientific expertise and helps connect global research with innovation opportunities.',
        expertise: ['Scientific Advisory', 'International Collaboration', 'Research Strategy', 'Scientific Consulting', 'Global Research'],
        // TODO: Add actual image URL from https://euproximax.com/uploads/partners/
        image: 'https://euproximax.com/uploads/partners/sandeep-narayan-patil.jpeg',
    },
}

export default function PartnerDetail() {
    const { slug } = useParams<{ slug: string }>()

    if (!slug || !partnersData[slug]) {
        return <Navigate to="/about" replace />
    }

    const partner = partnersData[slug]

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
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-5xl md:text-6xl shadow-xl">
                                    {partner.image ? (
                                        <img
                                            src={partner.image}
                                            alt={partner.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        '👤'
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

