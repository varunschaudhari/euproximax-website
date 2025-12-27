export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  files?: Array<{
    filename: string
    originalName: string
    path: string
    size: number
    mimeType: string
  }>
}

export type MessageSender = 'user' | 'bot'

