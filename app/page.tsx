'use client'

import React, { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import ChatWindow from './components/Chat/ChatWindow'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Navbar from './components/Navbar'
import CategoryNav from './components/CategoryNav'
import PromptDisplay from './components/PromptDisplay'
import Footer from './components/Footer'

export default function Home() {
  const { user } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  const handleCategorySelect = (categoryId: string) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setSelectedCategory(categoryId)
  }

  const handleBack = () => {
    setSelectedCategory(null)
  }

  const handleCloseAuth = () => {
    setShowAuth(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar onLogin={() => setShowAuth(true)} />
      <CategoryNav onSelect={handleCategorySelect} />
      
      <div className="flex-1 px-4 min-h-0 py-4">
        <div className="h-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {selectedCategory ? (
            <PromptDisplay 
              category={selectedCategory} 
              onBack={handleBack}
            />
          ) : (
            <ChatWindow 
              onNeedAuth={() => setShowAuth(true)}
              isLoggedIn={!!user}
            />
          )}
        </div>
      </div>

      {/* 登录/注册弹窗 */}
      {showAuth && !user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isLogin ? '登录' : '注册'}
              </h2>
              <button 
                onClick={handleCloseAuth}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {isLogin ? (
              <>
                <LoginForm />
                <p className="text-center mt-4 text-gray-600">
                  还没有账号？
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-500 hover:text-blue-600 ml-2"
                  >
                    立即注册
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm />
                <p className="text-center mt-4 text-gray-600">
                  已有账号？
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-500 hover:text-blue-600 ml-2"
                  >
                    立即登录
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}