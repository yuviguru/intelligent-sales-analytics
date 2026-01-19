import { clsx } from 'clsx'
import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  delay?: number
  action?: ReactNode
  compact?: boolean
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className,
  delay = 0,
  action,
  compact = false
}: DashboardCardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl',
        compact ? 'p-4' : 'p-6',
        'bg-gradient-to-br from-surface-800/60 to-surface-900/60',
        compact ? 'border-0' : 'border-2 border-surface-700/40',
        'animate-slide-up opacity-0',
        'transition-all duration-300 ease-out',
        className
      )}
      style={{
        animationDelay: `${delay * 0.3}ms`,
        animationFillMode: 'forwards',
        willChange: 'padding, border-width'
      }}
    >
      <div className={clsx(
        'flex items-start justify-between',
        compact ? 'mb-3' : 'mb-5',
        'transition-all duration-300 ease-out'
      )}>
        <div>
          <h3 className={clsx(
            'font-display font-semibold text-surface-100',
            compact ? 'text-base' : 'text-lg',
            'transition-all duration-300 ease-out'
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className={clsx(
              'text-surface-500 mt-0.5',
              compact ? 'text-xs' : 'text-sm',
              'transition-all duration-300 ease-out'
            )}>{subtitle}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
      {children}
    </div>
  )
}
