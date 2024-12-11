import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface ChatMessage {
  role: string
  content: string
}

const client = new OpenAI({
  apiKey: 'sk-d821315dc0fe4e84a14b2e9aa1e68d91',
  baseURL: 'https://api.deepseek.com/v1'
})

// 格式化计算回答
function formatCalculationResponse(content: string): string {
  // 提取数字和运算符
  const numbers = content.match(/\d+/g) || []
  if (numbers.length >= 3) {
    const num1 = numbers[0]
    const num2 = numbers[1]
    const result = numbers[2]
    return `${num1} × ${num2} = ${result}\n计算完成。`
  }
  return content
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const messagesWithSystem = [
      {
        role: 'system',
        content: `你是专业的中文AI助手，请遵守以下规则：

                 1. 回答格式规范：
                    - 使用简洁的中文
                    - 使用中文标点符号
                    - 不使用任何特殊符号（如×、※、◆等）
                    - 不使用任何装饰性字符
                    - 段落之间使用一个换行符分隔

                 2. 功能介绍格式示例：
                    我是您的AI助手，具备以下功能：

                    信息查询：提供天气、新闻、百科知识、历史事件等信息
                    语言翻译：支持多语言互译
                    学习辅导：解答学术问题，提供学习建议
                    生活建议：提供健康、饮食、运动等建议
                    技术支持：解答计算机、软件、编程等问题
                    娱乐互动：推荐电影、书籍，进行日常对话
                    旅行规划：提供目的地推荐、行程规划、交通信息
                    写作辅助：协助撰写文章、邮件、报告等

                    请告诉我您需要什么帮助。`
      },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: String(msg.content).trim()
      }))
    ]

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: messagesWithSystem,
      temperature: 0.3, // 降低随机性
      max_tokens: 2000,
      stream: false,
      top_p: 0.95
    })

    let content = response.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('无效的响应')
    }

    // 清理和格式化响应
    content = content
      .replace(/[[\]\\]/g, '') // 移除方括号和反斜杠
      .replace(/\\times|times|Times|TIMES|\*/g, '×') // 统一替换所有乘号形式
      .replace(/计算过程如下：?/g, '') // 移除多余的说明文字
      .replace(/["""]/g, '') // 移除引号
      .replace(/\n+/g, '\n') // 规范化换行
      .replace(/^[\s\n]+|[\s\n]+$/g, '') // 清理首尾空白

    // 如果是计算题，强制格式化为标准格式
    if (content.includes('=')) {
      content = formatCalculationResponse(content)
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