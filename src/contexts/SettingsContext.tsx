import { createContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { DashboardSettingsState, SettingsContextType } from '../types/settings'
import { loadSettings, saveSettings as saveToStorage, getDefaultSettings } from '../utils/settings-storage'

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<DashboardSettingsState>(loadSettings)
  const [savedSettings, setSavedSettings] = useState<DashboardSettingsState>(loadSettings)
  const [appliedSettings, setAppliedSettings] = useState<DashboardSettingsState>(loadSettings)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Auto-save settings to localStorage when they change
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(() => {
      try {
        saveToStorage(settings)
        setSavedSettings(settings)
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Failed to auto-save settings:', error)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [settings, hasUnsavedChanges])

  const updateSettings = useCallback((updates: Partial<DashboardSettingsState>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
      // Deep merge for nested objects
      ai: updates.ai ? { ...prev.ai, ...updates.ai } : prev.ai,
      dashboard: updates.dashboard
        ? {
            ...prev.dashboard,
            ...updates.dashboard,
            widgets: updates.dashboard.widgets
              ? { ...prev.dashboard.widgets, ...updates.dashboard.widgets }
              : prev.dashboard.widgets,
          }
        : prev.dashboard,
      appearance: updates.appearance
        ? { ...prev.appearance, ...updates.appearance }
        : prev.appearance,
      notifications: updates.notifications
        ? {
            ...prev.notifications,
            ...updates.notifications,
            types: updates.notifications.types
              ? { ...prev.notifications.types, ...updates.notifications.types }
              : prev.notifications.types,
          }
        : prev.notifications,
    }))
    setHasUnsavedChanges(true)
  }, [])

  const applyThemeSettings = useCallback((settingsToApply: DashboardSettingsState) => {
    // Apply accent color
    document.documentElement.style.setProperty('--accent', settingsToApply.appearance.accentColor)
    document.documentElement.style.setProperty('--color-accent', settingsToApply.appearance.accentColor)

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
    document.documentElement.style.fontSize = fontSizeMap[settingsToApply.appearance.fontSize]

    // Update applied settings so dashboard uses the new values
    setAppliedSettings(settingsToApply)
  }, [])

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultSettings()
    setSettings(defaults)
    setHasUnsavedChanges(true)
  }, [])

  const saveSettings = useCallback(() => {
    try {
      saveToStorage(settings)
      setSavedSettings(settings)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  }, [settings])

  const cancelChanges = useCallback(() => {
    setSettings(savedSettings)
    setHasUnsavedChanges(false)
  }, [savedSettings])

  const value: SettingsContextType = {
    settings,
    appliedSettings,
    updateSettings,
    resetToDefaults,
    hasUnsavedChanges,
    saveSettings,
    cancelChanges,
    applyThemeSettings,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
