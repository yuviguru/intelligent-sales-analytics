import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { realtimeService } from '../services/realtimeService'

interface ActivityIndicatorProps {
  active?: boolean
}

export function ActivityIndicator({ active = true }: ActivityIndicatorProps) {
  const [eventStatus, setEventStatus] = useState({
    count: 0,
    capped: false,
    remaining: 100
  })

  useEffect(() => {
    const updateStatus = () => {
      setEventStatus({
        count: realtimeService.getEventCount(),
        capped: realtimeService.hasReachedCap(),
        remaining: realtimeService.getRemainingEvents()
      })
    }

    // Update every 2 seconds
    const interval = setInterval(updateStatus, 2000)
    updateStatus() // Initial update

    return () => clearInterval(interval)
  }, [])

  const isActive = active && !eventStatus.capped

  const tooltipText = eventStatus.capped
    ? `Event cap reached (${eventStatus.count} events)`
    : active
      ? `Real-time updates active (${eventStatus.count}/100 events, ${eventStatus.remaining} remaining)`
      : "Real-time updates paused"

  return (
    <div className="relative flex items-center" title={tooltipText}>
      <motion.div
        animate={isActive ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        } : {
          scale: 1,
          opacity: eventStatus.capped ? 0.5 : 1
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
        className={clsx(
          "w-2 h-2 rounded-full",
          eventStatus.capped ? "bg-gray-400" : isActive ? 'bg-success' : 'bg-surface-600'
        )}
      />
      {isActive && (
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-2 rounded-full bg-success"
        />
      )}
    </div>
  )
}
