export const COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  secondary: '#4CAF50',
  secondaryDark: '#388E3C',
  secondaryLight: '#C8E6C9',
  accent: '#FF9800',
  accentDark: '#F57C00',
  accentLight: '#FFE0B2',
  
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  
  // Text
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  textInverse: '#FFFFFF',
  
  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Gradients
  gradient: {
    primary: ['#2196F3', '#1976D2'],
    secondary: ['#4CAF50', '#388E3C'],
    accent: ['#FF9800', '#F57C00'],
    warm: ['#FF6B6B', '#FF8E53'],
    cool: ['#4ECDC4', '#44A08D'],
  },
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const LAYOUT = {
  window: {
    width: '100%',
    height: '100%',
  },
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
};