import { useState, useEffect, useRef } from 'react'
import { Bell, Settings, Calendar } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { NotificationsDropdown } from './NotificationsDropdown'
import { NotificationsModal } from './NotificationsModal'
import { SettingsModal } from './SettingsModal'
import { ActivityIndicator } from './ActivityIndicator'
import { useNotifications } from '../hooks/useNotifications'
import { useSettings } from '../hooks/useSettings'
import { realtimeService } from '../services/realtimeService'
import { Notification } from './NotificationsModal'

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [bellShake, setBellShake] = useState(false)
  const { applyThemeSettings, settings } = useSettings()
  const isRealtimeActive = settings.notifications.enabled
  const prevUnreadCountRef = useRef(0)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleCloseSettings = () => {
    setIsSettingsOpen(false)
    // Apply theme changes when modal closes
    applyThemeSettings(settings)
  }

  const {
    notifications,
    isDropdownOpen,
    selectedNotification,
    unreadCount,
    dropdownRef,
    markAllAsRead,
    toggleDropdown,
    openNotificationModal,
    closeNotificationModal,
    addNotification,
  } = useNotifications()

  // Listen to real-time events and add them to notifications
  useEffect(() => {
    if (!settings.notifications.enabled) return

    let notificationCounter = 1000

    // Helper to create notification from event
    const createNotification = (
      type: 'success' | 'warning' | 'info' | 'insight',
      title: string,
      message: string
    ): Notification => {
      notificationCounter++
      return {
        id: `rt-${notificationCounter}`,
        type,
        title,
        message,
        time: 'Just now',
        read: false,
      }
    }

    // New order handler
    const handleNewOrder = (data: any) => {
      if (!settings.notifications.types.success) return
      addNotification(createNotification(
        'success',
        'New Order Received',
        `Order ${data.orderId} for ${data.amount} has been placed`
      ))
    }

    // AI insight handler
    const handleAIInsight = (data: any) => {
      if (!settings.notifications.types.insight) return
      addNotification(createNotification(
        'insight',
        'AI Insight',
        data.message
      ))
    }

    // Milestone handler
    const handleMilestone = (data: any) => {
      if (!settings.notifications.types.success) return
      addNotification(createNotification(
        'success',
        'Milestone Reached!',
        `Congratulations! You've reached ${data.milestone}`
      ))
    }

    // Warning handler
    const handleWarning = (data: any) => {
      if (!settings.notifications.types.warning) return
      addNotification(createNotification(
        'warning',
        'Alert',
        data.message
      ))
    }

    realtimeService.on('new-order', handleNewOrder)
    realtimeService.on('ai-insight', handleAIInsight)
    realtimeService.on('milestone', handleMilestone)
    realtimeService.on('warning', handleWarning)

    return () => {
      realtimeService.off('new-order', handleNewOrder)
      realtimeService.off('ai-insight', handleAIInsight)
      realtimeService.off('milestone', handleMilestone)
      realtimeService.off('warning', handleWarning)
    }
  }, [settings.notifications, addNotification])

  // Trigger bell shake animation when unread count increases
  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      setBellShake(true)
      const timeout = setTimeout(() => setBellShake(false), 500)
      return () => clearTimeout(timeout)
    }
    prevUnreadCountRef.current = unreadCount
  }, [unreadCount])

  return (
    <>
      <header className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-surface-50 to-accent bg-clip-text text-transparent">
            Sales Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1 text-surface-400 text-sm">
            <Calendar className="w-4 h-4 text-accent/60" />
            <span>{today}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActivityIndicator active={isRealtimeActive} />

          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={toggleDropdown}
              animate={bellShake ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={clsx(
                'p-2.5 rounded-xl relative',
                'bg-surface-800/50 hover:bg-accent/10',
                'border border-surface-700/30 hover:border-accent/50',
                'text-surface-400 hover:text-accent',
                'transition-all duration-200'
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={clsx(
                    'absolute -top-1 -right-1',
                    'w-5 h-5 rounded-full',
                    'bg-accent text-surface-950',
                    'text-xs font-bold',
                    'flex items-center justify-center',
                    'border-2 border-surface-900'
                  )}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            <NotificationsDropdown
              isOpen={isDropdownOpen}
              notifications={notifications}
              onNotificationClick={openNotificationModal}
              onMarkAllAsRead={markAllAsRead}
            />
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className={clsx(
              'p-2.5 rounded-xl',
              'bg-surface-800/50 hover:bg-accent/10',
              'border border-surface-700/30 hover:border-accent/50',
              'text-surface-400 hover:text-accent',
              'transition-all duration-200'
            )}
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className={clsx(
            'flex items-center gap-3 ml-2 pl-4',
            'border-l border-surface-700/50'
          )}>
            <div className="text-right">
              <p className="text-surface-200 text-sm font-medium">Yuvaraj</p>
              <p className="text-surface-500 text-xs">Admin</p>
            </div>
            <div className={clsx(
              'w-10 h-10 rounded-xl',
              'bg-gradient-to-br from-accent to-accent-dark',
              'flex items-center justify-center',
              'text-surface-950 font-semibold'
            )}>
              Y
            </div>
          </div>
        </div>
      </header>

      <NotificationsModal
        isOpen={!!selectedNotification}
        onClose={closeNotificationModal}
        notification={selectedNotification}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </>
  )
}
