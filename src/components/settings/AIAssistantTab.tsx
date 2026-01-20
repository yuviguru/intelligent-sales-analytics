import { Server, Cpu, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { useSettings } from '../../hooks/useSettings'
import { AIProvider, ContextLevel, ResponseLength } from '../../types/settings'

const AI_PROVIDERS = [
  {
    id: 'groq' as AIProvider,
    name: 'Groq',
    description: 'Fast inference - Llama models',
    icon: Cpu,
    status: 'Recommended'
  },
  {
    id: 'gemini' as AIProvider,
    name: 'Gemini',
    description: 'Google AI - Multimodal',
    icon: Sparkles,
  },
  {
    id: 'ollama' as AIProvider,
    name: 'Ollama',
    description: 'Local AI model - Free, private',
    icon: Server,
  },
]

const CONTEXT_LEVELS = [
  {
    value: 'minimal' as ContextLevel,
    label: 'Minimal',
    description: 'Quick answers with essential data'
  },
  {
    value: 'standard' as ContextLevel,
    label: 'Standard',
    description: 'Balanced context and detail'
  },
  {
    value: 'detailed' as ContextLevel,
    label: 'Detailed',
    description: 'Comprehensive analysis with full context'
  },
]

const PROVIDER_MODELS: Record<AIProvider, Array<{ value: string; label: string; description: string }>> = {
  ollama: [
    { value: 'llama3.2', label: 'Llama 3.2', description: 'Fast, lightweight (default)' },
    { value: 'llama3.1', label: 'Llama 3.1', description: 'Balanced performance' },
    { value: 'mistral', label: 'Mistral', description: 'Good for reasoning' },
    { value: 'codellama', label: 'Code Llama', description: 'Optimized for code' },
  ],
  groq: [
    { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', description: 'Fastest, good quality (default)' },
    { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B', description: 'Most capable, slower' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', description: 'Large context (32k tokens)' },
    { value: 'gemma2-9b-it', label: 'Gemma 2 9B', description: 'Google model, efficient' },
  ],
  gemini: [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Fast, cost-effective (default)' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Most capable, multimodal' },
    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)', description: 'Latest model, experimental' },
  ],
  claude: [
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', description: 'Fast, cost-effective (default)' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', description: 'Most capable, balanced' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', description: 'Highest quality, slower' },
  ],
}

export function AIAssistantTab() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-8">
      {/* Provider Selection */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">AI Provider</h3>
        <p className="text-sm text-surface-400 mb-4">Choose your preferred AI service</p>

        <div className="grid grid-cols-2 gap-3">
          {AI_PROVIDERS.map((provider) => {
            const Icon = provider.icon
            const isSelected = settings.ai.provider === provider.id
            return (
              <button
                key={provider.id}
                onClick={() => updateSettings({ ai: { ...settings.ai, provider: provider.id, model: undefined } })}
                className={clsx(
                  'p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-accent/20 text-accent' : 'bg-surface-700/50 text-surface-400'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'font-semibold',
                        isSelected ? 'text-surface-50' : 'text-surface-200'
                      )}>
                        {provider.name}
                      </span>
                      {provider.status && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/20 text-accent">
                          {provider.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-400 mt-1">{provider.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Model</h3>
        <p className="text-sm text-surface-400 mb-4">
          Select a specific model for {AI_PROVIDERS.find(p => p.id === settings.ai.provider)?.name}
        </p>

        <div className="space-y-2">
          {PROVIDER_MODELS[settings.ai.provider].map((model) => {
            const isSelected = settings.ai.model === model.value || (!settings.ai.model && model.description.includes('default'))
            return (
              <button
                key={model.value}
                onClick={() => updateSettings({ ai: { ...settings.ai, model: model.value } })}
                className={clsx(
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={clsx(
                      'font-semibold mb-1',
                      isSelected ? 'text-surface-50' : 'text-surface-200'
                    )}>
                      {model.label}
                    </div>
                    <div className="text-xs text-surface-400">
                      {model.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-3 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Context Level */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Context Level</h3>
        <p className="text-sm text-surface-400 mb-4">How much context to provide to the AI</p>

        <div className="flex gap-2">
          {CONTEXT_LEVELS.map((level) => {
            const isSelected = settings.ai.contextLevel === level.value
            return (
              <button
                key={level.value}
                onClick={() => updateSettings({ ai: { ...settings.ai, contextLevel: level.value } })}
                className={clsx(
                  'flex-1 p-4 rounded-xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
              >
                <div className={clsx(
                  'font-semibold mb-1',
                  isSelected ? 'text-surface-50' : 'text-surface-200'
                )}>
                  {level.label}
                </div>
                <div className="text-xs text-surface-400">
                  {level.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Response Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Response Preferences</h3>

        {/* Response Length */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            Response Length
          </label>
          <select
            value={settings.ai.responseLength}
            onChange={(e) => updateSettings({ ai: { ...settings.ai, responseLength: e.target.value as ResponseLength } })}
            className={clsx(
              'w-full px-4 py-2.5 rounded-xl',
              'bg-surface-800 border border-surface-700',
              'text-surface-100',
              'focus:outline-none focus:border-accent',
              'transition-all duration-200'
            )}
          >
            <option value="concise">Concise - Brief and to the point</option>
            <option value="balanced">Balanced - Moderate detail</option>
            <option value="comprehensive">Comprehensive - Thorough explanations</option>
          </select>
        </div>

        {/* Streaming */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
          <div>
            <div className="font-medium text-surface-200">Streaming Responses</div>
            <div className="text-sm text-surface-400 mt-1">Show AI responses as they're generated</div>
          </div>
          <button
            onClick={() => updateSettings({ ai: { ...settings.ai, streaming: !settings.ai.streaming } })}
            className={clsx(
              'relative w-12 h-6 rounded-full transition-colors duration-200',
              settings.ai.streaming ? 'bg-accent' : 'bg-surface-700'
            )}
          >
            <div className={clsx(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
              settings.ai.streaming ? 'translate-x-6' : 'translate-x-0.5'
            )} />
          </button>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-surface-300">
              Creativity Level
            </label>
            <span className="text-sm font-mono text-surface-400">
              {settings.ai.temperature.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.ai.temperature}
            onChange={(e) => updateSettings({ ai: { ...settings.ai, temperature: parseFloat(e.target.value) } })}
            className="w-full h-2 rounded-full bg-surface-800 appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-110"
          />
          <div className="flex justify-between text-xs text-surface-500 mt-1">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>
      </div>
    </div>
  )
}
