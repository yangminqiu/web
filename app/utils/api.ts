export async function chatWithAI(messages: { role: string; content: string }[]) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages })
  })

  const data = await response.json()

  if (!response.ok || data.error) {
    throw new Error(data.error || '请求失败')
  }

  return data.content
} 