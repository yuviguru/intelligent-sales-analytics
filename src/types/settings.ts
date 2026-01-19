export type AIProvider = 'ollama' | 'claude' | 'groq' | 'gemini'

export type ContextLevel = 'minimal' | 'standard' | 'detailed'

export type ResponseLength = 'concise' | 'balanced' | 'comprehensive'

export type ChartView = 'monthly' | 'weekly'

export type Theme = 'dark' | 'light'

export type FontSize = 'small' | 'medium' | 'large'

/**
 * AI Assistant configuration settings
 */
export interface AISettings {
  /** Selected AI provider */
  provider: AIProvider
  /** Optional specific model override */
  model?: string
  /** Context level for AI responses */
  contextLevel: ContextLevel
  /** Response length preference */
  responseLength: ResponseLength
  /** Enable streaming responses */
  streaming: boolean
  /** Creativity/randomness level (0.0 - 1.0) */
  temperature: number
}

/**
 * Dashboard widget visibility and preferences
 */
export interface DashboardSettings {
  widgets: {
    /** Show key metrics cards */
    metrics: boolean
    /** Show revenue chart */
    revenueChart: boolean
    /** Show orders chart */
    ordersChart: boolean
    /** Show top products table */
    topProducts: boolean
    /** Show region distribution chart */
    regionChart: boolean
    /** Show recent orders table */
    recentOrders: boolean
  }
  /** Default view for revenue chart */
  defaultChartView: ChartView
  /** Auto-refresh interval in minutes (0 = disabled) */
  refreshInterval: number
  /** Compact mode reduces spacing */
  compactMode: boolean
}

/**
 * Appearance and theme settings
 */
export interface AppearanceSettings {
  /** Color theme */
  theme: Theme
  /** Accent color (hex) */
  accentColor: string
  /** Font size preference */
  fontSize: FontSize
  /** Reduce motion for accessibility */
  reducedMotion: boolean
  /** Show animations */
  showAnimations: boolean
}

/**
 * Notification preferences
 */
export interface NotificationSettings {
  /** Master toggle for all notifications */
  enabled: boolean
  /** Notification type toggles */
  types: {
    insight: boolean
    success: boolean
    warning: boolean
    info: boolean
  }
  /** Enable sound effects */
  soundEnabled: boolean
  /** Enable desktop notifications */
  desktopNotifications: boolean
}

/**
 * Complete dashboard settings
 */
export interface DashboardSettingsState {
  ai: AISettings
  dashboard: DashboardSettings
  appearance: AppearanceSettings
  notifications: NotificationSettings
}

/**
 * Settings context type for provider
 */
export interface SettingsContextType {
  /** Current settings state */
  settings: DashboardSettingsState
  /** Settings that are currently applied to the dashboard */
  appliedSettings: DashboardSettingsState
  /** Update settings (merges with current) */
  updateSettings: (updates: Partial<DashboardSettingsState>) => void
  /** Reset all settings to defaults */
  resetToDefaults: () => void
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean
  /** Save current settings to localStorage */
  saveSettings: () => void
  /** Cancel changes and revert to saved */
  cancelChanges: () => void
  /** Apply theme settings to CSS variables */
  applyThemeSettings: (settings: DashboardSettingsState) => void
}
