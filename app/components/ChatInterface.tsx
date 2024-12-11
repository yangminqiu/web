'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageBubble, SendMessage } from '.'
import { chatWithAI } from '@/app/utils/api'

interface Message {
  content: string
  isUser: boolean
  timestamp: Date
  role: string
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }
    return [{
      content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
      isUser: false,
      timestamp: new Date(),
      role: "assistant"
    }]
  })
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [messages, isLoading])

  const handleSendMessage = async (message: string) => {
    const userMessage = {
      content: message,
      isUser: true,
      timestamp: new Date(),
      role: "user"
    }
    setMessages(prev => [...prev, userMessage])
    
    setIsLoading(true)
    try {
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      apiMessages.push({ role: "user", content: message })

      const aiResponse = await chatWithAI(apiMessages)
      
      setMessages(prev => [...prev, {
        content: aiResponse || "抱歉，我现在无法回答这个问题",
        isUser: false,
        timestamp: new Date(),
        role: "assistant"
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        content: "抱歉，发生了一些错误，请稍后重试。",
        isUser: false,
        timestamp: new Date(),
        role: "assistant"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
              <div className="animate-pulse">正在思考...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <SendMessage 
          onSend={handleSendMessage} 
          isDisabled={isLoading}
          inputRef={inputRef}
        />
      </div>
    </div>
  )
}

export default ChatInterface