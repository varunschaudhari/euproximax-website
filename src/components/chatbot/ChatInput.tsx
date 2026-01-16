import { useState, KeyboardEvent, useRef, ChangeEvent } from 'react'
import { Paperclip, X, Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void
  disabled?: boolean
  allowFileUpload?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled, allowFileUpload = false }) => {
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if ((input.trim() || selectedFiles.length > 0) && !disabled) {
      onSendMessage(input.trim(), selectedFiles.length > 0 ? selectedFiles : undefined)
      setInput('')
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Limit to 5 files max, 10MB each
      const validFiles = files.slice(0, 5).filter(file => file.size <= 10 * 1024 * 1024)
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5))
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="group flex items-center gap-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3.5 py-2.5 text-sm shadow-sm hover:shadow-md transition-all"
            >
              <Paperclip size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-slate-300 truncate max-w-[200px] font-medium">{file.name}</span>
              <span className="text-gray-500 dark:text-slate-400 text-xs">({formatFileSize(file.size)})</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        {allowFileUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || selectedFiles.length >= 5}
              className="flex-shrink-0 w-11 h-11 border-2 border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              aria-label="Attach file"
              title="Attach file (max 5 files, 10MB each)"
            >
              <Paperclip size={20} className="text-gray-600 dark:text-slate-400" />
            </button>
          </>
        )}
        
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe your invention idea for patent novelty assessment..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3.5 pr-12 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 transition-all shadow-sm hover:shadow-md"
            style={{
              minHeight: '52px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`
            }}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={(!input.trim() && selectedFiles.length === 0) || disabled}
          className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:shadow-none disabled:hover:scale-100"
          aria-label="Send message"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs font-mono">Shift+Enter</kbd> for new line
        </p>
        {allowFileUpload && (
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
            Max 5 files, 10MB each
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatInput
