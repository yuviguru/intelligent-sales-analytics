import { BarChart3, ShoppingCart, Package, Map, Clock, Activity } from 'lucide-react'
import { clsx } from 'clsx'
import { useSettings } from '../../hooks/useSettings'

const WIDGETS = [
  {
    key: 'metrics' as const,
    name: 'Key Metrics',
    description: 'Revenue, orders, and conversion metrics',
    icon: Activity,
  },
  {
    key: 'revenueChart' as const,
    name: 'Revenue Chart',
    description: 'Revenue trends over time',
    icon: BarChart3,
  },
  {
    key: 'ordersChart' as const,
    name: 'Orders Chart',
    description: 'Order volume visualization',
    icon: ShoppingCart,
  },
  {
    key: 'topProducts' as const,
    name: 'Top Products',
    description: 'Best selling products table',
    icon: Package,
  },
  {
    key: 'regionChart' as const,
    name: 'Regional Distribution',
    description: 'Sales by region breakdown',
    icon: Map,
  },
  {
    key: 'recentOrders' as const,
    name: 'Recent Orders',
    description: 'Latest customer orders',
    icon: Clock,
  },
]

export function DashboardTab() {
  const { settings, updateSettings } = useSettings()

  const visibleCount = Object.values(settings.dashboard.widgets).filter(Boolean).length

  const toggleWidget = (key: keyof typeof settings.dashboard.widgets) => {
    updateSettings({
      dashboard: {
        ...settings.dashboard,
        widgets: {
          ...settings.dashboard.widgets,
          [key]: !settings.dashboard.widgets[key],
        },
      },
    })
  }

  return (
    <div className="space-y-8">
      {/* Widget Visibility */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-surface-50">Widget Visibility</h3>
          <span className="text-sm font-medium text-accent">
            {visibleCount} of {WIDGETS.length} visible
          </span>
        </div>
        <p className="text-sm text-surface-400 mb-4">Choose which widgets to display on your dashboard</p>

        <div className="grid grid-cols-2 gap-3">
          {WIDGETS.map((widget) => {
            const Icon = widget.icon
            const isVisible = settings.dashboard.widgets[widget.key]
            return (
              <button
                key={widget.key}
                onClick={() => toggleWidget(widget.key)}
                className={clsx(
                  'p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isVisible
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'p-2 rounded-lg flex-shrink-0',
                    isVisible ? 'bg-accent/20 text-accent' : 'bg-surface-700/50 text-surface-400'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-surface-200 mb-1">{widget.name}</div>
                    <p className="text-xs text-surface-400">{widget.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={clsx(
                      'relative w-11 h-6 rounded-full transition-colors duration-200',
                      isVisible ? 'bg-accent' : 'bg-surface-700'
                    )}>
                      <div className={clsx(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                        isVisible ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Chart Preferences</h3>
        <p className="text-sm text-surface-400 mb-4">Default chart view settings</p>

        <div className="space-y-3">
          {/* Default Chart View */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div>
              <div className="font-medium text-surface-200">Default View</div>
              <div className="text-sm text-surface-400 mt-1">Initial time range for charts</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings({ dashboard: { ...settings.dashboard, defaultChartView: 'monthly' } })}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                  settings.dashboard.defaultChartView === 'monthly'
                    ? 'bg-accent text-surface-950'
                    : 'bg-surface-700/50 text-surface-300 hover:bg-surface-700'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => updateSettings({ dashboard: { ...settings.dashboard, defaultChartView: 'weekly' } })}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                  settings.dashboard.defaultChartView === 'weekly'
                    ? 'bg-accent text-surface-950'
                    : 'bg-surface-700/50 text-surface-300 hover:bg-surface-700'
                )}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div>
              <div className="font-medium text-surface-200">Compact Mode</div>
              <div className="text-sm text-surface-400 mt-1">Reduce spacing and set font to small</div>
            </div>
            <button
              onClick={() => updateSettings({
                dashboard: { ...settings.dashboard, compactMode: !settings.dashboard.compactMode },
                appearance: { ...settings.appearance, fontSize: !settings.dashboard.compactMode ? 'small' : 'medium' }
              })}
              className={clsx(
                'relative w-12 h-6 rounded-full transition-colors duration-200',
                settings.dashboard.compactMode ? 'bg-accent' : 'bg-surface-700'
              )}
            >
              <div className={clsx(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                settings.dashboard.compactMode ? 'translate-x-6' : 'translate-x-0.5'
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Settings */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Auto-Refresh</h3>
        <p className="text-sm text-surface-400 mb-4">Automatically refresh dashboard data</p>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            Refresh Interval
          </label>
          <select
            value={settings.dashboard.refreshInterval}
            onChange={(e) => updateSettings({ dashboard: { ...settings.dashboard, refreshInterval: parseInt(e.target.value) } })}
            className={clsx(
              'w-full px-4 py-2.5 rounded-xl',
              'bg-surface-800 border border-surface-700',
              'text-surface-100',
              'focus:outline-none focus:border-accent',
              'transition-all duration-200'
            )}
          >
            <option value="0">Off - Manual refresh only</option>
            <option value="1">Every 1 minute</option>
            <option value="5">Every 5 minutes</option>
            <option value="15">Every 15 minutes</option>
            <option value="30">Every 30 minutes</option>
          </select>
        </div>
      </div>
    </div>
  )
}
