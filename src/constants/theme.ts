export const Colors = {
  // Brand
  primary: '#FF5F8D',
  primaryDark: '#E04070',
  primaryLight: '#FF8FB3',
  secondary: '#7B61FF',
  accent: '#FFD166',

  // Backgrounds
  background: '#0D0D1A',
  surface: '#161628',
  surfaceElevated: '#1E1E35',
  surfaceBorder: '#2A2A45',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#5A5A80',
  textInverse: '#0D0D1A',

  // Semantic
  success: '#06D6A0',
  warning: '#FFD166',
  error: '#EF476F',
  info: '#118AB2',

  // Alarm states
  alarmActive: '#FF5F8D',
  alarmInactive: '#2A2A45',
  alarmPulse: 'rgba(255,95,141,0.3)',

  // Proximity
  near: '#06D6A0',    // < 5m
  medium: '#FFD166',  // 5–8m
  far: '#FF5F8D',     // 8–10m

  // Overlay
  overlay: 'rgba(13,13,26,0.85)',
  overlayLight: 'rgba(13,13,26,0.5)',

  // Transparent
  transparent: 'transparent',
};

export const Gradients = {
  primary: ['#FF5F8D', '#E04070'] as const,
  primaryFull: ['#FF8FB3', '#FF5F8D', '#E04070'] as const,
  secondary: ['#7B61FF', '#5B41DF'] as const,
  dark: ['#1E1E35', '#0D0D1A'] as const,
  alarm: ['rgba(255,95,141,0.2)', 'rgba(255,95,141,0)'] as const,
  surface: ['#1E1E35', '#161628'] as const,
  success: ['#06D6A0', '#04A880'] as const,
  gold: ['#FFD166', '#FFA500'] as const,
};

export const Typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,
    display: 56,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#FF5F8D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#FF5F8D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  lg: {
    shadowColor: '#FF5F8D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
  },
  glow: {
    shadowColor: '#FF5F8D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
};

export const Animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
};

export const ZIndex = {
  base: 0,
  card: 10,
  overlay: 50,
  modal: 100,
  toast: 200,
};
