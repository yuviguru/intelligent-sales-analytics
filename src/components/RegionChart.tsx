import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { regionData, formatCurrency } from '../data/sales-data'

ChartJS.register(ArcElement, Tooltip, Legend)

export function RegionChart() {
  const chartData = {
    labels: regionData.map(r => r.region),
    datasets: [
      {
        data: regionData.map(r => r.revenue),
        backgroundColor: [
          '#06b6d4', // accent
          '#0891b2', // accent-dark
          '#22d3ee', // accent-light
          '#334155', // surface-700
        ],
        borderColor: '#0f172a',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
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
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            return `${context.label}: ${formatCurrency(context.parsed)}`
          },
        },
      },
    },
  }

  return (
    <div className="flex items-center gap-8">
      <div className="w-48 h-48">
        <Doughnut data={chartData} options={options} />
      </div>
      
      <div className="flex-1 space-y-3">
        {regionData.map((region, index) => {
          const colors = ['bg-accent', 'bg-accent-dark', 'bg-accent-light', 'bg-surface-600']
          return (
            <div key={region.region} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-surface-300 text-sm">{region.region}</span>
                  <span className="text-surface-100 font-mono text-sm">
                    {formatCurrency(region.revenue)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colors[index]} rounded-full transition-all duration-1000`}
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
