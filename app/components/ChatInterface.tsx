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
    // 从 localStorage 加载历史消息
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      // 将时间戳字符串转换回 Date 对象
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

  // 保存消息到 localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (message: string) => {
    // 添加用户消息
    const userMessage = {
      content: message,
      isUser: true,
      timestamp: new Date(),
      role: "user"
    }
    setMessages(prev => [...prev, userMessage])
    
    setIsLoading(true)
    try {
      // 准备发送给 API 的消息格式
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      apiMessages.push({ role: "user", content: message })

      // 调用 AI API
      const aiResponse = await chatWithAI(apiMessages)
      
      // 添加 AI 响应
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

  const handleClearChat = () => {
    setMessages([{
      content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
      isUser: false,
      timestamp: new Date(),
      role: "assistant"
    }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      {/* 聊天记录区域 */}
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

      {/* 工具栏 */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClearChat}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          清空对话
        </button>
      </div>

      {/* 发送消息区域 */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <SendMessage onSend={handleSendMessage} isDisabled={isLoading} />
      </div>
    </div>
  )
}

export default ChatInterface