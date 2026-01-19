// Mock sales data for the dashboard
// This simulates real business metrics

export interface SalesMetric {
  label: string
  value: number
  previousValue: number
  format: 'currency' | 'number' | 'percent'
  trend: 'up' | 'down' | 'neutral'
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
  customers: number
}

export interface ProductSale {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  growth: number
}

export interface RegionData {
  region: string
  revenue: number
  percentage: number
}

export interface RecentOrder {
  id: string
  customer: string
  product: string
  amount: number
  status: 'completed' | 'pending' | 'processing' | 'cancelled'
  date: string
}

// Key metrics for the top cards
export const keyMetrics: SalesMetric[] = [
  {
    label: 'Total Revenue',
    value: 284750,
    previousValue: 251200,
    format: 'currency',
    trend: 'up',
  },
  {
    label: 'Total Orders',
    value: 1847,
    previousValue: 1654,
    format: 'number',
    trend: 'up',
  },
  {
    label: 'Conversion Rate',
    value: 3.24,
    previousValue: 2.98,
    format: 'percent',
    trend: 'up',
  },
  {
    label: 'Avg Order Value',
    value: 154.17,
    previousValue: 151.87,
    format: 'currency',
    trend: 'up',
  },
]

// Monthly revenue data for charts
export const revenueData: RevenueDataPoint[] = [
  { date: '2024-07', revenue: 185000, orders: 1205, customers: 892 },
  { date: '2024-08', revenue: 198500, orders: 1298, customers: 945 },
  { date: '2024-09', revenue: 215200, orders: 1389, customers: 1023 },
  { date: '2024-10', revenue: 232800, orders: 1456, customers: 1098 },
  { date: '2024-11', revenue: 251200, orders: 1654, customers: 1187 },
  { date: '2024-12', revenue: 284750, orders: 1847, customers: 1342 },
]

// Weekly revenue for more granular view
export const weeklyRevenueData: RevenueDataPoint[] = [
  { date: 'Week 1', revenue: 62500, orders: 412, customers: 298 },
  { date: 'Week 2', revenue: 71200, orders: 468, customers: 342 },
  { date: 'Week 3', revenue: 68900, orders: 445, customers: 318 },
  { date: 'Week 4', revenue: 82150, orders: 522, customers: 384 },
]

// Top selling products
export const topProducts: ProductSale[] = [
  { id: '1', name: 'Premium Wireless Headphones', category: 'Electronics', sales: 847, revenue: 84700, growth: 23.5 },
  { id: '2', name: 'Smart Fitness Watch Pro', category: 'Wearables', sales: 623, revenue: 62300, growth: 18.2 },
  { id: '3', name: 'Ergonomic Office Chair', category: 'Furniture', sales: 412, revenue: 45320, growth: 12.8 },
  { id: '4', name: 'Portable Power Bank 20K', category: 'Electronics', sales: 589, revenue: 29450, growth: 31.4 },
  { id: '5', name: 'Noise-Canceling Earbuds', category: 'Electronics', sales: 756, revenue: 26460, growth: 15.7 },
  { id: '6', name: 'Standing Desk Converter', category: 'Furniture', sales: 234, revenue: 23400, growth: 8.9 },
  { id: '7', name: 'Mechanical Keyboard RGB', category: 'Electronics', sales: 445, revenue: 22250, growth: 27.3 },
  { id: '8', name: 'Webcam 4K Ultra HD', category: 'Electronics', sales: 378, revenue: 18900, growth: 14.2 },
]

// Revenue by region
export const regionData: RegionData[] = [
  { region: 'North America', revenue: 128137, percentage: 45 },
  { region: 'Europe', revenue: 71187, percentage: 25 },
  { region: 'Asia Pacific', revenue: 56950, percentage: 20 },
  { region: 'Rest of World', revenue: 28476, percentage: 10 },
]

// Recent orders - using dynamic dates to stay current
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const twoDaysAgo = new Date(today)
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

const formatDate = (date: Date) => date.toISOString().split('T')[0]

