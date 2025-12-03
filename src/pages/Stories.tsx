import { motion } from 'framer-motion'
import { Lightbulb, Award, TrendingUp } from 'lucide-react'

export default function Stories() {
  const stories = [
    {
      title: 'Thomas Edison - The Light Bulb',
      icon: Lightbulb,
      description: 'Edison\'s persistence in developing the incandescent light bulb led to over 1,000 patents. His innovation transformed the world and demonstrated the power of protecting intellectual property.',
      lesson: 'Persistence and IP protection go hand in hand',
    },
    {
      title: 'James Dyson - The Vacuum Cleaner',
      icon: Award,
      description: 'Dyson created 5,127 prototypes before perfecting his bagless vacuum cleaner. His patents protected his innovation and allowed him to build a global brand.',
      lesson: 'Prototyping and patents create competitive advantage',
    },
    {
      title: 'Innovation Through Protection',
      icon: TrendingUp,
      description: 'Countless innovators have used patents to protect their ideas, secure funding, and build successful businesses. IP protection is the foundation of innovation.',
      lesson: 'IP protection enables innovation and growth',
    },
  ]

  return (
    <div className="min-h-screen py-20 bg-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-text mb-4">Patent Stories</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Inspiring stories of innovators who protected their ideas and changed the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-8 rounded-lg shadow-md"
            >
              <story.icon className="text-primary mb-4" size={48} />
              <h3 className="text-2xl font-bold text-text mb-4">{story.title}</h3>
              <p className="text-muted mb-4 leading-relaxed">{story.description}</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-primary">{story.lesson}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

