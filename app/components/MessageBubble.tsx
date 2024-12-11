'use client'

import React from 'react'

interface MessageProps {
  message: {
    content: string
    isUser: boolean
    role: string
  }
}

const MessageBubble = ({ message }: MessageProps) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">
          {message.content}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble