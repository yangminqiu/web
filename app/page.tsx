'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const ChatInterface = dynamic(() => import('@/app/components/ChatInterface'), {
  ssr: false
})

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-500 text-white py-4">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">
            AI 智能助手
          </h1>
        </div>
      </div>
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}

export default Home