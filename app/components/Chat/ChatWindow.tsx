'use client'

import React, { useEffect, useState } from 'react'
import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '@/app/utils/firebase'
import { useAuth } from '@/app/contexts/AuthContext'
import ChatInterface from '../ChatInterface'

// 定义消息类型
interface ChatMessage {
  content: string
  isUser: boolean
  role: string
  timestamp: Date
  userId: string
}

// 定义组件 Props 类型
interface ChatWindowProps {
  onNeedAuth: () => void
  isLoggedIn: boolean
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onNeedAuth, isLoggedIn }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([{
    content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
    isUser: false,
    role: "assistant",
    timestamp: new Date(),
    userId: 'system'
  }])

  useEffect(() => {
    if (!user) return

    const messagesRef = collection(db, `users/${user.uid}/messages`)
    const q = query(messagesRef, orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[]
      setMessages(newMessages)
    })

    return () => unsubscribe()
  }, [user])

  const handleNewMessage = async (content: string): Promise<void> => {
    if (!isLoggedIn) {
      onNeedAuth()
      return
    }

    if (!user) return

    try {
      // 添加用户消息
      const userMessage: ChatMessage = {
        content,
        isUser: true,
        role: 'user',
        timestamp: new Date(),
        userId: user.uid
      }

      setMessages(prev => [userMessage, ...prev])

      // 调用 AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: content
          }]
        })
      })

      if (!response.ok) {
        throw new Error('API 请求失败')
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      // 添加 AI 响应
      const aiMessage: ChatMessage = {
        content: data.content,
        isUser: false,
        role: 'assistant',
        timestamp: new Date(),
        userId: 'ai'
      }

      setMessages(prev => [aiMessage, ...prev])

    } catch (error) {
      console.error('消息处理错误:', error)
      setMessages(prev => [{
        content: "抱歉，发生了错误，请稍后重试。",
        isUser: false,
        role: "assistant",
        timestamp: new Date(),
        userId: 'system'
      }, ...prev])
    }
  }

  return (
    <div className="h-full">
      <ChatInterface
        messages={messages}
        onSendMessage={handleNewMessage}
      />
    </div>
  )
}

export default ChatWindow 