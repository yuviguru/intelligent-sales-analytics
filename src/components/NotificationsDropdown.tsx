import { AlertCircle, Zap, CheckCircle, Brain } from 'lucide-react'
import { clsx } from 'clsx'
import { Notification } from './NotificationsModal'

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Zap,
  insight: Brain,
}

const colorMap = {
  success: 'text-green-400 bg-green-400/10',
  warning: 'text-yellow-400 bg-yellow-400/10',
  info: 'text-blue-400 bg-blue-400/10',
  insight: 'text-purple-400 bg-purple-400/10',
}

interface NotificationsDropdownProps {
  isOpen: boolean
  notifications: Notification[]
  onNotificationClick: (notification: Notification) => void
  onMarkAllAsRead: () => void
}

export function NotificationsDropdown({
  isOpen,
  notifications,
  onNotificationClick,
  onMarkAllAsRead,
}: NotificationsDropdownProps) {
  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div
      className={clsx(
        'absolute top-full right-0 mt-2',
        'w-96',
        'bg-surface-900 rounded-2xl',
        'border border-surface-700/50',
        'shadow-2xl',
        'max-h-[calc(100vh-8rem)] flex flex-col',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        'z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-700/50">
        <div>
          <h3 className="font-semibold text-surface-50">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-surface-400 mt-0.5">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-accent hover:text-accent-light font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-800/50 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-surface-600" />
            </div>
            <p className="text-surface-400 text-sm">No notifications</p>
            <p className="text-surface-500 text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-700/50">
            {notifications.slice(0, 5).map((notification) => {
              const Icon = iconMap[notification.type]
              return (
                <button
                  key={notification.id}
                  onClick={() => onNotificationClick(notification)}
                  className={clsx(
                    'w-full p-4 transition-colors text-left',
                    notification.read
                      ? 'bg-surface-900 hover:bg-surface-800/30'
                      : 'bg-surface-800/30 hover:bg-surface-800/50'
                  )}
                >
                  <div className="flex gap-3">
                    <div className={clsx('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', colorMap[notification.type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={clsx(
                          'font-medium text-xs',
                          notification.read ? 'text-surface-300' : 'text-surface-50'
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-surface-400 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-surface-500 mt-1.5">{notification.time}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="p-3 border-t border-surface-700/50 text-center">
          <p className="text-xs text-surface-400">
            Showing 5 of {notifications.length} notifications
          </p>
        </div>
      )}
    </div>
  )
}
