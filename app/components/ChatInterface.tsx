'use client'

import React, { useState, useRef, useEffect } from 'react'
import { SendMessage } from '.'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'

interface ChatInterfaceProps {
  messages: {
    content: string
    isUser: boolean
    role: string
    timestamp: Date
    userId: string
  }[]
  onSendMessage: (message: string) => Promise<void>
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages = [], onSendMessage }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (content: string) => {
    if (!onSendMessage) return
    setIsLoading(true)
    try {
      await onSendMessage(content)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      const plainText = text.replace(/```[\s\S]*?```/g, '')
                          .replace(/`([^`]+)`/g, '$1')
                          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                          .trim()
      await navigator.clipboard.writeText(plainText)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
              <div className="animate-pulse">正在思考...</div>
            </div>
          </div>
        )}
        {Array.isArray(messages) && messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className="relative group max-w-[80%]">
              <div className={`
                px-4 py-2 rounded-2xl
                ${message.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}
              `}>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    className="whitespace-pre-wrap"
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {!message.isUser && (
                  <button
                    onClick={() => handleCopy(message.content, index)}
                    className={`
                      absolute bottom-2 right-2
                      px-2 py-1 text-xs rounded
                      transition-all duration-200
                      ${copiedIndex === index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300'}
                    `}
                  >
                    <span className="flex items-center gap-1">
                      {copiedIndex === index ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          已复制
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          复制
                        </>
                      )}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <SendMessage 
          onSend={handleSend}
          isDisabled={isLoading}
        />
      </div>
    </div>
  )
}

export default ChatInterface