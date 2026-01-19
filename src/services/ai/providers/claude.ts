import { AIMessage, AIResponse, AIProviderInterface, DEFAULT_MODELS } from '../types'

export class ClaudeProvider implements AIProviderInterface {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey
    this.model = model || DEFAULT_MODELS.claude
  }

  async chat(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'user' : m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Claude error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()

    return {
      content: data.content?.[0]?.text || '',
      provider: 'claude',
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
    }
  }

  async *stream(messages: AIMessage[], systemPrompt?: string): AsyncGenerator<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        stream: true,
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'user' : m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error(`Claude error: ${response.statusText}`)
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
          if (json.type === 'content_block_delta' && json.delta?.text) {
            yield json.delta.text
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}
