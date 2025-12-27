import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { Message } from './types'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  isTyping: boolean
  noveltyAnalysis?: any
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, noveltyAnalysis }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const hasScrolledToTop = useRef(false)
  const previousMessagesLength = useRef(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0
    }
  }

  // Scroll to top when page first opens (after messages are loaded)
  useEffect(() => {
    if (!hasScrolledToTop.current && messages.length > 0 && messagesContainerRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToTop()
        hasScrolledToTop.current = true
        previousMessagesLength.current = messages.length
      }, 100)
    }
  }, [messages.length])

  // Auto-scroll to bottom for new messages (after initial scroll to top)
  useEffect(() => {
    if (hasScrolledToTop.current && messages.length > previousMessagesLength.current) {
      scrollToBottom()
      previousMessagesLength.current = messages.length
    }
  }, [messages.length, isTyping])

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-green-600'
    if (score >= 50) return 'from-amber-500 to-orange-600'
    if (score >= 30) return 'from-orange-500 to-red-600'
    return 'from-red-500 to-rose-600'
  }

  // Get score label
  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'High Novelty'
    if (score >= 50) return 'Moderate Novelty'
    if (score >= 30) return 'Low Novelty'
    return 'Limited Novelty'
  }

  return (
    <div ref={messagesContainerRef} className="w-full h-full overflow-y-auto px-4 sm:px-6 py-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-slate-950 dark:to-slate-900 chat-scrollbar">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={message.id || `msg-${index}-${message.timestamp.getTime()}`} message={message} />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 border border-gray-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-xs font-bold">NX</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Novelty Assessment Card */}
        {noveltyAnalysis && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-800 dark:to-slate-900/50 border-2 border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/30">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 tracking-tight">Patent Novelty Assessment</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">AI-Powered Analysis</p>
                </div>
              </div>

              {/* Score Display */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Novelty Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(noveltyAnalysis.score)} bg-clip-text text-transparent`}>
                      {noveltyAnalysis.score}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">/100</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreColor(noveltyAnalysis.score)} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${noveltyAnalysis.score}%` }}
                  ></div>
                </div>

                {/* Score Label */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-semibold ${getScoreColor(noveltyAnalysis.score).includes('emerald') ? 'text-emerald-600 dark:text-emerald-400' : getScoreColor(noveltyAnalysis.score).includes('amber') ? 'text-amber-600 dark:text-amber-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {getScoreLabel(noveltyAnalysis.score)}
                  </span>
                  {noveltyAnalysis.confidence && (
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                      Confidence: <span className="font-semibold text-gray-700 dark:text-slate-300">{noveltyAnalysis.confidence}%</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Analysis Text */}
              <div className="pt-4 border-t border-gray-200/80 dark:border-slate-700/80">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                  {noveltyAnalysis.aiAnalysis}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
