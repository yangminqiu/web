import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'sk-db4fcf4f31564ddb8a4d2320b1b092b0',
  baseURL: 'https://api.deepseek.com/v1'
})

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    
    // 调用 DeepSeek API
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