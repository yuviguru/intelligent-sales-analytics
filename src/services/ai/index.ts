import { AIMessage, AIResponse, AIProviderInterface, AIProvider, PROVIDER_NAMES } from './types'
import { OllamaProvider } from './providers/ollama'
import { ClaudeProvider } from './providers/claude'
import { GroqProvider } from './providers/groq'
import { GeminiProvider } from './providers/gemini'
import { aiConfig } from './config'
import { usageLimiter } from './usage-limiter'

interface ProviderOverride {
  provider?: AIProvider
  model?: string
}

class AIService {
  private provider: AIProviderInterface
  private providerType: AIProvider
  private currentModel?: string

  constructor() {
    this.providerType = aiConfig.provider
    this.currentModel = aiConfig.model
    this.provider = this.createProvider(aiConfig.provider, aiConfig.model)
  }

  private createProvider(provider: AIProvider, model?: string): AIProviderInterface {
    switch (provider) {
      case 'ollama':
        return new OllamaProvider(aiConfig.baseUrl, model)
      case 'claude':
        if (!aiConfig.apiKey) throw new Error('Claude API key required')
        return new ClaudeProvider(aiConfig.apiKey, model)
      case 'groq':
        if (!aiConfig.apiKey) throw new Error('Groq API key required')
        return new GroqProvider(aiConfig.apiKey, model)
      case 'gemini':
        if (!aiConfig.apiKey) throw new Error('Gemini API key required')
        return new GeminiProvider(aiConfig.apiKey, model)
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  /**
   * Set provider/model override from settings
   */
  setProviderOverride(override: ProviderOverride) {
    const needsRecreate =
      (override.provider && override.provider !== this.providerType) ||
      (override.model && override.model !== this.currentModel)

    if (needsRecreate) {
      const newProvider = override.provider || this.providerType
      const newModel = override.model || this.currentModel

      this.providerType = newProvider
      this.currentModel = newModel
      this.provider = this.createProvider(newProvider, newModel)
    }
  }

  /**
   * Clear provider override
   */
  clearProviderOverride() {
    this.providerType = aiConfig.provider
    this.currentModel = aiConfig.model
    this.provider = this.createProvider(aiConfig.provider, aiConfig.model)
  }

  /**
   * Get the current provider name for display
   */
  getProviderName(): string {
    return PROVIDER_NAMES[this.providerType]
  }

  /**
   * Get remaining uses for the limiter
   */
  getRemainingUses(): number {
    return usageLimiter.getRemainingUses()
  }

  /**
   * Check if usage limit is reached
   */
  isLimitReached(): boolean {
    return usageLimiter.isLimitReached()
  }

  /**
   * Get the blocked message
   */
  getBlockedMessage(): string {
    return usageLimiter.getBlockedMessage()
  }

  /**
   * Send a chat message and get a response
   */
  async chat(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    // Check usage limit first
    if (!usageLimiter.canUse()) {
      throw new Error(usageLimiter.getBlockedMessage())
    }

    try {
      const response = await this.provider.chat(messages, systemPrompt)
      
      // Increment usage after successful response
      usageLimiter.incrementUsage()
      
      return response
    } catch (error) {
      // Don't count failed requests against limit
      throw error
    }
  }

  /**
   * Stream a chat response
   */
  async *stream(messages: AIMessage[], systemPrompt?: string): AsyncGenerator<string> {
    // Check usage limit first
    if (!usageLimiter.canUse()) {
      throw new Error(usageLimiter.getBlockedMessage())
    }

    if (!this.provider.stream) {
      // Fallback to non-streaming if not supported
      const response = await this.chat(messages, systemPrompt)
      yield response.content
      return
    }

    try {
      let hasContent = false
      
      for await (const chunk of this.provider.stream(messages, systemPrompt)) {
        hasContent = true
        yield chunk
      }

      // Only increment if we got content
      if (hasContent) {
        usageLimiter.incrementUsage()
      }
    } catch (error) {
      throw error
    }
  }
}

// Export singleton instance
export const aiService = new AIService()

// Re-export types
export type { AIMessage, AIResponse, AIProvider }
