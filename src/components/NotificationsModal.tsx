import { X, AlertCircle, Zap, CheckCircle, Brain, TrendingUp, Activity, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'insight'
  title: string
  message: string
  time: string
  read: boolean
  details?: {
    metrics?: Array<{ label: string; value: string; trend?: 'up' | 'down' }>
    actions?: Array<{ label: string; description: string }>
    description?: string
  }
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  notification: Notification | null
}

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Zap,
  insight: Brain,
}

const colorMap = {
  success: 'text-green-400 bg-green-400/10 border-green-400/20',
  warning: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  info: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  insight: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

export function NotificationsModal({
  isOpen,
  onClose,
  notification,
}: NotificationsModalProps) {
  if (!isOpen || !notification) return null

  const Icon = iconMap[notification.type]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          'relative w-full max-w-lg',
          'bg-surface-900 rounded-2xl',
          'border border-surface-700/50',
          'shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-700/50">
          <div className="flex items-start gap-4">
            <div className={clsx(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border',
              colorMap[notification.type]
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-surface-50 mb-1">
                {notification.title}
              </h2>
              <p className="text-sm text-surface-400">{notification.time}</p>
            </div>
            <button
              onClick={onClose}
              className={clsx(
                'p-2 rounded-xl flex-shrink-0',
                'bg-surface-800/50 hover:bg-surface-800',
                'text-surface-400 hover:text-surface-200',
                'transition-all duration-200'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div>
            <p className="text-surface-200 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Details */}
          {notification.details?.description && (
            <div className={clsx(
              'p-4 rounded-xl',
              'bg-surface-800/30 border border-surface-700/30'
            )}>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-surface-300 leading-relaxed">
                  {notification.details.description}
                </p>
              </div>
            </div>
          )}

          {/* Metrics */}
          {notification.details?.metrics && notification.details.metrics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-surface-200 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Key Metrics
              </h3>
              <div className="grid gap-3">
                {notification.details.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'p-4 rounded-xl',
                      'bg-surface-800/30 border border-surface-700/30',
                      'flex items-center justify-between'
                    )}
                  >
                    <span className="text-sm text-surface-300">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-surface-50">
                        {metric.value}
                      </span>
                      {metric.trend && (
                        <TrendingUp
                          className={clsx(
                            'w-4 h-4',
                            metric.trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'
                          )}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {notification.details?.actions && notification.details.actions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-surface-200 mb-3">
                Recommended Actions
              </h3>
              <div className="space-y-2">
                {notification.details.actions.map((action, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'p-4 rounded-xl',
                      'bg-surface-800/30 border border-surface-700/30',
                      'hover:bg-surface-800/50 transition-colors'
                    )}
                  >
                    <h4 className="text-sm font-medium text-surface-50 mb-1">
                      {action.label}
                    </h4>
                    <p className="text-xs text-surface-400">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-700/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className={clsx(
              'px-6 py-2.5 rounded-xl',
              'bg-accent hover:bg-accent-light',
              'text-surface-950 font-medium',
              'transition-all duration-200',
              'hover:scale-105 active:scale-95'
            )}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
