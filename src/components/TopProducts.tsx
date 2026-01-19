import { TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { topProducts, formatCurrency } from '../data/sales-data'

export function TopProducts() {
  return (
    <div className="space-y-3">
      {topProducts.slice(0, 5).map((product, index) => (
        <div
          key={product.id}
          className={clsx(
            'flex items-center gap-4 p-4 rounded-xl',
            'bg-surface-800/50 hover:bg-surface-800',
            'border border-surface-700/30 hover:border-surface-700/50',
            'transition-all duration-200',
            'animate-slide-up opacity-0'
          )}
          style={{
            animationDelay: `${(index + 1) * 100}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <div className={clsx(
            'flex items-center justify-center w-10 h-10 rounded-lg',
            'bg-gradient-to-br from-accent/20 to-accent/5',
            'text-accent font-display font-bold'
          )}>
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-surface-100 font-medium truncate">
              {product.name}
            </h4>
            <p className="text-surface-500 text-sm">
              {product.category} • {product.sales} sold
            </p>
          </div>

          <div className="text-right">
            <p className="text-surface-100 font-semibold font-mono">
              {formatCurrency(product.revenue)}
            </p>
            <div className="flex items-center justify-end gap-1 text-success text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+{product.growth}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
