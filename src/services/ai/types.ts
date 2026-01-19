// AI Provider abstraction layer
// Supports: Ollama (local/free), Claude, Groq, Gemini

export type AIProvider = 'ollama' | 'claude' | 'groq' | 'gemini'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  content: string
  provider: AIProvider
  tokensUsed?: number
}

export interface AIProviderConfig {
  provider: AIProvider
  apiKey?: string
  baseUrl?: string
  model?: string
}

export interface AIProviderInterface {
  chat(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse>
  stream?(messages: AIMessage[], systemPrompt?: string): AsyncGenerator<string>
}

// Default models for each provider
export const DEFAULT_MODELS: Record<AIProvider, string> = {
  ollama: 'llama3.2',
  claude: 'claude-3-haiku-20240307',
  groq: 'llama-3.1-8b-instant',
  gemini: 'gemini-1.5-flash',
}

// Provider display names
export const PROVIDER_NAMES: Record<AIProvider, string> = {
  ollama: 'Ollama (Local)',
  claude: 'Claude',
  groq: 'Groq',
  gemini: 'Gemini',
}
