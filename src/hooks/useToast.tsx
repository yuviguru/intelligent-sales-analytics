import { useState, useCallback, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { Toast } from '../components/ToastNotification'
import { soundService } from '../services/soundService'

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const MAX_TOASTS = 3

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [queue, setQueue] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random()}`
    }

    // Play sound if enabled
    if (toast.sound) {
      if (toast.type === 'success') {
        soundService.play('success')
      } else if (toast.type === 'warning') {
        soundService.play('warning')
      } else {
        soundService.play('info')
      }
    }

    setToasts(current => {
      if (current.length >= MAX_TOASTS) {
        // Add to queue
        setQueue(q => [...q, newToast])
        return current
      }
      return [...current, newToast]
    })
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(current => current.filter(t => t.id !== id))

    // Show next from queue
    setQueue(q => {
      if (q.length > 0) {
        const [next, ...rest] = q
        setToasts(current => [...current, next])
        return rest
      }
      return q
    })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