export const recentOrders: RecentOrder[] = [
  { id: 'ORD-7891', customer: 'Sarah Mitchell', product: 'Premium Wireless Headphones', amount: 199.99, status: 'completed', date: formatDate(today) },
  { id: 'ORD-7890', customer: 'James Wilson', product: 'Smart Fitness Watch Pro', amount: 299.99, status: 'processing', date: formatDate(today) },
  { id: 'ORD-7889', customer: 'Emily Chen', product: 'Ergonomic Office Chair', amount: 449.99, status: 'completed', date: formatDate(yesterday) },
  { id: 'ORD-7888', customer: 'Michael Brown', product: 'Portable Power Bank 20K', amount: 49.99, status: 'pending', date: formatDate(yesterday) },
  { id: 'ORD-7887', customer: 'Lisa Anderson', product: 'Noise-Canceling Earbuds', amount: 149.99, status: 'completed', date: formatDate(yesterday) },
  { id: 'ORD-7886', customer: 'David Kim', product: 'Mechanical Keyboard RGB', amount: 89.99, status: 'completed', date: formatDate(twoDaysAgo) },
  { id: 'ORD-7885', customer: 'Anna Martinez', product: 'Webcam 4K Ultra HD', amount: 129.99, status: 'processing', date: formatDate(twoDaysAgo) },
  { id: 'ORD-7884', customer: 'Robert Taylor', product: 'Standing Desk Converter', amount: 349.99, status: 'cancelled', date: formatDate(twoDaysAgo) },
]

// Category breakdown
export const categoryData = [
  { category: 'Electronics', revenue: 181760, orders: 1015, percentage: 63.8 },
  { category: 'Furniture', revenue: 68720, orders: 646, percentage: 24.1 },
  { category: 'Wearables', revenue: 34270, orders: 186, percentage: 12.1 },
]

// Helper function to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Helper function to format numbers
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

// Helper function to format percentage
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

// Helper to calculate percentage change
export function calculateChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100
}

// Historical event tracking for AI context
export interface HistoricalEvent {
  id: string
  timestamp: number
  type: 'new-order' | 'ai-insight' | 'milestone' | 'warning'
  data: any
}

let eventHistory: HistoricalEvent[] = []
let eventIdCounter = 0

export function addEventToHistory(
  type: 'new-order' | 'ai-insight' | 'milestone' | 'warning',
  data: any
): void {
  eventIdCounter++
  eventHistory.push({
    id: `EVENT-${eventIdCounter}`,
    timestamp: Date.now(),
    type,
    data
  })
}

export function getEventHistory(): HistoricalEvent[] {
  return [...eventHistory]
}

export function getEventCount(): number {
  return eventHistory.length
}

function formatEventSummary(event: HistoricalEvent): string {
  switch (event.type) {
    case 'new-order':
      return `Order ${event.data.orderId} - ${event.data.amount}`
    case 'ai-insight':
      return event.data.message
    case 'milestone':
      return `Reached ${event.data.milestone}`
    case 'warning':
      return event.data.message
    default:
      return 'Unknown event'
  }
}

// Store live metrics for AI access
let liveMetrics: SalesMetric[] | null = null
let liveRecentOrders: RecentOrder[] | null = null

// SEPARATE append-only order history for AI (never deletes, only appends)
// Initialize with the static initial orders so AI has access to them
let orderHistory: RecentOrder[] = [...recentOrders]

export function updateLiveMetrics(metrics: SalesMetric[]) {
  liveMetrics = metrics
}

export function updateLiveRecentOrders(orders: RecentOrder[]) {
  liveRecentOrders = orders
}

// Add order to append-only history (for AI to access ALL orders)
export function addOrderToHistory(order: RecentOrder): void {
  orderHistory.push(order)
}

// Get full order history (append-only, never deleted)
export function getOrderHistory(): RecentOrder[] {
  return [...orderHistory]
}

// Get count of all orders in history
export function getOrderHistoryCount(): number {
  return orderHistory.length
}

// Get a summary of the data for AI context
export function getDataSummary(): string {
  // Use live metrics if available, otherwise use static data
  const metrics = liveMetrics || keyMetrics

  const totalRevenue = metrics[0].value
  const totalOrders = metrics[1].value
  const conversionRate = metrics[2].value
  const avgOrderValue = metrics[3].value

  const revenueChange = calculateChange(keyMetrics[0].value, keyMetrics[0].previousValue)
  const ordersChange = calculateChange(keyMetrics[1].value, keyMetrics[1].previousValue)

  const topProduct = topProducts[0]
  const topRegion = regionData[0]

  // Use live recent orders if available, and sort them properly
  const orders = (liveRecentOrders || recentOrders).slice().sort((a, b) => {
    // First sort by date (newest first)
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare

    // If dates are equal, sort by order ID (higher ID = newer)
    const aNum = parseInt(a.id.split('-')[1])
    const bNum = parseInt(b.id.split('-')[1])
    return bNum - aNum
  })

  return `
================================================================================
SALES DASHBOARD DATA SUMMARY - Current Period: December 2024
================================================================================

IMPORTANT INSTRUCTIONS FOR AI:
- When asked for "last 10 orders", refer ONLY to the "INDIVIDUAL CUSTOMER ORDERS" section below
- Order IDs are in format ORD-XXXX where XXXX is a 4-digit number (7000+ series)
- Do NOT confuse product sales totals with individual order amounts
- The numbered list (1-10) in INDIVIDUAL CUSTOMER ORDERS is just for display - use the actual Order ID

KEY METRICS:
- Total Revenue: ${formatCurrency(totalRevenue)} (${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}% vs last period)
- Total Orders: ${formatNumber(totalOrders)} (${ordersChange > 0 ? '+' : ''}${ordersChange.toFixed(1)}% vs last period)
- Conversion Rate: ${conversionRate}%
- Average Order Value: ${formatCurrency(avgOrderValue)}

REVENUE TREND (Last 6 Months):
${revenueData.map(d => `- ${d.date}: ${formatCurrency(d.revenue)}`).join('\n')}

TOP SELLING PRODUCTS (By Total Revenue - NOT individual orders):
${topProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.name}: Total Revenue ${formatCurrency(p.revenue)}, Total Units Sold: ${p.sales}, Growth: ${p.growth > 0 ? '+' : ''}${p.growth}%`).join('\n')}

