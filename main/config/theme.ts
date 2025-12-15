// PATH: src/config/theme.ts

export const THEME = {
  colors: {
    // Core Backgrounds
    bgDark: '#1e1e2e',       // Main window background
    bgPanel: '#252535',      // Card/Sidebar background
    bgLight: '#313244',      // Inputs/Hover states
    
    // Accents
    accentBlue: '#89b4fa',   // Primary Action
    accentGreen: '#a6e3a1',  // Success/Growth
    accentRed: '#f38ba8',    // Danger/Errors
    accentYellow: '#f9e2af', // Warnings/Highlights
    
    // Typography
    textMain: '#cdd6f4',     // Primary text
    textMuted: '#a6adc8',    // Secondary text
    
    // Borders
    border: '#313244',
  },
  
  // Standardized spacing/sizing
  layout: {
    sidebarWidth: '18rem', // 288px
    headerHeight: '4rem',  // 64px
  }
} as const;