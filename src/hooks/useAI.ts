import { useState, useCallback, useEffect } from 'react'
import { aiService, AIMessage } from '../services/ai'
import { getDataSummary } from '../data/sales-data'
import { useSettings } from './useSettings'

interface UseAIOptions {
  onStream?: (chunk: string) => void
  streaming?: boolean
}

interface UseAIReturn {
  isLoading: boolean
  error: string | null
  response: string | null
  remainingUses: number
  isLimitReached: boolean
  blockedMessage: string
  providerName: string
  sendMessage: (message: string) => Promise<string | null>
  askAboutData: (question: string) => Promise<string | null>
  summarizeData: () => Promise<string | null>
  clearError: () => void
  clearResponse: () => void
}

// Generate system prompt dynamically to include latest data
const getDashboardSystemPrompt = () => `You are an AI assistant integrated into a sales dashboard. You help users understand their business data and provide actionable insights.

You have access to the following LIVE dashboard data (updated in real-time):
${getDataSummary()}

Formatting Guidelines:
- Use ## for section headers (e.g., ## Key Insights)
- Use bullet points with - for lists
- Use **bold** for important numbers and metrics
- Keep responses concise and scannable
- Never use asterisks alone - always use them for formatting (bold)
- Structure your response with clear sections when providing multiple points

Content Guidelines:
1. Be specific - reference actual numbers from the data
2. Highlight trends and patterns (the data updates in real-time)
3. Provide actionable recommendations
4. Format currency with $ and percentages with %
5. Compare current vs previous periods when relevant
6. When discussing recent activity, use the latest data
7. The "MOST RECENT ORDERS" list is already sorted by date (newest first), so the first order is the most recent
8. IMPORTANT: You only have access to the 8 most recent orders. If asked for specific product orders or more than 8 orders, acknowledge this limitation honestly

Keep responses under 200 words unless more detail is requested.`

export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const { settings } = useSettings()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([])

  // Apply provider/model settings from user preferences
  useEffect(() => {
    aiService.setProviderOverride({
      provider: settings.ai.provider,
      model: settings.ai.model,
    })
  }, [settings.ai.provider, settings.ai.model])

  const remainingUses = aiService.getRemainingUses()
  const isLimitReached = aiService.isLimitReached()
  const blockedMessage = aiService.getBlockedMessage()
  const providerName = aiService.getProviderName()

  const clearError = useCallback(() => setError(null), [])
  const clearResponse = useCallback(() => setResponse(null), [])

  const sendMessage = useCallback(async (message: string): Promise<string | null> => {
    if (isLimitReached) {
      setError(blockedMessage)
      return null
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    const userMessage: AIMessage = { role: 'user', content: message }
    const messages = [...conversationHistory, userMessage]

    try {
      // Generate fresh system prompt with latest data
      const systemPrompt = getDashboardSystemPrompt()

      if (options.streaming && options.onStream) {
        let fullResponse = ''

        for await (const chunk of aiService.stream(messages, systemPrompt)) {
          fullResponse += chunk
          options.onStream(chunk)
        }

        setResponse(fullResponse)
        setConversationHistory([
          ...messages,
          { role: 'assistant', content: fullResponse }
        ])
        return fullResponse
      } else {
        const result = await aiService.chat(messages, systemPrompt)
        setResponse(result.content)
        setConversationHistory([
          ...messages,
          { role: 'assistant', content: result.content }
        ])
        return result.content
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [conversationHistory, isLimitReached, blockedMessage, options])

  const askAboutData = useCallback(async (question: string): Promise<string | null> => {
    return sendMessage(question)
  }, [sendMessage])

  const summarizeData = useCallback(async (): Promise<string | null> => {
    const prompt = `Please provide a brief executive summary of the current dashboard data. Include:
1. Overall performance assessment
2. Key highlights (what's doing well)
3. Areas needing attention
4. One recommended action

Keep it concise and actionable.`
    
    return sendMessage(prompt)
  }, [sendMessage])

  return {
    isLoading,
    error,
    response,
    remainingUses,
    isLimitReached,
    blockedMessage,
    providerName,
    sendMessage,
    askAboutData,
    summarizeData,
    clearError,
    clearResponse,
  }
}
