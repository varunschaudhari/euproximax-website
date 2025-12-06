import { motion } from 'framer-motion'
import { Lightbulb, Award, TrendingUp, Zap, FileText, Globe, ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { handleImageError } from '../utils/imageErrorHandler'

export default function Story() {
  const stories = [
    {
      number: '01',
      title: 'Idea → Patent Pending',
      description: 'Start with protection from day one',
    },
    {
      number: '02',
      title: 'Prototype → Market',
      description: 'Build with confidence and validation',
    },
    {
      number: '03',
      title: 'Global IP Strategy',
      description: 'Scale your protection worldwide',
    },
  ]

  const patentStories = [
    {
      title: 'Thomas Edison — Lighting Up a Patented System',
      filed: '1879',
      granted: '1880 (U.S. light bulb patent)',
      strategy: 'Iterative patents protecting the whole ecosystem',
      description: 'Edison\'s triumph wasn\'t a single bulb—it was a system: durable filaments, standardized sockets, switches, and power distribution. By patenting key pieces over time, he created a protective moat around the solution and the supporting infrastructure. That strategy allowed manufacturing, licensing, and investment to flourish around a clear, defensible position.',
      benefit: 'Broad, layered protection enabled Edison to commercialize safely, license confidently, and reinvest in R&D without immediate copycats.',
      image: 'https://euproximax.com/uploads/stories/1762188657_1760846481_thomas.jpg',
    },
    {
      title: 'Wright Brothers — Patenting Control, Not Just Flight',
      granted: '1906',
      focus: 'Three‑axis control mechanism',
      impact: 'Licensing funded continued development',
      description: 'While many attempted powered flight, the Wrights patented the control that made flight practical and repeatable. Their claims centered on coordinated roll, pitch, and yaw—ideas that shaped early aviation. Patents transformed technical insight into leverage for partnerships, demonstrations, and revenue.',
      benefit: 'Protection of the pivotal control concept opened the path to licensing, legitimizing their work and funding future innovation.',
      image: 'https://euproximax.com/uploads/stories/1762188732_1760846523_wright.jpeg',
    },
    {
      title: 'James Dyson — 5,000 Prototypes to a Protected Principle',
      launch: '1983 (UK)',
      focus: 'Cyclonic separation airflow',
      lesson: 'Clear claims around a core engineering idea',
      description: 'Dyson persisted through thousands of prototypes to perfect bagless suction using cyclonic separation. By claiming the airflow path and separation principle, the patents protected the reason the product worked so well. The result: a premium category and global brand built on engineering clarity.',
      benefit: 'Protection of the key performance mechanism discouraged me‑too products and attracted retail partners at scale.',
      image: 'https://euproximax.com/uploads/stories/1762188746_1760846539_james.jpeg',
    },
    {
      title: 'Sara Blakely — Simple Idea, Strong Claim',
      filed: '~2000',
      granted: '~2001',
      category: 'Apparel innovation',
      description: 'Blakely turned a straightforward garment concept into a protected niche. A focused patent application, early prototypes, and persistent pitching won shelf space and consumer love. Her story shows how practical improvements, filed early and clearly, can build billion‑dollar brands.',
      benefit: 'Exclusive rights in a new sub‑category enabled rapid retail growth and brand moat.',
      image: 'https://euproximax.com/uploads/stories/1762188756_1760846554_sara.jpeg',
    },
    {
      title: 'University Team (India) — PPA to PCT',
      started: '2021',
      path: 'Provisional → MVP pilots → PCT',
      outcome: 'Grants, partners, and licensing',
      description: 'A campus idea matured into a working MVP. The team filed a Provisional Patent Application to secure the date, showcased to industry under NDA, and validated performance. With letters of intent in place, they entered the PCT route to keep options open for key markets while refining claims.',
      benefit: 'Early "patent pending" status allowed open demos and fundraising while preserving novelty internationally.',
      image: 'https://euproximax.com/uploads/stories/1762188767_1760846569_team.jpg',
    },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-secondary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Patent Stories — Protect Early, Win Big
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/90 leading-relaxed">
              Real journeys from classic icons to modern founders. Each proves the same truth: even small, early-stage ideas deserve protection—because patents create room to grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-2xl font-bold text-text mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Stories */}
      <section className="py-20 bg-bg">
        <div className="container-custom">
          <div className="space-y-24">
            {patentStories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-xl">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">{story.title}</h2>
                  
                  <div className="space-y-4 mb-6">
                    {story.filed && (
                      <div className="flex items-center gap-2">
                        <FileText className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Filed:</strong> {story.filed}</span>
                      </div>
                    )}
                    {story.granted && (
                      <div className="flex items-center gap-2">
                        <Award className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Granted:</strong> {story.granted}</span>
                      </div>
                    )}
                    {story.launch && (
                      <div className="flex items-center gap-2">
                        <Zap className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>First Launch:</strong> {story.launch}</span>
                      </div>
                    )}
                    {story.started && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Started:</strong> {story.started}</span>
                      </div>
                    )}
                    {story.strategy && (
                      <div className="flex items-center gap-2">
                        <Globe className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Strategy:</strong> {story.strategy}</span>
                      </div>
                    )}
                    {story.focus && (
                      <div className="flex items-center gap-2">
                        <Lightbulb className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Focus:</strong> {story.focus}</span>
                      </div>
                    )}
                    {story.path && (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Path:</strong> {story.path}</span>
                      </div>
                    )}
                    {story.outcome && (
                      <div className="flex items-center gap-2">
                        <Award className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Outcome:</strong> {story.outcome}</span>
                      </div>
                    )}
                    {story.category && (
                      <div className="flex items-center gap-2">
                        <FileText className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Category:</strong> {story.category}</span>
                      </div>
                    )}
                    {story.lesson && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Lesson:</strong> {story.lesson}</span>
                      </div>
                    )}
                    {story.impact && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-primary" size={20} />
                        <span className="text-gray-600"><strong>Impact:</strong> {story.impact}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed text-lg mb-6">{story.description}</p>
                  
                  <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-primary font-semibold mb-1">Patent Benefit:</p>
                    <p className="text-gray-700">{story.benefit}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Story Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-700 to-secondary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Story — Edison‑Style Path, Today</h2>
            <p className="text-xl mb-8 text-white/90">
              Start: <strong>Now</strong> • Steps: NDA → Prior‑Art → MVP → File → Iterate
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 text-left">
              <h3 className="text-2xl font-bold mb-6">Markets:</h3>
              <p className="text-lg mb-6 text-white/90 leading-relaxed">
                Even if your concept is at a napkin sketch stage, protect it. We guide you through rapid research, feasibility, and MVPs. File a Provisional (India/US), draft for Utility/Design, and plan for PCT if global markets matter. Iterate like Edison—file improvements as you sharpen performance and UX.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="text-white/80 mb-2"><strong>Idea Title:</strong> e.g., AI‑assisted sampling nozzle</p>
                  <p className="text-white/80 mb-2"><strong>Key Novelty:</strong> e.g., dual‑stage micro‑separation</p>
                  <p className="text-white/80"><strong>Prototype Plan:</strong> e.g., SLA shell + sensor dev board</p>
                </div>
                <div>
                  <p className="text-white/80 mb-2"><strong>Patent Step:</strong> PPA in 2 weeks; Utility draft in 6–8 weeks</p>
                  <p className="text-white/80"><strong>Markets:</strong> IN, US, AU, EP via PCT</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-xl font-semibold mb-2">Moral of the Story:</p>
              <p className="text-lg text-white/90">
                Even a small or early‑phase idea gains leverage when protected. Patents buy you time to learn, improve, and lead.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              Start Your Patent Journey
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Takeaway Section */}
      <section className="py-20 bg-surface">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">The Takeaway</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Protect early, iterate boldly. Patents don't freeze ideas—they free you to test in public, approach partners, and build value with less fear of fast followers.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