REVENUE BY REGION:
${regionData.map(r => `- ${r.region}: ${formatCurrency(r.revenue)} (${r.percentage}%)`).join('\n')}

CATEGORY BREAKDOWN:
${categoryData.map(c => `- ${c.category}: ${formatCurrency(c.revenue)} (${c.percentage}% of total)`).join('\n')}

RECENT ACTIVITY:
- Completed orders today: ${orders.filter(o => o.status === 'completed').length}
- Processing orders: ${orders.filter(o => o.status === 'processing').length}
- Pending orders: ${orders.filter(o => o.status === 'pending').length}

INDIVIDUAL CUSTOMER ORDERS (Most Recent 10 Orders - IDs start with ORD-7000+):
${orders.slice(0, 10).map((o, idx) => {
  // Validate order data
  const orderId = o.id || 'UNKNOWN'
  const date = o.date || 'Unknown'
  const customer = o.customer || 'Unknown Customer'
  const product = o.product || 'Unknown Product'
  const amount = typeof o.amount === 'number' ? formatCurrency(o.amount) : '$0.00'
  const status = o.status || 'unknown'

  return `${idx + 1}. Order ID: ${orderId}, Date: ${date}, Customer: ${customer}, Product: ${product}, Amount: ${amount}, Status: ${status}`
}).join('\n')}

================================================================================
COMPLETE ORDER HISTORY (Append-Only - ALL Orders Ever Placed)
================================================================================
Total Orders in History: ${orderHistory.length}

${orderHistory.length === 0 ? 'No orders in history yet...' :
`All Orders (sorted newest first):
${orderHistory.slice().reverse().map((o, idx) => {
  const orderId = o.id || 'UNKNOWN'
  const date = o.date || 'Unknown'
  const customer = o.customer || 'Unknown Customer'
  const product = o.product || 'Unknown Product'
  const amount = typeof o.amount === 'number' ? formatCurrency(o.amount) : '$0.00'
  const status = o.status || 'unknown'

  return `${idx + 1}. Order ID: ${orderId}, Date: ${date}, Customer: ${customer}, Product: ${product}, Amount: ${amount}, Status: ${status}`
}).join('\n')}`}

================================================================================
REAL-TIME EVENT SYSTEM INFORMATION (For Dashboard Activity Tracking)
================================================================================

EVENT STATISTICS:
- Total Events Generated: ${eventHistory.length}
  - New Order Events: ${eventHistory.filter(e => e.type === 'new-order').length}
  - AI Insight Events: ${eventHistory.filter(e => e.type === 'ai-insight').length}
  - Milestone Events: ${eventHistory.filter(e => e.type === 'milestone').length}
  - Warning Events: ${eventHistory.filter(e => e.type === 'warning').length}
- System Status: ${eventHistory.length >= 100 ? 'CAP REACHED (100/100 - No new events will be generated)' : `Active (${eventHistory.length}/100 events)`}

RECENT EVENT TIMELINE (Last 10 real-time events):
${eventHistory.length === 0 ? 'No events yet - waiting for first event...' : eventHistory.slice(-10).reverse().map(e => {
  const time = new Date(e.timestamp).toLocaleTimeString()
  return `- [${time}] ${e.type.toUpperCase()}: ${formatEventSummary(e)}`
}).join('\n')}

NOTE: The event timeline shows real-time system events. New order events in this timeline
are separate from the "MOST RECENT ORDERS" list above - they represent event notifications,
not the actual order details.
`.trim()
}
