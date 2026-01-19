import { useState } from 'react'
import { X, Brain, LayoutDashboard, Palette, Bell, RotateCcw, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useSettings } from '../hooks/useSettings'
import { AIAssistantTab } from './settings/AIAssistantTab'
import { DashboardTab } from './settings/DashboardTab'
import { AppearanceTab } from './settings/AppearanceTab'
import { NotificationsTab } from './settings/NotificationsTab'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'ai' | 'dashboard' | 'appearance' | 'notifications'

const TABS = [
  { id: 'ai' as const, label: 'AI Assistant', icon: Brain },
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
]

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('ai')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const { resetToDefaults, hasUnsavedChanges } = useSettings()

  if (!isOpen) return null

  const handleReset = () => {
    resetToDefaults()
    setShowResetConfirm(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai':
        return <AIAssistantTab />
      case 'dashboard':
        return <DashboardTab />
      case 'appearance':
        return <AppearanceTab />
      case 'notifications':
        return <NotificationsTab />
    }
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-surface-950/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={clsx(
            'relative w-full max-w-4xl',
            'bg-surface-900/95 backdrop-blur-xl rounded-2xl',
            'border border-surface-700/50',
            'shadow-2xl',
            'max-h-[85vh] flex flex-col',
            'animate-in fade-in zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-700/50">
            <div>
              <h2 className="text-2xl font-bold text-surface-50">Settings</h2>
              <p className={clsx(
                "text-sm text-accent mt-1 flex items-center gap-1.5",
                "transition-opacity duration-200",
                hasUnsavedChanges ? "opacity-100" : "opacity-0"
              )}>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Auto-saving...
              </p>
            </div>
            <button
              onClick={onClose}
              className={clsx(
                'p-2 rounded-xl',
                'bg-surface-800/50 hover:bg-surface-800',
                'text-surface-400 hover:text-surface-200',
                'transition-all duration-200'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs + Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Tab Navigation */}
            <div className="w-56 border-r border-surface-700/50 p-4 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                      'transition-all duration-200',
                      isActive
                        ? 'bg-accent text-surface-950 shadow-lg shadow-accent/20'
                        : 'text-surface-300 hover:bg-surface-800/50 hover:text-surface-100'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                )
              })}

              {/* Reset Button */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-4',
                  'text-surface-400 hover:text-warning hover:bg-warning/10',
                  'border border-surface-700/50 hover:border-warning/30',
                  'transition-all duration-200'
                )}
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium text-sm">Reset to Defaults</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-surface-700/50">
            <p className="text-sm text-surface-500">
              Settings are saved automatically
            </p>
            <button
              onClick={onClose}
              className={clsx(
                'px-6 py-2.5 rounded-xl flex items-center gap-2',
                'bg-accent hover:bg-accent-light',
                'text-surface-950 font-medium',
                'transition-all duration-200',
                'hover:scale-105 active:scale-95'
              )}
            >
              <Check className="w-4 h-4" />
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-surface-950/90 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          />
          <div
            className={clsx(
              'relative w-full max-w-md',
              'bg-surface-900 rounded-2xl',
              'border border-surface-700/50',
              'shadow-2xl p-6',
              'animate-in fade-in zoom-in-95 duration-200'
            )}
          >
            <h3 className="text-xl font-bold text-surface-50 mb-2">
              Reset to Defaults?
            </h3>
            <p className="text-surface-400 mb-6">
              This will reset all settings to their default values. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={clsx(
                  'flex-1 px-4 py-2.5 rounded-xl',
                  'bg-surface-800 hover:bg-surface-700',
                  'text-surface-200',
                  'transition-all duration-200'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className={clsx(
                  'flex-1 px-4 py-2.5 rounded-xl',
                  'bg-warning hover:bg-warning-light',
                  'text-surface-950 font-medium',
                  'transition-all duration-200'
                )}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
