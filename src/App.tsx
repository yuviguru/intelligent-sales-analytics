import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from './components/Header'
import { MetricCard } from './components/MetricCard'
import { DashboardCard } from './components/DashboardCard'
import { RevenueChart, OrdersChart } from './components/RevenueChart'
import { TopProducts } from './components/TopProducts'
import { RegionChart } from './components/RegionChart'
import { RecentOrders } from './components/RecentOrders'
import { AIInsightsPanel } from './components/AIInsightsPanel'
import { ToastContainer } from './components/ToastContainer'
import { AppMotionConfig } from './components/MotionConfig'
import { SettingsProvider } from './contexts/SettingsContext'
import { ToastProvider, useToast } from './hooks/useToast.tsx'
import { useSettings } from './hooks/useSettings'
import { keyMetrics, recentOrders as initialOrders, RecentOrder, updateLiveMetrics, updateLiveRecentOrders, addEventToHistory, addOrderToHistory } from './data/sales-data'
import { createStaggerContainer } from './utils/animations'
import { realtimeService } from './services/realtimeService'
import { soundService } from './services/soundService'
import { clsx } from 'clsx'

type ChartView = 'monthly' | 'weekly'

function DashboardContent() {
  const { settings, appliedSettings, applyThemeSettings } = useSettings()
  const { addToast } = useToast()
  const [revenueView, setRevenueView] = useState<ChartView>(appliedSettings.dashboard.defaultChartView)
  const [metrics, setMetrics] = useState(keyMetrics)
  const [liveRevenueData, setLiveRevenueData] = useState<number | null>(null)
  const [liveOrdersData, setLiveOrdersData] = useState<number | null>(null)
  const [recentOrdersList, setRecentOrdersList] = useState<RecentOrder[]>(initialOrders)

  // Apply theme on mount only
  useEffect(() => {
    applyThemeSettings(settings)
  }, [])

  // Sync revenueView when default chart view changes
  useEffect(() => {
    setRevenueView(appliedSettings.dashboard.defaultChartView)
  }, [appliedSettings.dashboard.defaultChartView])

  // Sync sound settings
  useEffect(() => {
    soundService.setEnabled(settings.notifications.soundEnabled)
  }, [settings.notifications.soundEnabled])

  // Update live metrics for AI whenever metrics change
  useEffect(() => {
    updateLiveMetrics(metrics)
  }, [metrics])

  // Update live recent orders for AI whenever orders change
  useEffect(() => {
    updateLiveRecentOrders(recentOrdersList)
  }, [recentOrdersList])

  // Start real-time updates
  useEffect(() => {
    if (!settings.notifications.enabled) return

    realtimeService.start()

    // New order handler
    const handleNewOrder = (data: any) => {
      addEventToHistory('new-order', data)

      if (!settings.notifications.types.success) return

      // Update all metrics
      setMetrics(prev => prev.map(m => {
        if (m.label === 'Total Revenue') {
          return { ...m, value: data.revenue }
        }
        if (m.label === 'Total Orders') {
          return { ...m, value: data.orders }
        }
        if (m.label === 'Conversion Rate') {
          return { ...m, value: data.conversionRate }
        }
        if (m.label === 'Avg Order Value') {
          return { ...m, value: data.avgOrderValue }
        }
        return m
      }))

      // Update chart data
      setLiveRevenueData(data.revenue)
      setLiveOrdersData(data.orders)

      // Add new order to the recent orders list (prepend and keep only 10 for display)
      if (data.order) {
        setRecentOrdersList(prev => [data.order, ...prev].slice(0, 10))

        // ALSO add to append-only order history (for AI to access ALL orders)
        addOrderToHistory(data.order)
      }

      // Show toast
      addToast({
        type: 'success',
        title: 'New Order',
        message: `Order ${data.orderId} received - ${data.amount}`,
        sound: settings.notifications.soundEnabled
      })
    }

    // AI insight handler
    const handleAIInsight = (data: any) => {
      addEventToHistory('ai-insight', data)

      if (!settings.notifications.types.insight) return

      addToast({
        type: 'insight',
        title: 'AI Insight',
        message: data.message,
        sound: settings.notifications.soundEnabled
      })
    }

    // Milestone handler
    const handleMilestone = (data: any) => {
      addEventToHistory('milestone', data)

      if (!settings.notifications.types.success) return

      addToast({
        type: 'success',
        title: 'Milestone Reached!',
        message: `Congratulations! You've reached ${data.milestone}`,
        sound: settings.notifications.soundEnabled,
        duration: 7000
      })
    }

    // Warning handler
    const handleWarning = (data: any) => {
      addEventToHistory('warning', data)

      if (!settings.notifications.types.warning) return

      addToast({
        type: 'warning',
        title: 'Alert',
        message: data.message,
        sound: settings.notifications.soundEnabled,
        duration: 8000
      })
    }

    // Cap reached handler
    const handleCapReached = (data: any) => {
      addToast({
        type: 'info',
        title: 'Event Cap Reached',
        message: `Real-time updates stopped after ${data.totalEvents} events`,
        sound: settings.notifications.soundEnabled,
        duration: 10000
      })
    }

    realtimeService.on('new-order', handleNewOrder)
    realtimeService.on('ai-insight', handleAIInsight)
    realtimeService.on('milestone', handleMilestone)
    realtimeService.on('warning', handleWarning)
    realtimeService.on('cap-reached', handleCapReached)

    return () => {
      realtimeService.stop()
      realtimeService.off('new-order', handleNewOrder)
      realtimeService.off('ai-insight', handleAIInsight)
      realtimeService.off('milestone', handleMilestone)
      realtimeService.off('warning', handleWarning)
      realtimeService.off('cap-reached', handleCapReached)
    }
  }, [settings.notifications, addToast])

  const spacing = appliedSettings.dashboard.compactMode ? 'gap-3 mb-3' : 'gap-4 mb-6'
  const largeSpacing = appliedSettings.dashboard.compactMode ? 'gap-3 mb-3' : 'gap-6 mb-6'

  return (
    <div className="min-h-screen bg-surface-950 noise-overlay">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent/5 via-transparent to-surface-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pb-24">
        <Header />

        {/* Key Metrics Row */}
        {appliedSettings.dashboard.widgets.metrics && (
          <motion.div
            variants={createStaggerContainer(0.05, 0.1)}
            initial="hidden"
            animate="visible"
            className={clsx(
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
              spacing
            )}>
            {metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                metric={metric}
                compact={appliedSettings.dashboard.compactMode}
              />
            ))}
          </motion.div>
        )}

        {/* Charts Row */}
        {(appliedSettings.dashboard.widgets.revenueChart || appliedSettings.dashboard.widgets.ordersChart) && (
          <div className={clsx('grid grid-cols-1 lg:grid-cols-3 transition-all duration-300 ease-out', largeSpacing)}>
            {appliedSettings.dashboard.widgets.revenueChart && (
              <DashboardCard
                title="Revenue Overview"
                subtitle="Track your earnings over time"
                className={appliedSettings.dashboard.widgets.ordersChart ? "lg:col-span-2" : "lg:col-span-3"}
                delay={200}
                compact={appliedSettings.dashboard.compactMode}
                action={
                  <div className="flex gap-1 p-1 bg-surface-800/50 rounded-lg">
                    {(['monthly', 'weekly'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setRevenueView(view)}
                        className={clsx(
                          'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all',
                          revenueView === view
                            ? 'bg-accent text-surface-950'
                            : 'text-surface-400 hover:text-surface-200'
                        )}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                }
              >
                <RevenueChart view={revenueView} liveRevenue={liveRevenueData} />
              </DashboardCard>
            )}

            {appliedSettings.dashboard.widgets.ordersChart && (
              <DashboardCard
                title="Orders"
                subtitle="Monthly order volume"
                delay={250}
                compact={appliedSettings.dashboard.compactMode}
              >
                <OrdersChart liveOrders={liveOrdersData} />
              </DashboardCard>
            )}
          </div>
        )}

        {/* Middle Row */}
        {(appliedSettings.dashboard.widgets.topProducts || appliedSettings.dashboard.widgets.regionChart) && (
          <div className={clsx('grid grid-cols-1 lg:grid-cols-2 transition-all duration-300 ease-out', largeSpacing)}>
            {appliedSettings.dashboard.widgets.topProducts && (
              <DashboardCard
                title="Top Products"
                subtitle="Best performing items"
                delay={300}
                compact={appliedSettings.dashboard.compactMode}
              >
                <TopProducts />
              </DashboardCard>
            )}

            {appliedSettings.dashboard.widgets.regionChart && (
              <DashboardCard
                title="Revenue by Region"
                subtitle="Geographic distribution"
                delay={350}
                compact={appliedSettings.dashboard.compactMode}
              >
                <RegionChart />
              </DashboardCard>
            )}
          </div>
        )}

        {/* Recent Orders */}
        {appliedSettings.dashboard.widgets.recentOrders && (
          <DashboardCard
            title="Recent Orders"
            subtitle="Latest transactions"
            delay={400}
            compact={appliedSettings.dashboard.compactMode}
          >
            <RecentOrders orders={recentOrdersList} />
          </DashboardCard>
        )}
      </div>

      {/* AI Insights Panel */}
      <AIInsightsPanel />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <AppMotionConfig>
          <DashboardContent />
        </AppMotionConfig>
      </ToastProvider>
    </SettingsProvider>
  )
}

export default App
