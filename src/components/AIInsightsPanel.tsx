import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  MessageSquare,
  Zap,
  BarChart3,
  TrendingUp,
  X
} from 'lucide-react'
import { clsx } from 'clsx'
import { useAI } from '../hooks/useAI'
import { useSettings } from '../hooks/useSettings'
import { MarkdownMessage } from './MarkdownMessage'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  { icon: BarChart3, label: 'Summarize performance', prompt: 'Give me a quick summary of overall sales performance' },
  { icon: TrendingUp, label: 'Growth insights', prompt: 'What are the key growth trends I should know about?' },
  { icon: Zap, label: 'Top opportunities', prompt: 'What are the top opportunities to improve revenue?' },
]

export function AIInsightsPanel() {
  const { settings } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingContent, setStreamingContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    isLoading,
    error,
    remainingUses,
    isLimitReached,
    blockedMessage,
    sendMessage,
    clearError,
  } = useAI({
    streaming: settings.ai.streaming,
    onStream: (chunk) => {
      setStreamingContent(prev => prev + chunk)
    }
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!input.trim() || isLoading || isLimitReached) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setStreamingContent('')

    const response = await sendMessage(userMessage)
    
    if (response) {
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setStreamingContent('')
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (isLoading || isLimitReached) return

    setMessages(prev => [...prev, { role: 'user', content: prompt }])
    setStreamingContent('')

    const response = await sendMessage(prompt)
    
    if (response) {
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setStreamingContent('')
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-6 right-6 z-40',
          'flex items-center gap-2 px-5 py-3 rounded-full',
          'bg-gradient-to-r from-accent to-accent-dark',
          'text-surface-950 font-semibold',
          'shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30',
          'transform hover:scale-105 transition-all duration-200',
          isOpen && 'hidden'
        )}
      >
        <Sparkles className="w-5 h-5" />
        <span>AI Insights</span>
        {!isLimitReached && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-surface-950/20 text-xs">
            {remainingUses} left
          </span>
        )}
      </button>

      {/* AI Panel */}
      <div className={clsx(
        'fixed bottom-6 right-6 z-50',
        'w-[420px] max-h-[600px]',
        'bg-surface-900/95 backdrop-blur-xl',
        'border border-surface-700/50 rounded-2xl',
        'shadow-2xl shadow-black/50',
        'flex flex-col overflow-hidden',
        'transform transition-all duration-300',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-surface-100">AI Insights</h3>
              <p className="text-xs text-surface-500">Powered by {settings.ai.provider.charAt(0).toUpperCase() + settings.ai.provider.slice(1)}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5 text-surface-400" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {messages.length === 0 && !isLimitReached && (
            <div className="space-y-4">
              <p className="text-surface-400 text-sm text-center">
                Ask questions about your dashboard data
              </p>
              
              <div className="space-y-2">
                {QUICK_PROMPTS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(item.prompt)}
                    disabled={isLoading}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-xl',
                      'bg-surface-800/50 hover:bg-surface-800',
                      'border border-surface-700/30 hover:border-accent/30',
                      'text-left transition-all duration-200',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    <item.icon className="w-4 h-4 text-accent" />
                    <span className="text-surface-200 text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLimitReached && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <AlertCircle className="w-12 h-12 text-warning mb-4" />
              <p className="text-surface-300 whitespace-pre-line text-sm">
                {blockedMessage}
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <MarkdownMessage
                content={message.content}
                isUser={message.role === 'user'}
              />
            </div>
          ))}

          {streamingContent && (
            <div className="flex justify-start">
              <MarkdownMessage content={streamingContent} isUser={false} />
            </div>
          )}

          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-surface-800">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-danger text-sm whitespace-pre-line">{error}</p>
                <button
                  onClick={clearError}
                  className="text-surface-400 text-xs hover:text-surface-300 mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-surface-700/50">
          {!isLimitReached && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your data..."
                  disabled={isLoading}
                  className={clsx(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-surface-800 border border-surface-700',
                    'text-surface-100 placeholder:text-surface-500',
                    'focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20',
                    'disabled:opacity-50',
                    'transition-all duration-200'
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={clsx(
                  'p-3 rounded-xl',
                  'bg-accent hover:bg-accent-light',
                  'text-surface-950',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          )}
          
          <div className="flex items-center justify-between mt-3 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {isLimitReached ? 'Limit reached' : `${remainingUses} prompts remaining`}
            </span>
            <span>Demo mode</span>
          </div>
        </div>
      </div>
    </>
  )
}
