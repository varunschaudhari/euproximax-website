import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import UserInfoForm from './UserInfoForm'
import { Message } from './types'
import { createOrGetConversation, sendMessage, getConversation, ChatMessage } from '../../services/chatbotService'
import { ApiError } from '../../utils/apiClient'
import { MessageCircle, Maximize2, Minimize2, X, Sparkles } from 'lucide-react'

// Generate a unique session ID
const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const ChatWindow: React.FC = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [noveltyAnalysis, setNoveltyAnalysis] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string; mobile?: string } | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const sessionInitialized = useRef(false)
  const [notificationCount, setNotificationCount] = useState(0)

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

  // Initialize with welcome message when chat opens (only if user info is collected)
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId && userInfo && !showUserForm) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        text: "Hello! I'm **Nexa**, your patent novelty assessment assistant. I'm here to help you evaluate your invention idea for patent registration. Please describe your idea, and I'll help assess its novelty and patentability potential. What invention would you like to discuss?",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, sessionId, userInfo, showUserForm])

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
        text: `Hello ${info.name}! I'm **Nexa**, your patent novelty assessment assistant. I'm here to help you evaluate your invention idea for patent registration. Please describe your idea, and I'll help assess its novelty and patentability potential. What invention would you like to discuss?`,
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

      // Reset notification count when chat is opened
      if (isOpen) {
        setNotificationCount(0)
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

  const toggleChat = () => {
    if (isMinimized) {
      // If minimized, maximize it
      setIsMinimized(false)
    } else {
      // Otherwise, toggle open/close
      setIsOpen(!isOpen)
      setIsMinimized(false)
      if (!isOpen) {
        setNotificationCount(0)
      }
    }
  }

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the toggleChat when clicking minimize button
    setIsMinimized(true)
  }

  return (
    <>
      {/* Chat Toggle Button - Always visible when chat is closed */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center z-[9999] group"
          aria-label="Open chat"
        >
          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75 group-hover:opacity-100"></span>
          
          {/* Main button content */}
          <div className="relative z-10 flex items-center justify-center">
            <MessageCircle className="w-7 h-7" strokeWidth={2} />
          </div>

          {/* Notification badge */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}

          {/* Glow effect */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          onClick={isMinimized ? toggleChat : undefined}
          className={`fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl flex flex-col z-[9999] transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-16 cursor-pointer hover:shadow-blue-500/20' : 'h-[650px] max-h-[calc(100vh-3rem)]'
          }`}
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white px-5 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Nexa AI</h3>
                {!isMinimized && (
                  <p className="text-xs text-blue-100/90 font-medium">Patent Novelty Assistant</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {!isMinimized && (
                <>
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-9 h-9 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
                    aria-label="Open in new page"
                    title="Open in full page"
                  >
                    <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={minimizeChat}
                    className="w-9 h-9 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
                    aria-label="Minimize"
                    title="Minimize"
                  >
                    <Minimize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </>
              )}
              <button
                onClick={toggleChat}
                className="w-9 h-9 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* User Info Form */}
              {showUserForm && (
                <UserInfoForm
                  onSubmit={handleUserInfoSubmit}
                  initialData={userInfo || undefined}
                />
              )}

              {/* Messages */}
              {!showUserForm && (
                <MessageList 
                  messages={messages} 
                  isTyping={isTyping} 
                  noveltyAnalysis={noveltyAnalysis} 
                />
              )}

              {/* Input */}
              {!showUserForm && (
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isTyping || !sessionId || !userInfo}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ChatWindow
