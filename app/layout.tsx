import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 智能助手',
  description: '您的专属AI助手，随时为您解答问题',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  )
} 