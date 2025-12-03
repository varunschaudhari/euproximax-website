import { motion } from 'framer-motion'

export default function Privacy() {
  return (
    <div className="min-h-screen py-20 bg-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-surface p-8 rounded-lg shadow-md"
        >
          <h1 className="text-5xl font-bold text-text mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">1. Information We Collect</h2>
              <p className="text-muted leading-relaxed">
                We collect information that you provide directly to us, such as when you create
                an account, use our services, contact us, or subscribe to our newsletter.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">2. How We Use Your Information</h2>
              <p className="text-muted leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services,
                process transactions, send you technical notices and support messages, and
                communicate with you about products, services, and events.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">3. Information Sharing</h2>
              <p className="text-muted leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third
                parties without your consent, except as described in this policy. We may share
                your information with service providers who assist us in operating our website
                and conducting our business.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">4. Data Security</h2>
              <p className="text-muted leading-relaxed">
                We implement appropriate technical and organizational security measures to protect
                your personal information against unauthorized access, alteration, disclosure, or
                destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">5. Your Rights</h2>
              <p className="text-muted leading-relaxed">
                You have the right to access, update, or delete your personal information at any
                time. You may also opt-out of receiving promotional communications from us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">6. Contact Us</h2>
              <p className="text-muted leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at
                contact@euproximax.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

