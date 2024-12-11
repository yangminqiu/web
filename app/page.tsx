'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const ChatInterface = dynamic(() => import('@/app/components/ChatInterface'), {
  ssr: false
})

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <p className="text-center text-sm font-medium">
            您的专属AI助手，随时为您解答问题
          </p>
        </div>
      </div>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              AI 智能助手
            </h1>
          </header>
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}

export default Home