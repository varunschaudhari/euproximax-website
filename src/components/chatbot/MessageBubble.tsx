import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { Paperclip, Download } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-5 py-4 shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-500/20'
            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-tl-sm border border-gray-200/80 dark:border-slate-700/80 shadow-gray-200/50 dark:shadow-black/20'
        }`}
      >
        {/* Bot Message */}
        {!isUser && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-xs font-bold">NX</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">Nexa AI</p>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  className="text-sm leading-relaxed text-gray-800 dark:text-slate-200"
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    strong: ({ children }) => (
                      <strong className="font-bold text-gray-900 dark:text-slate-100">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                    code: ({ children }) => (
                      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
              {/* Timestamp for bot */}
              <div className="text-xs mt-3 text-gray-500 dark:text-slate-400 font-medium">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        )}

        {/* User Message */}
        {isUser && (
          <div>
            <div className="prose prose-sm max-w-none prose-invert">
              <ReactMarkdown
                className="text-sm leading-relaxed text-white"
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2 text-white/90">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2 text-white/90">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
            
            {/* File Attachments */}
            {message.files && message.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.files.map((file, index) => (
                  <a
                    key={index}
                    href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-3.5 py-2.5 text-xs text-white transition-all duration-200 hover:scale-[1.02] border border-white/20"
                  >
                    <Paperclip size={14} className="flex-shrink-0" />
                    <span className="truncate flex-1 font-medium">{file.originalName}</span>
                    <Download size={14} className="flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}
            
            {/* Timestamp for user */}
            <div className="text-xs mt-3 text-blue-100 font-medium">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
