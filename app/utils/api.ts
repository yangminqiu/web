export async function chatWithAI(messages: { role: string; content: string }[]) {
  try {
    console.log('发送请求，消息内容:', JSON.stringify(messages, null, 2))

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    })

    console.log('收到响应，状态码:', response.status)
    const data = await response.json()
    console.log('响应数据:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    if (data.error) {
      throw new Error(data.error)
    }

    if (!data.content) {
      throw new Error('响应中没有内容')
    }

    return data.content
  } catch (error: any) {
    console.error('AI 响应错误:', error.message)
    console.error('完整错误:', error)
    throw new Error(error.message || '抱歉，AI 响应出现错误，请稍后重试')
  }
} 