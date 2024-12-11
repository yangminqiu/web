'use client'

import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { auth } from '../utils/firebase'

interface NavbarProps {
  onLogin: () => void
}

const Navbar = ({ onLogin }: NavbarProps) => {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          提示词360-AI 智能助手
        </h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/90">
              {user.email || '用户'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="px-4 py-2 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            登录/注册
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar 