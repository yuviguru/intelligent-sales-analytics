import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Zap, Brain, X } from 'lucide-react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'warning' | 'info' | 'insight'
  title: string
  message: string
  duration?: number
  sound?: boolean
}

interface ToastNotificationProps {
  toast: Toast
  index: number
  onDismiss: (id: string) => void
}

const ICON_MAP = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Zap,
  insight: Brain
}

const COLOR_MAP = {
  success: 'border-success bg-success/10',
  warning: 'border-warning bg-warning/10',
  info: 'border-accent bg-accent/10',
  insight: 'border-purple-500 bg-purple-500/10'
}

const ICON_COLOR_MAP = {
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-accent',
  insight: 'text-purple-500'
}

export function ToastNotification({ toast, index, onDismiss }: ToastNotificationProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(100)
  const duration = toast.duration || 5000
  const Icon = ICON_MAP[toast.type]

  useEffect(() => {
    if (isPaused) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        clearInterval(interval)
        onDismiss(toast.id)
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isPaused, toast.id, duration, onDismiss])

  const toastVariants = {
    hidden: {
      opacity: 0,
      x: 400,
      scale: 0.8,
      y: index * 110 // Increased spacing to 110px to prevent overlap with taller toasts
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      y: index * 110,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        y: {
          type: "spring" as const,
          damping: 20,
          stiffness: 200
        }
      }
    },
    exit: {
      opacity: 0,
      x: 400,
      scale: 0.8,
      transition: {
        duration: 0.15,
        ease: "easeIn" as const
      }
    }
  }

  return (
    <motion.div
      layout
      custom={index}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      whileHover={{ scale: 1.02 }}
      className={clsx(
        'fixed top-4 right-4 w-[360px] rounded-xl overflow-hidden',
        'border-2 backdrop-blur-xl shadow-2xl',
        'bg-surface-900/95',
        COLOR_MAP[toast.type]
      )}
      style={{ zIndex: 9999 - index }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={clsx(
            'flex-shrink-0 p-2 rounded-lg',
            toast.type === 'success' && 'bg-success/20',
            toast.type === 'warning' && 'bg-warning/20',
            toast.type === 'info' && 'bg-accent/20',
            toast.type === 'insight' && 'bg-purple-500/20'
          )}>
            <Icon className={clsx('w-5 h-5', ICON_COLOR_MAP[toast.type])} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-surface-50 text-sm mb-1">
              {toast.title}
            </h4>
            <p className="text-surface-400 text-xs leading-relaxed">
              {toast.message}
            </p>
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDismiss(toast.id)}
            className={clsx(
              'flex-shrink-0 p-1 rounded-lg',
              'text-surface-400 hover:text-surface-200',
              'hover:bg-surface-800/50 transition-colors'
            )}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-800/50 overflow-hidden">
        <motion.div
          className={clsx(
            'h-full',
            toast.type === 'success' && 'bg-success',
            toast.type === 'warning' && 'bg-warning',
            toast.type === 'info' && 'bg-accent',
            toast.type === 'insight' && 'bg-purple-500'
          )}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.016, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
}
