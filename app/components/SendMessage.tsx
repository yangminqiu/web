'use client'

import React, { useState } from 'react'

interface SendMessageProps {
  onSend: (message: string) => void
  isDisabled?: boolean
}

const SendMessage = ({ onSend, isDisabled }: SendMessageProps) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isDisabled) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-4 max-w-3xl mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入您的问题..."
          disabled={isDisabled}
          className="flex-1 rounded-xl px-4 py-3 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </form>
  )
}

export default SendMessage 