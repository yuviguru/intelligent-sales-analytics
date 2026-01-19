import { useEffect, useRef, useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { revenueData, weeklyRevenueData, formatCurrency, RevenueDataPoint } from '../data/sales-data'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RevenueChartProps {
  view?: 'monthly' | 'weekly'
  liveRevenue?: number | null
}

export function RevenueChart({ view = 'monthly', liveRevenue = null }: RevenueChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null)
  const baseData = view === 'monthly' ? revenueData : weeklyRevenueData

  // Update the last data point with live data if available
  const data = useMemo(() => {
    if (liveRevenue === null) return baseData

    const updatedData = [...baseData]
    if (updatedData.length > 0) {
      updatedData[updatedData.length - 1] = {
        ...updatedData[updatedData.length - 1],
        revenue: liveRevenue
      }
    }
    return updatedData
  }, [baseData, liveRevenue])

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#06b6d4',
        backgroundColor: (context: { chart: ChartJS }) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            return `Revenue: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'DM Sans',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'DM Sans',
          },
          callback: (value: number | string) => formatCurrency(Number(value)),
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}

interface OrdersChartProps {
  liveOrders?: number | null
}

export function OrdersChart({ liveOrders = null }: OrdersChartProps) {
  // Update the last data point with live data if available
  const data = useMemo(() => {
    if (liveOrders === null) return revenueData

    const updatedData = [...revenueData]
    if (updatedData.length > 0) {
      updatedData[updatedData.length - 1] = {
        ...updatedData[updatedData.length - 1],
        orders: liveOrders
      }
    }
    return updatedData
  }, [liveOrders])

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Orders',
        data: data.map(d => d.orders),
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'DM Sans',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'DM Sans',
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  )
}
