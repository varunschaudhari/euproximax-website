import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageList from '../components/chatbot/MessageList'
import ChatInput from '../components/chatbot/ChatInput'
import UserInfoForm from '../components/chatbot/UserInfoForm'
import { Message } from '../components/chatbot/types'
import { createOrGetConversation, sendMessage, getConversation, ChatMessage } from '../services/chatbotService'
import { ApiError } from '../utils/apiClient'
import { ArrowLeft, MessageSquare, Sparkles } from 'lucide-react'

// Generate a unique session ID
const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [noveltyAnalysis, setNoveltyAnalysis] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string; mobile?: string } | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const sessionInitialized = useRef(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Initialize session and load conversation
  useEffect(() => {
    const initializeSession = async () => {
      if (sessionInitialized.current) return
      sessionInitialized.current = true

      try {
        // Get or create session ID
        let currentSessionId = localStorage.getItem('proadvisor_session_id')
        if (!currentSessionId) {
          currentSessionId = generateSessionId()
          localStorage.setItem('proadvisor_session_id', currentSessionId)
        }
        setSessionId(currentSessionId)

        // Try to get existing conversation
        try {
          const response = await getConversation(currentSessionId)
          if (response.data.conversation) {
            const conv = response.data.conversation
            // Set user info if available
            if (conv.userName || conv.userEmail || conv.userMobile) {
              setUserInfo({
                name: conv.userName,
                email: conv.userEmail,
                mobile: conv.userMobile
              })
              setShowUserForm(false)
            } else {
              setShowUserForm(true)
            }
            
            if (response.data.messages && response.data.messages.length > 0) {
              // Convert backend messages to frontend format
              const convertedMessages: Message[] = response.data.messages.map((msg: ChatMessage) => ({
                id: msg._id,
                text: msg.content,
                sender: msg.role === 'assistant' ? 'bot' : (msg.role === 'user' ? 'user' : 'bot'),
                timestamp: new Date(msg.createdAt),
                files: msg.files
              }))
              setMessages(convertedMessages)
              
              // Load novelty analysis if available
              if (conv.noveltyAnalysis) {
                setNoveltyAnalysis(conv.noveltyAnalysis)
              }
            }
          } else {
            // No conversation exists, show form
            setShowUserForm(true)
          }
        } catch (error) {
          // Conversation doesn't exist yet, show form
          setShowUserForm(true)
          console.log('No existing conversation found')
        }
      } catch (error) {
        console.error('Failed to initialize session:', error)
      }
    }

    initializeSession()
  }, [])

  // Scroll to top when page opens
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0
    }
  }, [])

  // Initialize with welcome message when user info is collected
  useEffect(() => {
    if (messages.length === 0 && sessionId && userInfo && !showUserForm) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        text: `Hello ${userInfo.name}! I'm **Nexa**, your patent novelty assessment assistant. I'm here to help you evaluate your invention idea for patent registration. Please describe your idea in detail, and I'll help assess its novelty and patentability potential. What invention would you like to discuss?`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length, sessionId, userInfo, showUserForm])

  // Handle user info form submission
  const handleUserInfoSubmit = async (info: { name: string; email: string; mobile: string }) => {
    if (!sessionId) return

    try {
      // Create or update conversation with user info
      await createOrGetConversation({
        sessionId,
        userName: info.name,
        userEmail: info.email,
        userMobile: info.mobile
      })

      setUserInfo(info)
      setShowUserForm(false)

      // Show welcome message after info is collected
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        text: `Hello ${info.name}! I'm **Nexa**, your patent novelty assessment assistant. I'm here to help you evaluate your invention idea for patent registration. Please describe your idea in detail, and I'll help assess its novelty and patentability potential. What invention would you like to discuss?`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Failed to save user info:', error)
      // Still allow chat to continue
      setUserInfo(info)
      setShowUserForm(false)
    }
  }

  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!sessionId) {
      console.error('Session ID not available')
      return
    }

    if (showUserForm || !userInfo) {
      // Don't allow sending messages if user info is not collected
      return
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      text: files && files.length > 0 
        ? `${text}\n\n[${files.length} file(s) attached]`
        : text,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Determine if we should analyze patent novelty (after a few messages to gather enough information)
      const shouldAnalyze = messages.length >= 3

      const response = await sendMessage({
        sessionId,
        message: text,
        analyzeNovelty: shouldAnalyze,
        userName: userInfo?.name,
        userEmail: userInfo?.email,
        userMobile: userInfo?.mobile,
        files: files
      })

      // Update user message with real ID
      setMessages((prev) => prev.map(msg => 
        msg.id === userMessage.id 
          ? {
              id: response.data.userMessage._id,
              text: response.data.userMessage.content,
              sender: 'user' as const,
              timestamp: new Date(response.data.userMessage.createdAt),
              files: response.data.userMessage.files
            }
          : msg
      ))

      // Add assistant message
      const assistantMessage: Message = {
        id: response.data.assistantMessage._id,
        text: response.data.assistantMessage.content,
        sender: 'bot',
        timestamp: new Date(response.data.assistantMessage.createdAt)
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Update novelty analysis if provided
      if (response.data.noveltyAnalysis) {
        setNoveltyAnalysis(response.data.noveltyAnalysis)
      }
    } catch (error) {
      const apiError = error as ApiError
      // Remove user message on error
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id))
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `I apologize, but I encountered an error: ${apiError.message || 'Unable to process your message'}. Please try again.`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Go back"
              >
                <ArrowLeft size={22} className="text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors" />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Nexa AI Assistant</h1>
                  <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Patent Novelty Assessment</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Discuss Your Invention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Chat Container with Modern Design */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)]">
            {/* User Info Form */}
            {showUserForm && (
              <div className="flex-1 overflow-y-auto">
              <UserInfoForm
                onSubmit={handleUserInfoSubmit}
                initialData={userInfo || undefined}
              />
              </div>
            )}

            {/* Messages Area */}
            {!showUserForm && (
              <>
                <div className="flex-1 overflow-y-auto min-h-0">
                  <MessageList 
                    messages={messages} 
                    isTyping={isTyping} 
                    noveltyAnalysis={noveltyAnalysis} 
                  />
                </div>

                {/* Input Area with Enhanced Design */}
                <div className="border-t border-gray-200/80 dark:border-slate-700/80 bg-gradient-to-b from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-900/50 backdrop-blur-sm">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isTyping || !sessionId || !userInfo}
                    allowFileUpload={true}
                  />
                </div>
              </>
            )}
          </div>

          {/* Enhanced Info Section */}
          {!showUserForm && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-lg shadow-blue-100/50 dark:shadow-blue-950/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100 mb-3 tracking-tight">
              How to Discuss Your Invention Effectively
            </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      'Describe your invention clearly and in detail',
                      'Explain the problem your invention solves',
                      'Highlight unique features and technical innovations',
                      'Share technical specifications and implementation details',
                      'Upload relevant files, diagrams, or documents',
                      'Nexa will automatically analyze novelty after a few messages'
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{tip}</span>
                      </div>
                    ))}
          </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
