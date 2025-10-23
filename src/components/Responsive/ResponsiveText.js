import React from 'react';
import { Text } from 'react-native';
import { responsiveFontSize, responsiveValue, getScreenSizeCategory } from '../../utils/responsive';

const ResponsiveText = ({ 
  children, 
  style, 
  size = 'md',
  weight = 'normal',
  color = '#000',
  align = 'left',
  ...props 
}) => {
  const screenSize = getScreenSizeCategory();
  
  // Get responsive font size
  const getFontSize = () => {
    if (typeof size === 'number') {
      return responsiveFontSize(size);
    }
    
    const sizeMap = {
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
    
    return responsiveFontSize(sizeMap[size] || sizeMap.md);
  };
  
  // Get responsive font weight
  const getFontWeight = () => {
    const weightMap = {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    };
    
    return weightMap[weight] || weightMap.normal;
  };
  
  // Get responsive line height
  const getLineHeight = () => {
    const fontSize = getFontSize();
    return fontSize * 1.4; // 1.4 line height ratio
  };
  
  const responsiveStyle = {
    fontSize: getFontSize(),
    fontWeight: getFontWeight(),
    color,
    textAlign: align,
    lineHeight: getLineHeight(),
    ...style,
  };
  
  return (
    <Text style={responsiveStyle} {...props}>
      {children}
    </Text>
  );
};

export default ResponsiveText;
