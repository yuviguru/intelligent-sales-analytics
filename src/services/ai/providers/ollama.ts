import { AIMessage, AIResponse, AIProviderInterface, DEFAULT_MODELS } from '../types'

export class OllamaProvider implements AIProviderInterface {
  private baseUrl: string
  private model: string

  constructor(baseUrl = 'http://localhost:11434', model?: string) {
    this.baseUrl = baseUrl
    this.model = model || DEFAULT_MODELS.ollama
  }

  async chat(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    const formattedMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: formattedMessages,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        content: data.message?.content || '',
        provider: 'ollama',
        tokensUsed: data.eval_count,
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to Ollama. Make sure Ollama is running on localhost:11434')
      }
      throw error
    }
  }

  async *stream(messages: AIMessage[], systemPrompt?: string): AsyncGenerator<string> {
    const formattedMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(Boolean)

      for (const line of lines) {
        try {
          const json = JSON.parse(line)
          if (json.message?.content) {
            yield json.message.content
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  }
}
