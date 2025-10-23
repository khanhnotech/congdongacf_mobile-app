import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12/13/14 - 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Minimum width constraint
const MIN_WIDTH = 321;

// Calculate responsive dimensions
const getResponsiveWidth = (width) => {
  const responsiveWidth = Math.max(MIN_WIDTH, SCREEN_WIDTH);
  return (width / BASE_WIDTH) * responsiveWidth;
};

const getResponsiveHeight = (height) => {
  const responsiveHeight = (height / BASE_HEIGHT) * SCREEN_HEIGHT;
  return responsiveHeight;
};

const getResponsiveFontSize = (fontSize) => {
  const responsiveWidth = Math.max(MIN_WIDTH, SCREEN_WIDTH);
  const scale = responsiveWidth / BASE_WIDTH;
  const newSize = fontSize * scale;
  
  // Ensure minimum font size for readability
  const minFontSize = Math.max(10, fontSize * 0.8);
  return Math.max(minFontSize, newSize);
};

const getResponsivePadding = (padding) => {
  const responsiveWidth = Math.max(MIN_WIDTH, SCREEN_WIDTH);
  const scale = responsiveWidth / BASE_WIDTH;
  return padding * scale;
};

const getResponsiveMargin = (margin) => {
  const responsiveWidth = Math.max(MIN_WIDTH, SCREEN_WIDTH);
  const scale = responsiveWidth / BASE_WIDTH;
  return margin * scale;
};

const getResponsiveBorderRadius = (radius) => {
  const responsiveWidth = Math.max(MIN_WIDTH, SCREEN_WIDTH);
  const scale = responsiveWidth / BASE_WIDTH;
  return radius * scale;
};

// Screen size categories
const getScreenSize = () => {
  const responsiveWidth = Math.max(MIN_WIDTH, SCREEN_WIDTH);
  
  if (responsiveWidth < 360) return 'xs';      // Extra small (321-359)
  if (responsiveWidth < 400) return 'sm';      // Small (360-399)
  if (responsiveWidth < 450) return 'md';      // Medium (400-449)
  if (responsiveWidth < 500) return 'lg';      // Large (450-499)
  return 'xl';                                 // Extra large (500+)
};

// Responsive breakpoints
const BREAKPOINTS = {
  xs: 321,
  sm: 360,
  md: 400,
  lg: 450,
  xl: 500,
};

// Get responsive value based on screen size
const getResponsiveValue = (values) => {
  const screenSize = getScreenSize();
  return values[screenSize] || values.md || values.sm || values.xs;
};

// Responsive spacing scale
const SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

// Responsive font sizes
const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
};

// Responsive icon sizes
const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
};

// Helper functions
export const responsiveWidth = getResponsiveWidth;
export const responsiveHeight = getResponsiveHeight;
export const responsiveFontSize = getResponsiveFontSize;
export const responsivePadding = getResponsivePadding;
export const responsiveMargin = getResponsiveMargin;
export const responsiveBorderRadius = getResponsiveBorderRadius;
export const responsiveValue = getResponsiveValue;
export const getScreenSizeCategory = getScreenSize;

// Predefined responsive values
export const rw = getResponsiveWidth;
export const rh = getResponsiveHeight;
export const rf = getResponsiveFontSize;
export const rp = getResponsivePadding;
export const rm = getResponsiveMargin;
export const rr = getResponsiveBorderRadius;
export const rv = getResponsiveValue;

// Export constants
export { SPACING, FONT_SIZES, ICON_SIZES, BREAKPOINTS, MIN_WIDTH };

// Screen dimensions
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  responsiveWidth: Math.max(MIN_WIDTH, SCREEN_WIDTH),
  responsiveHeight: SCREEN_HEIGHT,
};

// Responsive styles helper
export const createResponsiveStyle = (baseStyle) => {
  const screenSize = getScreenSize();
  
  return {
    ...baseStyle,
    // Override with responsive values if they exist
    ...(baseStyle.responsive && baseStyle.responsive[screenSize]),
  };
};

// Responsive component wrapper
export const withResponsive = (Component) => {
  return (props) => {
    const responsiveProps = {
      ...props,
      screenSize: getScreenSize(),
      screenWidth: Math.max(MIN_WIDTH, SCREEN_WIDTH),
      screenHeight: SCREEN_HEIGHT,
    };
    
    return Component(responsiveProps);
  };
};

export default {
  responsiveWidth: getResponsiveWidth,
  responsiveHeight: getResponsiveHeight,
  responsiveFontSize: getResponsiveFontSize,
  responsivePadding: getResponsivePadding,
  responsiveMargin: getResponsiveMargin,
  responsiveBorderRadius: getResponsiveBorderRadius,
  responsiveValue: getResponsiveValue,
  getScreenSizeCategory: getScreenSize,
  rw: getResponsiveWidth,
  rh: getResponsiveHeight,
  rf: getResponsiveFontSize,
  rp: getResponsivePadding,
  rm: getResponsiveMargin,
  rr: getResponsiveBorderRadius,
  rv: getResponsiveValue,
  SPACING,
  FONT_SIZES,
  ICON_SIZES,
  BREAKPOINTS,
  MIN_WIDTH,
  SCREEN_DIMENSIONS,
  createResponsiveStyle,
  withResponsive,
};
