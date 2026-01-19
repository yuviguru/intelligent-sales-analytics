import { MotionConfig } from 'framer-motion'
import { ReactNode } from 'react'
import { useSettings } from '../hooks/useSettings'

interface AppMotionConfigProps {
  children: ReactNode
}

export function AppMotionConfig({ children }: AppMotionConfigProps) {
  const { settings } = useSettings()

  // Respect both user setting AND system preference
  const shouldReduceMotion = settings.appearance.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  )
}
