import { motion } from 'framer-motion'

export default function Terms() {
  return (
    <div className="min-h-screen py-20 bg-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-surface p-8 rounded-lg shadow-md"
        >
          <h1 className="text-5xl font-bold text-text mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted leading-relaxed">
                By accessing and using EuProximaX services, you accept and agree to be bound by
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">2. Use License</h2>
              <p className="text-muted leading-relaxed">
                Permission is granted to temporarily access the materials on EuProximaX's website
                for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">3. Disclaimer</h2>
              <p className="text-muted leading-relaxed">
                The materials on EuProximaX's website are provided on an 'as is' basis. EuProximaX
                makes no warranties, expressed or implied, and hereby disclaims and negates all
                other warranties including, without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">4. Limitations</h2>
              <p className="text-muted leading-relaxed">
                In no event shall EuProximaX or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use the materials on
                EuProximaX's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">5. Revisions</h2>
              <p className="text-muted leading-relaxed">
                EuProximaX may revise these terms of service at any time without notice. By using
                this website you are agreeing to be bound by the then current version of these
                terms of service.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

