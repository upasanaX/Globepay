import { createStitches } from '@stitches/react';

export const {
  styled,
  globalCss,
  keyframes,
  css,
  theme,
  createTheme,
  getCssText,
  config,
} = createStitches({
  theme: {
    colors: {
      // Primary – emerald
      primary: '#10b981',
      primaryLight: '#34d399',
      primaryDark: '#059669',
      primaryAlpha: 'rgba(16, 185, 129, 0.12)',

      // Accent – deep blue
      accent: '#1e3a8a',
      accentLight: '#1e40af',
      accentDark: '#1e3a8a',

      // Success – green
      success: '#10b981',
      successLight: '#34d399',
      successDark: '#059669',
      successAlpha: 'rgba(16, 185, 129, 0.12)',

      // Error – red
      error: '#ef4444',
      errorLight: '#f87171',
      errorDark: '#dc2626',
      errorAlpha: 'rgba(239, 68, 68, 0.12)',

      // Warning – amber
      warning: '#f59e0b',
      warningLight: '#fbbf24',
      warningDark: '#d97706',

      // Neutral – gray
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827',

      // Semantic
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#9ca3af',
      background: '#f8fafc',
      surface: '#ffffff',
      border: '#e5e7eb',
      borderHover: '#d1d5db',

      // Overlay
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    fonts: {
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
    },

    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      md: '1.125rem',   // 18px
      lg: '1.25rem',    // 20px
      xl: '1.5rem',     // 24px
      '2xl': '1.875rem', // 30px
      '3xl': '2.25rem', // 36px
      '4xl': '3rem',    // 48px
    },

    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },

    // 4px scale
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
    },

    sizes: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      full: '100%',
      screenW: '100vw',
      screenH: '100vh',
    },

    radii: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      full: '9999px',
    },

    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      card: '0 2px 8px rgba(0, 0, 0, 0.08)',
      cardHover: '0 8px 32px rgba(0, 0, 0, 0.1)',
      button: '0 2px 8px rgba(16, 185, 129, 0.28)',
      glow: '0 0 20px rgba(16, 185, 129, 0.25)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    },

    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    zIndices: {
      base: '0',
      dropdown: '10',
      sticky: '20',
      modal: '30',
      overlay: '40',
      toast: '50',
    },
  },

  media: {
    bp1: '(min-width: 640px)',   // tablet
    bp2: '(min-width: 1024px)',  // desktop
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
  },

  utils: {
    // ── padding shorthands ──
    px: (value: string | number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    // ── margin shorthands ──
    mx: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: string | number) => ({
      marginTop: value,
      marginBottom: value,
    }),

    // ── sizing ──
    size: (value: string | number) => ({
      width: value,
      height: value,
    }),

    // ── display helpers ──
    flexCenter: (value: 'row' | 'column') => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: value,
    }),
    flexBetween: (value: 'row' | 'column') => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: value,
    }),
    gridCols: (value: number) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${value}, 1fr)`,
    }),

    // ── position shorthands ──
    posAbsolute: (value: string | number) => ({
      position: 'absolute' as const,
      top: value,
      right: value,
      bottom: value,
      left: value,
    }),
    posFixed: (value: string | number) => ({
      position: 'fixed' as const,
      top: value,
      right: value,
      bottom: value,
      left: value,
    }),

    // ── misc ──
    truncate: (value: boolean) =>
      value
        ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        : {},
  },
});

// Dark theme override
export const darkTheme = createTheme({
  colors: {
    primary: '#34d399',
    primaryLight: '#6ee7b7',
    primaryDark: '#10b981',
    primaryAlpha: 'rgba(52, 211, 153, 0.18)',

    accent: '#93c5fd',
    accentLight: '#bfdbfe',
    accentDark: '#60a5fa',

    success: '#34d399',
    successAlpha: 'rgba(52, 211, 153, 0.15)',

    error: '#f87171',
    errorAlpha: 'rgba(248, 113, 113, 0.15)',

    text: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    border: '#2d2d2d',
    borderHover: '#404040',

    overlay: 'rgba(0, 0, 0, 0.7)',
  },
});
