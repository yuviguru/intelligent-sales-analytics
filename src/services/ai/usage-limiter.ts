// Usage limiter - tracks and limits AI prompts in production

const STORAGE_KEY = 'ai_dashboard_usage'
const DEFAULT_LIMIT = 5

interface UsageData {
  count: number
  firstUsedAt: number
}

export class UsageLimiter {
  private limit: number
  private isProduction: boolean

  constructor(limit = DEFAULT_LIMIT) {
    this.limit = limit
    this.isProduction = import.meta.env.PROD
  }

  private getUsageData(): UsageData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // localStorage not available or corrupted
    }
    return { count: 0, firstUsedAt: Date.now() }
  }

  private saveUsageData(data: UsageData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // localStorage not available
    }
  }

  /**
   * Check if user can make another AI request
   */
  canUse(): boolean {
    // No limits in development
    if (!this.isProduction) {
      return true
    }

    const usage = this.getUsageData()
    return usage.count < this.limit
  }

  /**
   * Get remaining uses
   */
  getRemainingUses(): number {
    if (!this.isProduction) {
      return Infinity
    }

    const usage = this.getUsageData()
    return Math.max(0, this.limit - usage.count)
  }

  /**
   * Get total limit
   */
  getLimit(): number {
    return this.limit
  }

  /**
   * Get current usage count
   */
  getUsageCount(): number {
    if (!this.isProduction) {
      return 0
    }
    return this.getUsageData().count
  }

  /**
   * Increment usage counter
   */
  incrementUsage(): void {
    if (!this.isProduction) {
      return
    }

    const usage = this.getUsageData()
    usage.count += 1
    this.saveUsageData(usage)
  }

  /**
   * Check if limit is reached
   */
  isLimitReached(): boolean {
    if (!this.isProduction) {
      return false
    }

    return this.getUsageData().count >= this.limit
  }

  /**
   * Get the blocked message to show users
   */
  getBlockedMessage(): string {
    return `🚫 Demo Limit Reached

This is a portfolio demo project with limited AI capabilities.

You've used all ${this.limit} free AI prompts available.

Thank you for exploring this dashboard! If you'd like to see more of my work or discuss a project, feel free to reach out.

— Yuvaraj`
  }

  /**
   * Reset usage (for testing)
   */
  reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage not available
    }
  }
}

// Singleton instance
export const usageLimiter = new UsageLimiter(DEFAULT_LIMIT)
