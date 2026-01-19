import { AIProvider, AIProviderConfig, DEFAULT_MODELS } from './types'

// Environment-based configuration
// Checks for API keys first (even in dev), then falls back to Ollama

interface AIConfig {
  provider: AIProvider
  apiKey?: string
  baseUrl?: string
  model?: string
}

function getConfig(): AIConfig {
  // Check for API keys first (even in dev mode)
  if (import.meta.env.VITE_GROQ_API_KEY) {
    return {
      provider: 'groq',
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      model: import.meta.env.VITE_GROQ_MODEL || DEFAULT_MODELS.groq,
    }
  }

  if (import.meta.env.VITE_GEMINI_API_KEY) {
    return {
      provider: 'gemini',
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      model: import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODELS.gemini,
    }
  }

  if (import.meta.env.VITE_CLAUDE_API_KEY) {
    return {
      provider: 'claude',
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
      model: import.meta.env.VITE_CLAUDE_MODEL || DEFAULT_MODELS.claude,
    }
  }

  // Fallback to Ollama (development or no API keys)
  return {
    provider: 'ollama',
    baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
    model: import.meta.env.VITE_OLLAMA_MODEL || DEFAULT_MODELS.ollama,
  }
}

export const aiConfig = getConfig()

// Export for type checking
export type { AIProviderConfig }
