type EventType = 'new-order' | 'ai-insight' | 'milestone' | 'warning' | 'cap-reached'

interface NewOrderEvent {
  orderId: string
  amount: string
  revenue: number
  orders: number
  conversionRate: number
  avgOrderValue: number
  order: {
    id: string
    customer: string
    product: string
    amount: number
    status: 'completed' | 'pending' | 'processing' | 'cancelled'
    date: string
  }
}

interface AIInsightEvent {
  message: string
  type: string
}

interface MilestoneEvent {
  milestone: string
  value: number
}

interface WarningEvent {
  message: string
  severity: 'low' | 'medium' | 'high'
}

class RealtimeService {
  private intervals: NodeJS.Timeout[] = []
  private listeners: Map<EventType, ((data: any) => void)[]> = new Map()
  private isRunning: boolean = false
  private eventCount: number = 0
  private readonly EVENT_CAP = 100

  // Simulated data state
  private orderCounter: number = 7891
  private currentRevenue: number = 284750
  private currentOrders: number = 1847
  private currentConversionRate: number = 3.24
  private currentAvgOrderValue: number = 154.17

  start() {
    if (this.isRunning) return
    this.isRunning = true

    // New order events (every 10-15 seconds)
    const orderInterval = setInterval(() => {
      this.triggerNewOrder()
    }, this.getRandomInterval(10000, 15000))
    this.intervals.push(orderInterval)

    // AI insight events (every 25-35 seconds)
    const insightInterval = setInterval(() => {
      this.triggerAIInsight()
    }, this.getRandomInterval(25000, 35000))
    this.intervals.push(insightInterval)

    // Random warnings (every 45-60 seconds, 30% chance)
    const warningInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        this.triggerWarning()
      }
    }, this.getRandomInterval(45000, 60000))
    this.intervals.push(warningInterval)

    // Milestone check (every 20 seconds)
    const milestoneInterval = setInterval(() => {
      this.checkMilestone()
    }, 20000)
    this.intervals.push(milestoneInterval)
  }

  stop() {
    this.isRunning = false
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals = []
  }

  on(event: EventType, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: EventType, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: EventType, data: any) {
    // Special handling for cap-reached (always emit)
    if (event === 'cap-reached') {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        callbacks.forEach(callback => callback(data))
      }
      return
    }

    // Check if cap reached for regular events
    if (this.hasReachedCap()) {
      return
    }

    // Increment count for regular events
    this.eventCount++

    // Emit the event
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }

    // Check if we just hit the cap
    if (this.eventCount === this.EVENT_CAP) {
      console.log(`Event cap of ${this.EVENT_CAP} reached!`)
      this.stop()
      this.emit('cap-reached', { totalEvents: this.eventCount })
    }
  }

  private getRandomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private triggerNewOrder() {
    const orderAmount = this.getRandomInterval(50, 500)
    this.orderCounter++
    this.currentRevenue += orderAmount
    this.currentOrders++

    // Update avg order value
    this.currentAvgOrderValue = this.currentRevenue / this.currentOrders

    // Slightly adjust conversion rate (random walk between 3.0 and 3.5)
    const conversionChange = (Math.random() - 0.5) * 0.05
    this.currentConversionRate = Math.max(3.0, Math.min(3.5, this.currentConversionRate + conversionChange))

    // Random customer names
    const customers = [
      'Sarah Mitchell', 'James Wilson', 'Emily Chen', 'Michael Brown',
      'Lisa Anderson', 'David Kim', 'Anna Martinez', 'Robert Taylor',
      'Jennifer Lee', 'Christopher White', 'Jessica Moore', 'Daniel Garcia'
    ]

    // Random products
    const products = [
      'Premium Wireless Headphones',
      'Smart Fitness Watch Pro',
      'Ergonomic Office Chair',
      'Portable Power Bank 20K',
      'Noise-Canceling Earbuds',
      'Standing Desk Converter',
      'Mechanical Keyboard RGB',
      'Webcam 4K Ultra HD'
    ]

    // Random status (mostly completed)
    const statuses: Array<'completed' | 'pending' | 'processing' | 'cancelled'> = ['completed', 'processing', 'pending']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const orderId = `ORD-${this.orderCounter}`
    const today = new Date().toISOString().split('T')[0]

    const event: NewOrderEvent = {
      orderId,
      amount: `$${orderAmount.toFixed(2)}`,
      revenue: this.currentRevenue,
      orders: this.currentOrders,
      conversionRate: this.currentConversionRate,
      avgOrderValue: this.currentAvgOrderValue,
      order: {
        id: orderId,
        customer: customers[Math.floor(Math.random() * customers.length)],
        product: products[Math.floor(Math.random() * products.length)],
        amount: orderAmount,
        status,
        date: today
      }
    }

    this.emit('new-order', event)
  }

  private triggerAIInsight() {
    const insights = [
      'Customer engagement is 23% higher during weekend hours',
      'Product bundle recommendations increased cart value by 15%',
      'Mobile users show 35% higher conversion on Thursdays',
      'Email campaigns sent at 10 AM have 40% better open rates',
      'Customers browsing 3+ products are 60% more likely to purchase',
      'Free shipping threshold at $75 optimizes profit margins'
    ]

    const event: AIInsightEvent = {
      message: insights[Math.floor(Math.random() * insights.length)],
      type: 'behavioral'
    }

    this.emit('ai-insight', event)
  }

  private checkMilestone() {
    const milestones = [
      { threshold: 125000, label: '$125K Revenue' },
      { threshold: 130000, label: '$130K Revenue' },
      { threshold: 135000, label: '$135K Revenue' },
      { threshold: 140000, label: '$140K Revenue' }
    ]

    const milestone = milestones.find(m =>
      this.currentRevenue >= m.threshold &&
      this.currentRevenue - 500 < m.threshold // Recently crossed
    )

    if (milestone) {
      const event: MilestoneEvent = {
        milestone: milestone.label,
        value: this.currentRevenue
      }

      this.emit('milestone', event)
    }
  }

  private triggerWarning() {
    const warnings = [
      'API response time increased by 15% in the last hour',
      'Inventory running low on 3 popular products',
      'Unusual traffic spike detected from new region',
      'Payment gateway latency above normal threshold'
    ]

    const event: WarningEvent = {
      message: warnings[Math.floor(Math.random() * warnings.length)],
      severity: 'medium'
    }

    this.emit('warning', event)
  }

  // Getters for current state (useful for debugging)
  get currentMetrics() {
    return {
      revenue: this.currentRevenue,
      orders: this.currentOrders,
      conversionRate: this.currentConversionRate,
      avgOrderValue: this.currentAvgOrderValue
    }
  }

  getEventCount(): number {
    return this.eventCount
  }

  hasReachedCap(): boolean {
    return this.eventCount >= this.EVENT_CAP
  }

  getRemainingEvents(): number {
    return Math.max(0, this.EVENT_CAP - this.eventCount)
  }
}

export const realtimeService = new RealtimeService()
