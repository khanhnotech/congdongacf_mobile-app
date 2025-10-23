import { responsiveFontSize, responsiveWidth, responsiveHeight, responsivePadding, responsiveMargin, responsiveValue } from '../utils/responsive';

// Responsive Colors
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Responsive Typography
export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: responsiveFontSize(10),
    sm: responsiveFontSize(12),
    md: responsiveFontSize(14),
    lg: responsiveFontSize(16),
    xl: responsiveFontSize(18),
    '2xl': responsiveFontSize(20),
    '3xl': responsiveFontSize(24),
    '4xl': responsiveFontSize(28),
    '5xl': responsiveFontSize(32),
    '6xl': responsiveFontSize(36),
  },
  
  // Line heights
  lineHeight: {
    xs: responsiveFontSize(14),
    sm: responsiveFontSize(16),
    md: responsiveFontSize(20),
    lg: responsiveFontSize(24),
    xl: responsiveFontSize(28),
    '2xl': responsiveFontSize(32),
    '3xl': responsiveFontSize(36),
    '4xl': responsiveFontSize(40),
    '5xl': responsiveFontSize(44),
    '6xl': responsiveFontSize(48),
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Responsive Spacing
export const spacing = {
  xs: responsivePadding(2),
  sm: responsivePadding(4),
  md: responsivePadding(8),
  lg: responsivePadding(12),
  xl: responsivePadding(16),
  '2xl': responsivePadding(20),
  '3xl': responsivePadding(24),
  '4xl': responsivePadding(32),
  '5xl': responsivePadding(40),
  '6xl': responsivePadding(48),
};

// Responsive Border Radius
export const borderRadius = {
  none: 0,
  sm: responsiveWidth(4),
  md: responsiveWidth(8),
  lg: responsiveWidth(12),
  xl: responsiveWidth(16),
  '2xl': responsiveWidth(20),
  '3xl': responsiveWidth(24),
  full: 9999,
};

// Responsive Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Responsive Layout
export const layout = {
  // Container max widths
  containerMaxWidth: responsiveWidth(390),
  
  // Breakpoints
  breakpoints: {
    xs: 321,
    sm: 360,
    md: 400,
    lg: 450,
    xl: 500,
  },
  
  // Common widths
  widths: {
    full: '100%',
    half: '50%',
    third: '33.333%',
    quarter: '25%',
    auto: 'auto',
  },
  
  // Common heights
  heights: {
    full: '100%',
    half: '50%',
    third: '33.333%',
    quarter: '25%',
    auto: 'auto',
  },
};

// Responsive Components Styles
export const components = {
  // Button styles
  button: {
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
    },
    secondary: {
      backgroundColor: colors.light,
      color: colors.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
      borderWidth: 1,
      borderColor: colors.primary,
    },
  },
  
  // Card styles
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  
  // Text styles
  text: {
    heading: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.dark,
    },
    subheading: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.dark,
    },
    body: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.normal,
      color: colors.dark,
    },
    caption: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      color: colors.gray[600],
    },
  },
};

// Responsive Theme
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  components,
};

export default theme;
