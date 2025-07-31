'use client'

import { useState, useRef, useEffect } from 'react'
import type { Database } from '@/lib/types/database'

type VisionChat = Database['public']['Tables']['vision_chats']['Row']

interface ChatInterfaceProps {
  chats: VisionChat[]
  onSubmit: (message: string) => void
  isProcessing: boolean
  hasVision: boolean
}

export function ChatInterface({ chats, onSubmit, isProcessing, hasVision }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isProcessing) {
      onSubmit(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const suggestedPrompts = hasVision
    ? [
        "How can I align my daily work with my mission?",
        "What skills should I develop to achieve my goals?",
        "How do I balance my values with practical constraints?",
      ]
    : [
        "Help me define my professional mission",
        "What values should guide my career decisions?",
        "How do I identify meaningful long-term goals?",
      ]

  return (
    <div className="card flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted mb-4">
              {hasVision
                ? "Let's explore how to bring your vision to life."
                : "Start by sharing your aspirations and goals."}
            </p>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(prompt)}
                  className="block w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    chat.role === 'user'
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-primary'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-primary rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-muted/20 pt-4">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasVision ? "Ask about your vision..." : "Share your thoughts..."}
            className="flex-1 input resize-none min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className="btn-primary px-4 self-end"
          >
            {isProcessing ? '...' : '→'}
          </button>
        </div>
      </form>
    </div>
  )
}