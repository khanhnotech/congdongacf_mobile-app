import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize, 
  responsivePadding, 
  responsiveMargin,
  responsiveBorderRadius,
  responsiveValue,
  getScreenSizeCategory,
  SCREEN_DIMENSIONS,
  BREAKPOINTS,
  MIN_WIDTH
} from '../utils/responsive';

const useResponsive = () => {
  const [screenData, setScreenData] = useState({
    width: SCREEN_DIMENSIONS.width,
    height: SCREEN_DIMENSIONS.height,
    responsiveWidth: SCREEN_DIMENSIONS.responsiveWidth,
    responsiveHeight: SCREEN_DIMENSIONS.responsiveHeight,
    screenSize: getScreenSizeCategory(),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newWidth = Math.max(MIN_WIDTH, window.width);
      const newHeight = window.height;
      
      setScreenData({
        width: window.width,
        height: window.height,
        responsiveWidth: newWidth,
        responsiveHeight: newHeight,
        screenSize: getScreenSizeCategory(),
      });
    });

    return () => subscription?.remove();
  }, []);

  // Responsive dimension helpers
  const rw = (width) => responsiveWidth(width);
  const rh = (height) => responsiveHeight(height);
  const rf = (fontSize) => responsiveFontSize(fontSize);
  const rp = (padding) => responsivePadding(padding);
  const rm = (margin) => responsiveMargin(margin);
  const rr = (radius) => responsiveBorderRadius(radius);
  const rv = (values) => responsiveValue(values);

  // Screen size checks
  const isExtraSmall = screenData.screenSize === 'xs';
  const isSmall = screenData.screenSize === 'sm';
  const isMedium = screenData.screenSize === 'md';
  const isLarge = screenData.screenSize === 'lg';
  const isExtraLarge = screenData.screenSize === 'xl';

  // Breakpoint checks
  const isBelowBreakpoint = (breakpoint) => {
    const breakpointValue = BREAKPOINTS[breakpoint];
    return screenData.responsiveWidth < breakpointValue;
  };

  const isAboveBreakpoint = (breakpoint) => {
    const breakpointValue = BREAKPOINTS[breakpoint];
    return screenData.responsiveWidth >= breakpointValue;
  };

  // Responsive spacing
  const getSpacing = (size) => {
    const spacingMap = {
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
    
    return responsivePadding(spacingMap[size] || spacingMap.md);
  };

  // Responsive font sizes
  const getFontSize = (size) => {
    const fontSizeMap = {
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
    
    return responsiveFontSize(fontSizeMap[size] || fontSizeMap.md);
  };

  // Responsive icon sizes
  const getIconSize = (size) => {
    const iconSizeMap = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 28,
      '2xl': 32,
      '3xl': 36,
      '4xl': 40,
    };
    
    return responsiveWidth(iconSizeMap[size] || iconSizeMap.md);
  };

  return {
    // Screen data
    ...screenData,
    
    // Responsive helpers
    rw,
    rh,
    rf,
    rp,
    rm,
    rr,
    rv,
    
    // Screen size checks
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    
    // Breakpoint checks
    isBelowBreakpoint,
    isAboveBreakpoint,
    
    // Utility functions
    getSpacing,
    getFontSize,
    getIconSize,
    
    // Constants
    BREAKPOINTS,
    MIN_WIDTH,
  };
};

export default useResponsive;
