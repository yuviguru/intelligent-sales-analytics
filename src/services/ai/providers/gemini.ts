import { AIMessage, AIResponse, AIProviderInterface, DEFAULT_MODELS } from '../types'

export class GeminiProvider implements AIProviderInterface {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey
    this.model = model || DEFAULT_MODELS.gemini
  }

  async chat(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    // Gemini uses a different format - combine system prompt with first message
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Prepend system prompt to first user message if exists
    if (systemPrompt && contents.length > 0) {
      contents[0].parts[0].text = `${systemPrompt}\n\n${contents[0].parts[0].text}`
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Gemini error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()

    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      provider: 'gemini',
      tokensUsed: data.usageMetadata?.totalTokenCount,
    }
  }

  async *stream(messages: AIMessage[], systemPrompt?: string): AsyncGenerator<string> {
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    if (systemPrompt && contents.length > 0) {
      contents[0].parts[0].text = `${systemPrompt}\n\n${contents[0].parts[0].text}`
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.statusText}`)
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

        try {
          const json = JSON.parse(data)
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            yield text
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}
