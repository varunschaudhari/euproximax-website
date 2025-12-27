import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import UserInfoForm from './UserInfoForm'
import { Message } from './types'
import { createOrGetConversation, sendMessage, getConversation, ChatMessage } from '../../services/chatbotService'
import { ApiError } from '../../utils/apiClient'

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
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  return (
    <>
      {/* Chat Toggle Button - Always visible when chat is closed */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-[9999]"
          aria-label="Open chat"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            backgroundColor: '#2563eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            border: 'none',
            outline: 'none'
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[9999] transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[calc(100vh-3rem)]'
          }`}
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">NX</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Nexa</h3>
                <p className="text-xs text-blue-100">Patent Novelty Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isMinimized && (
                <>
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                    aria-label="Open in new page"
                    title="Open in new page"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={minimizeChat}
                    className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                    aria-label="Minimize"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                </>
              )}
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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

