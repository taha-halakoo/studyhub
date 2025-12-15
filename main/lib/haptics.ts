// Vibration Patterns
export const HAPTIC_PATTERNS = {
  success: [10, 30, 10], // Quick double tap
  warning: [50],         // Single medium tap
  error: [50, 50, 50],   // Three rapid taps
  light: [5],            // Very subtle click
  medium: [15],          // Noticeable click
  heavy: [30],           // Strong thud
};

export const triggerHaptic = (pattern: number[] = HAPTIC_PATTERNS.medium) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};