import { Brain, CheckCircle, AlertCircle, Zap, Volume2 } from 'lucide-react'
import { clsx } from 'clsx'
import { useSettings } from '../../hooks/useSettings'

const NOTIFICATION_TYPES = [
  {
    key: 'insight' as const,
    name: 'AI Insights',
    description: 'AI-powered analysis and recommendations',
    icon: Brain,
    color: 'text-purple-400',
  },
  {
    key: 'success' as const,
    name: 'Success',
    description: 'Milestone achievements and goals',
    icon: CheckCircle,
    color: 'text-green-400',
  },
  {
    key: 'warning' as const,
    name: 'Warnings',
    description: 'Important alerts and issues',
    icon: AlertCircle,
    color: 'text-yellow-400',
  },
  {
    key: 'info' as const,
    name: 'Information',
    description: 'Product updates and tips',
    icon: Zap,
    color: 'text-blue-400',
  },
]

export function NotificationsTab() {
  const { settings, updateSettings } = useSettings()

  const toggleNotificationType = (key: keyof typeof settings.notifications.types) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        types: {
          ...settings.notifications.types,
          [key]: !settings.notifications.types[key],
        },
      },
    })
  }

  const enabledCount = Object.values(settings.notifications.types).filter(Boolean).length

  return (
    <div className="space-y-8">
      {/* Master Toggle */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Notifications</h3>
        <p className="text-sm text-surface-400 mb-4">Control how and when you receive updates</p>

        <div className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-surface-50 text-lg">Enable Notifications</div>
              <p className="text-sm text-surface-400 mt-1">
                {settings.notifications.enabled
                  ? `${enabledCount} of ${NOTIFICATION_TYPES.length} types enabled`
                  : 'All notifications are disabled'}
              </p>
            </div>
            <button
              onClick={() => updateSettings({ notifications: { ...settings.notifications, enabled: !settings.notifications.enabled } })}
              className={clsx(
                'relative w-14 h-7 rounded-full transition-colors duration-200',
                settings.notifications.enabled ? 'bg-accent' : 'bg-surface-700'
              )}
            >
              <div className={clsx(
                'absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-200',
                settings.notifications.enabled ? 'translate-x-7' : 'translate-x-0.5'
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className={clsx(
        'transition-opacity duration-200',
        !settings.notifications.enabled && 'opacity-50 pointer-events-none'
      )}>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Notification Types</h3>
        <p className="text-sm text-surface-400 mb-4">Choose which types of notifications to receive</p>

        <div className="space-y-3">
          {NOTIFICATION_TYPES.map((type) => {
            const Icon = type.icon
            const isEnabled = settings.notifications.types[type.key]
            return (
              <button
                key={type.key}
                onClick={() => toggleNotificationType(type.key)}
                disabled={!settings.notifications.enabled}
                className={clsx(
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isEnabled && settings.notifications.enabled
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    'p-2.5 rounded-lg flex-shrink-0',
                    isEnabled && settings.notifications.enabled
                      ? 'bg-accent/20'
                      : 'bg-surface-700/50'
                  )}>
                    <Icon className={clsx('w-5 h-5', isEnabled && settings.notifications.enabled ? type.color : 'text-surface-400')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-surface-200 mb-1">{type.name}</div>
                    <p className="text-sm text-surface-400">{type.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={clsx(
                      'relative w-11 h-6 rounded-full transition-colors duration-200',
                      isEnabled && settings.notifications.enabled ? 'bg-accent' : 'bg-surface-700'
                    )}>
                      <div className={clsx(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                        isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Delivery Preferences */}
      <div className={clsx(
        'transition-opacity duration-200',
        !settings.notifications.enabled && 'opacity-50 pointer-events-none'
      )}>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Delivery Preferences</h3>
        <p className="text-sm text-surface-400 mb-4">How you want to be notified</p>

        <div className="space-y-3">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-700/50">
                <Volume2 className="w-5 h-5 text-surface-400" />
              </div>
              <div>
                <div className="font-medium text-surface-200">Sound Effects</div>
                <div className="text-sm text-surface-400 mt-1">Play sound when notifications appear</div>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ notifications: { ...settings.notifications, soundEnabled: !settings.notifications.soundEnabled } })}
              disabled={!settings.notifications.enabled}
              className={clsx(
                'relative w-12 h-6 rounded-full transition-colors duration-200',
                settings.notifications.soundEnabled && settings.notifications.enabled ? 'bg-accent' : 'bg-surface-700'
              )}
            >
              <div className={clsx(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                settings.notifications.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
              )} />
            </button>
          </div>

          {/* Desktop Notifications */}
          <div className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-surface-200">Desktop Notifications</div>
                <div className="text-sm text-surface-400 mt-1">Show system notifications (requires permission)</div>
              </div>
              <button
                onClick={() => updateSettings({ notifications: { ...settings.notifications, desktopNotifications: !settings.notifications.desktopNotifications } })}
                disabled={!settings.notifications.enabled}
                className={clsx(
                  'relative w-12 h-6 rounded-full transition-colors duration-200',
                  settings.notifications.desktopNotifications && settings.notifications.enabled ? 'bg-accent' : 'bg-surface-700'
                )}
              >
                <div className={clsx(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                  settings.notifications.desktopNotifications ? 'translate-x-6' : 'translate-x-0.5'
                )} />
              </button>
            </div>
            {settings.notifications.desktopNotifications && settings.notifications.enabled && (
              <div className="pt-3 border-t border-surface-700/50">
                <p className="text-xs text-surface-400">
                  You may need to grant notification permissions in your browser settings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
