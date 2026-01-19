import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

/**
 * Hook to access and update dashboard settings
 * Must be used within a SettingsProvider
 */
export function useSettings() {
  const context = useContext(SettingsContext)

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }

  return context
}
