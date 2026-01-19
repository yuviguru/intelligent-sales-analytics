import { AIMessage, AIResponse, AIProviderInterface, DEFAULT_MODELS } from '../types'

export class GroqProvider implements AIProviderInterface {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey
    this.model = model || DEFAULT_MODELS.groq
  }

  async chat(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    const formattedMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()

    return {
      content: data.choices?.[0]?.message?.content || '',
      provider: 'groq',
      tokensUsed: data.usage?.total_tokens,
    }
  }

  async *stream(messages: AIMessage[], systemPrompt?: string): AsyncGenerator<string> {
    const formattedMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        max_tokens: 1024,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const json = JSON.parse(data)
          if (json.choices?.[0]?.delta?.content) {
            yield json.choices[0].delta.content
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}
