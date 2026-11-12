import { format } from "date-fns"

/**
 * Generate a random promotion code
 */
export function generateRandomCode(length = 8): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Removed similar looking characters
  let result = ""

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, "MMM d, yyyy")
}

/**
 * Get the status of a promotion
 */
export function getPromotionStatus(promotion: any): string {
  const now = new Date()
  const start = promotion.startDate ? new Date(promotion.startDate) : null
  const end = promotion.endDate ? new Date(promotion.endDate) : null

  if (!promotion.isActive) {
    return "disabled"
  }

  if (start && start > now) {
    return "scheduled"
  }

  if (end && end < now) {
    return "expired"
  }

  return "active"
}

/**
 * Check if a promotion is valid for use
 */
export function isPromotionValid(promotion: any): boolean {
  const now = new Date()
  const start = promotion.startDate ? new Date(promotion.startDate) : null
  const end = promotion.endDate ? new Date(promotion.endDate) : null

  // Check if promotion is active
  if (!promotion.isActive) {
    return false
  }

  // Check if promotion has started
  if (start && start > now) {
    return false
  }

  // Check if promotion has expired
  if (end && end < now) {
    return false
  }

  // Check if usage limit has been reached
  if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
    return false
  }

  return true
}

/**
 * Calculate discount amount based on promotion type and cart total
 */
export function calculateDiscount(promotion: any, cartTotal: number): number {
  if (!isPromotionValid(promotion)) {
    return 0
  }

  // Check minimum purchase requirement
  if (promotion.minPurchase && cartTotal < promotion.minPurchase) {
    return 0
  }

  // Calculate discount based on type
  switch (promotion.type) {
    case "percentage":
      return cartTotal * (promotion.value / 100)
    case "fixed":
      return Math.min(promotion.value, cartTotal) // Don't allow discount to exceed cart total
    case "shipping":
      return 0 // Shipping discount is handled separately
    default:
      return 0
  }
}
