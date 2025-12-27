import { post, get } from '../utils/apiClient'

export interface ChatConversation {
  _id: string
  sessionId: string
  userName?: string
  userEmail?: string
  userMobile?: string
  mainIdea?: string
  status: 'active' | 'completed' | 'abandoned'
  messageCount: number
  createdAt: string
  lastMessageAt: string
  noveltyAnalysis?: {
    score: number
    confidence: number
    aiAnalysis: string
    similarIdeas: Array<{
      conversationId: string
      similarityScore: number
      matchedText: string
    }>
    analyzedAt: string
  }
}

export interface ChatMessage {
  _id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  files?: Array<{
    filename: string
    originalName: string
    path: string
    size: number
    mimeType: string
  }>
}

export interface CreateConversationPayload {
  sessionId?: string
  userName?: string
  userEmail?: string
  userMobile?: string
  userPassword?: string
}

export interface SendMessagePayload {
  sessionId: string
  message: string
  analyzeNovelty?: boolean
  userName?: string
  userEmail?: string
  userMobile?: string
  files?: File[]
}

export interface SendMessageResponse {
  userMessage: ChatMessage
  assistantMessage: ChatMessage
  noveltyAnalysis?: ChatConversation['noveltyAnalysis']
}

export const createOrGetConversation = (payload: CreateConversationPayload) => {
  return post<ChatConversation>('/chatbot/conversation', payload, {
    skipAuth: true
  })
}

export const sendMessage = (payload: SendMessagePayload) => {
  // If files are included, use FormData
  if (payload.files && payload.files.length > 0) {
    const formData = new FormData()
    formData.append('sessionId', payload.sessionId)
    formData.append('message', payload.message)
    if (payload.analyzeNovelty !== undefined) {
      formData.append('analyzeNovelty', payload.analyzeNovelty.toString())
    }
    if (payload.userName) formData.append('userName', payload.userName)
    if (payload.userEmail) formData.append('userEmail', payload.userEmail)
    if (payload.userMobile) formData.append('userMobile', payload.userMobile)
    
    payload.files.forEach((file) => {
      formData.append(`files`, file)
    })

    return post<SendMessageResponse>('/chatbot/message', formData, {
      skipAuth: true,
      isFormData: true
    })
  }

  // Otherwise, use JSON
  return post<SendMessageResponse>('/chatbot/message', payload, {
    skipAuth: true
  })
}

export const getConversation = (sessionId: string) => {
  return get<{ conversation: ChatConversation; messages: ChatMessage[] }>(
    `/chatbot/conversation/${sessionId}`,
    { skipAuth: true }
  )
}

