import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { SalesMetric, formatCurrency, formatNumber, formatPercent, calculateChange } from '../data/sales-data'
import { cardVariants } from '../utils/animations'

interface MetricCardProps {
  metric: SalesMetric
  compact?: boolean
}

export function MetricCard({ metric, compact = false }: MetricCardProps) {
  const [prevValue, setPrevValue] = useState(metric.value)
  const [isPulsing, setIsPulsing] = useState(false)

  const change = calculateChange(metric.value, metric.previousValue)
  const isPositive = change > 0
  const isNegative = change < 0

  // Detect value changes and trigger pulse animation
  useEffect(() => {
    if (metric.value !== prevValue) {
      setIsPulsing(true)
      setPrevValue(metric.value)

      // Reset pulse after animation
      const timeout = setTimeout(() => setIsPulsing(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [metric.value, prevValue])

  const formatValue = (value: number) => {
    switch (metric.format) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return formatPercent(value)
      default:
        return formatNumber(value)
    }
  }

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{
        padding: compact ? '1rem' : '1.5rem',
        borderWidth: compact ? '0px' : '2px'
      }}
      animate={{
        padding: compact ? '1rem' : '1.5rem',
        borderWidth: compact ? '0px' : '2px'
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={clsx(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-surface-800/80 to-surface-900/80',
        'border-surface-700/50',
        !compact && 'glow-border'
      )}
      style={{ borderStyle: 'solid' }}
    >
      {/* Accent gradient overlay */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent transition-opacity duration-300',
        compact ? 'opacity-100' : 'opacity-0 hover:opacity-100'
      )} />

      <motion.div
        className="relative"
        initial={{
          fontSize: compact ? '0.75rem' : '0.875rem'
        }}
        animate={{
          fontSize: compact ? '0.75rem' : '0.875rem'
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.p
          initial={{
            fontSize: compact ? '0.75rem' : '0.875rem'
          }}
          animate={{
            fontSize: compact ? '0.75rem' : '0.875rem'
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={clsx(
            'font-medium tracking-wide uppercase',
            compact ? 'text-accent/80' : 'text-surface-400'
          )}>
          {metric.label}
        </motion.p>

        <motion.div
          className="flex items-baseline gap-3"
          initial={{
            marginTop: compact ? '0.5rem' : '0.75rem'
          }}
          animate={{
            marginTop: compact ? '0.5rem' : '0.75rem'
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.span
            key={metric.value}
            initial={{
              fontSize: compact ? '1.5rem' : '1.875rem'
            }}
            animate={{
              fontSize: compact ? '1.5rem' : '1.875rem',
              scale: isPulsing ? [1, 1.15, 1] : 1,
              color: isPulsing ? ['currentColor', '#06b6d4', 'currentColor'] : 'currentColor'
            }}
            transition={{
              fontSize: { duration: 0.2, ease: "easeOut" },
              scale: { duration: 0.6 },
              color: { duration: 0.6 }
            }}
            className={clsx(
              'font-display font-bold',
              compact ? 'text-accent' : 'text-surface-50'
            )}>
            {formatValue(metric.value)}
          </motion.span>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{
            marginTop: compact ? '0.5rem' : '1rem'
          }}
          animate={{
            marginTop: compact ? '0.5rem' : '1rem'
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className={clsx(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            isPositive && 'bg-success/10 text-success',
            isNegative && 'bg-danger/10 text-danger',
            !isPositive && !isNegative && 'bg-surface-700 text-surface-400'
          )}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
          <span className="text-surface-500 text-xs">vs last period</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
