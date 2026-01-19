import { Variants } from 'framer-motion'

// Standard easing curves
export const EASING = {
  easeOut: [0.25, 0.46, 0.45, 0.94],
  easeIn: [0.55, 0.055, 0.675, 0.19],
  easeInOut: [0.645, 0.045, 0.355, 1],
  spring: { type: "spring" as const, damping: 25, stiffness: 300 }
} as const

// Standard durations (matching current CSS)
export const DURATION = {
  fast: 0.15,
  normal: 0.2,
  medium: 0.3,
  slow: 0.5
} as const

// Create stagger container variants
export const createStaggerContainer = (
  staggerDelay = 0.08,
  delayChildren = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
      when: "beforeChildren"
    }
  }
})

// Card entry animation variants
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.easeOut
    }
  }
}

// List item animation variants
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EASING.easeOut
    }
  }
}

// Modal animation variants
export const modalVariants = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  container: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: EASING.spring
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  }
}

// Interaction effects for hover/tap
export const interactionEffects = {
  hover: { y: -4, transition: { duration: DURATION.normal } },
  tap: { scale: 0.95 },
  hoverScale: { scale: 1.05, transition: { duration: DURATION.fast } }
}
