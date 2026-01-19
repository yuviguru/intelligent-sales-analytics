import { clsx } from 'clsx'
import { recentOrders, formatCurrency, RecentOrder } from '../data/sales-data'

const statusStyles = {
  completed: 'bg-success/10 text-success',
  processing: 'bg-warning/10 text-warning',
  pending: 'bg-surface-600/50 text-surface-300',
  cancelled: 'bg-danger/10 text-danger',
}

interface RecentOrdersProps {
  orders?: RecentOrder[]
}

export function RecentOrders({ orders = recentOrders }: RecentOrdersProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-700/50">
            <th className="text-left py-3 px-4 text-surface-400 text-xs font-medium uppercase tracking-wider">
              Order ID
            </th>
            <th className="text-left py-3 px-4 text-surface-400 text-xs font-medium uppercase tracking-wider">
              Customer
            </th>
            <th className="text-left py-3 px-4 text-surface-400 text-xs font-medium uppercase tracking-wider">
              Product
            </th>
            <th className="text-right py-3 px-4 text-surface-400 text-xs font-medium uppercase tracking-wider">
              Amount
            </th>
            <th className="text-center py-3 px-4 text-surface-400 text-xs font-medium uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr 
              key={order.id}
              className={clsx(
                'border-b border-surface-800/50 hover:bg-surface-800/30',
                'transition-colors duration-150',
                'animate-fade-in opacity-0'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <td className="py-3 px-4">
                <span className="font-mono text-sm text-accent">{order.id}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-surface-200">{order.customer}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-surface-300 text-sm">{order.product}</span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="font-mono text-surface-100">
                  {formatCurrency(order.amount)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <span className={clsx(
                    'px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    statusStyles[order.status]
                  )}>
                    {order.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
