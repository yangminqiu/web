import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import admin from 'firebase-admin'

// 初始化 OpenAI 客户端
const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
})

// 初始化 Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  } catch (error) {
    console.error('Firebase admin initialization error:', error)
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    console.log('收到消息:', messages)

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的中文AI助手。请用中文回答问题，保持回答简洁明了。'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('无效的响应')
    }

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('API 错误:', error)
    return NextResponse.json(
      { error: '抱歉，AI 响应出现错误，请稍后重试' },
      { status: 500 }
    )
  }
} 