'use client'

import React, { useState, useRef } from 'react'
import { MessageBubble, SendMessage } from '.'
import { chatWithAI } from '@/app/utils/api'

interface Message {
  content: string
  isUser: boolean
  role: string
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([{
    content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
    isUser: false,
    role: "assistant"
  }])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (message: string) => {
    try {
      // 添加用户消息
      const userMessage = {
        content: message,
        isUser: true,
        role: "user"
      }
      setMessages(prev => [...prev, userMessage])
      setIsLoading(true)

      // 准备 API 消息
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      apiMessages.push({ role: "user", content: message })

      // 获取 AI 响应
      const aiResponse = await chatWithAI(apiMessages)
      
      // 添加 AI 响应
      setMessages(prev => [...prev, {
        content: aiResponse,
        isUser: false,
        role: "assistant"
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        content: "抱歉，发生了错误，请稍后重试。",
        isUser: false,
        role: "assistant"
      }])
    } finally {
      setIsLoading(false)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        />
      </div>
    </div>
  )
}

export default ChatInterface