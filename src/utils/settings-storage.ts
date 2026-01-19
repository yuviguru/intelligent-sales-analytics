import { DashboardSettingsState } from '../types/settings'

const STORAGE_KEY = 'dashboard-settings-v1'

/**
 * Get default AI provider based on available API keys
 */
function getDefaultProvider(): 'groq' | 'gemini' | 'claude' | 'ollama' {
  // Check for API keys in order of preference
  if (import.meta.env.VITE_GROQ_API_KEY) return 'groq'
  if (import.meta.env.VITE_GEMINI_API_KEY) return 'gemini'
  if (import.meta.env.VITE_CLAUDE_API_KEY) return 'claude'
  return 'ollama'
}

/**
 * Default settings for the dashboard
 */
export function getDefaultSettings(): DashboardSettingsState {
  return {
    ai: {
      provider: getDefaultProvider(),
      contextLevel: 'standard',
      responseLength: 'balanced',
      streaming: true,
      temperature: 0.7,
    },
    dashboard: {
      widgets: {
        metrics: true,
        revenueChart: true,
        ordersChart: true,
        topProducts: true,
        regionChart: true,
        recentOrders: true,
      },
      defaultChartView: 'monthly',
      refreshInterval: 0,
      compactMode: false,
    },
    appearance: {
      theme: 'dark',
      accentColor: '#06b6d4', // Cyan
      fontSize: 'medium',
      reducedMotion: false,
      showAnimations: true,
    },
    notifications: {
      enabled: true,
      types: {
        insight: true,
        success: true,
        warning: true,
        info: true,
      },
      soundEnabled: false,
      desktopNotifications: false,
    },
  }
}

/**
 * Load settings from localStorage
 * Merges saved settings with defaults to handle missing fields
 */
export function loadSettings(): DashboardSettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getDefaultSettings()
    }

    const parsed = JSON.parse(stored)
    const defaults = getDefaultSettings()

    // Deep merge to ensure all fields exist
    return {
      ai: { ...defaults.ai, ...parsed.ai },
      dashboard: {
        ...defaults.dashboard,
        ...parsed.dashboard,
        widgets: {
          ...defaults.dashboard.widgets,
          ...parsed.dashboard?.widgets,
        },
      },
      appearance: { ...defaults.appearance, ...parsed.appearance },
      notifications: {
        ...defaults.notifications,
        ...parsed.notifications,
        types: {
          ...defaults.notifications.types,
          ...parsed.notifications?.types,
        },
      },
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error)
    return getDefaultSettings()
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: DashboardSettingsState): void {
  try {
    const serialized = JSON.stringify(settings)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded')
      } else if (error.name === 'SecurityError') {
        console.error('localStorage access denied (private browsing?)')
      } else {
        console.error('Failed to save settings:', error)
      }
    }
    throw error
  }
}

/**
 * Clear all settings from localStorage
 */
export function clearSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear settings:', error)
  }
}
