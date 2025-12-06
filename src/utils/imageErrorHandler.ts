/**
 * Image Error Handler Utility
 * Prevents infinite loops when fallback images also fail to load
 * Always uses '/JPEG_Dark_BG.jpg' as the default fallback image
 */

// Default fallback image - single source of truth
const DEFAULT_FALLBACK_IMAGE = '/JPEG_Dark_BG.jpg'

/**
 * Handle image load errors with fallback
 * Always falls back to '/JPEG_Dark_BG.jpg' as the default image
 * @param event - The error event from img onError
 * @param fallbackSrc - Optional custom fallback (will still use DEFAULT_FALLBACK_IMAGE if that fails)
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
) => {
  const target = event.target as HTMLImageElement
  const currentSrc = target.src
  const defaultFallbackUrl = new URL(DEFAULT_FALLBACK_IMAGE, window.location.origin).href
  
  // If a custom fallback is provided and we're not already on it, try that first
  if (fallbackSrc && fallbackSrc !== DEFAULT_FALLBACK_IMAGE) {
    const customFallbackUrl = new URL(fallbackSrc, window.location.origin).href
    if (currentSrc !== customFallbackUrl && !currentSrc.includes(fallbackSrc)) {
      target.src = fallbackSrc
      return
    }
  }
  
  // Always fall back to default image if not already on it
  if (currentSrc !== defaultFallbackUrl && !currentSrc.includes(DEFAULT_FALLBACK_IMAGE)) {
    target.src = DEFAULT_FALLBACK_IMAGE
  } else {
    // If default fallback also fails, set to a placeholder to prevent infinite loops
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E'
    target.onerror = null // Remove error handler to prevent further attempts
  }
}

