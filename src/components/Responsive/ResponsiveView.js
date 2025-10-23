import React from 'react';
import { View } from 'react-native';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveMargin, responsiveBorderRadius, responsiveValue } from '../../utils/responsive';

const ResponsiveView = ({ 
  children, 
  style, 
  padding,
  margin,
  width,
  height,
  borderRadius,
  backgroundColor,
  flex,
  direction = 'column',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = 'nowrap',
  ...props 
}) => {
  // Get responsive padding
  const getPadding = () => {
    if (!padding) return undefined;
    
    if (typeof padding === 'number') {
      return responsivePadding(padding);
    }
    
    if (typeof padding === 'object') {
      const { top, right, bottom, left, horizontal, vertical, all } = padding;
      
      if (all !== undefined) {
        return responsivePadding(all);
      }
      
      if (horizontal !== undefined && vertical !== undefined) {
        return {
          paddingHorizontal: responsivePadding(horizontal),
          paddingVertical: responsivePadding(vertical),
        };
      }
      
      return {
        paddingTop: top ? responsivePadding(top) : undefined,
        paddingRight: right ? responsivePadding(right) : undefined,
        paddingBottom: bottom ? responsivePadding(bottom) : undefined,
        paddingLeft: left ? responsivePadding(left) : undefined,
      };
    }
    
    return responsivePadding(padding);
  };
  
  // Get responsive margin
  const getMargin = () => {
    if (!margin) return undefined;
    
    if (typeof margin === 'number') {
      return responsiveMargin(margin);
    }
    
    if (typeof margin === 'object') {
      const { top, right, bottom, left, horizontal, vertical, all } = margin;
      
      if (all !== undefined) {
        return responsiveMargin(all);
      }
      
      if (horizontal !== undefined && vertical !== undefined) {
        return {
          marginHorizontal: responsiveMargin(horizontal),
          marginVertical: responsiveMargin(vertical),
        };
      }
      
      return {
        marginTop: top ? responsiveMargin(top) : undefined,
        marginRight: right ? responsiveMargin(right) : undefined,
        marginBottom: bottom ? responsiveMargin(bottom) : undefined,
        marginLeft: left ? responsiveMargin(left) : undefined,
      };
    }
    
    return responsiveMargin(margin);
  };
  
  // Get responsive width
  const getWidth = () => {
    if (!width) return undefined;
    
    if (typeof width === 'number') {
      return responsiveWidth(width);
    }
    
    if (typeof width === 'string' && width.includes('%')) {
      return width; // Keep percentage values as is
    }
    
    return responsiveWidth(width);
  };
  
  // Get responsive height
  const getHeight = () => {
    if (!height) return undefined;
    
    if (typeof height === 'number') {
      return responsiveHeight(height);
    }
    
    if (typeof height === 'string' && height.includes('%')) {
      return height; // Keep percentage values as is
    }
    
    return responsiveHeight(height);
  };
  
  // Get responsive border radius
  const getBorderRadius = () => {
    if (!borderRadius) return undefined;
    
    if (typeof borderRadius === 'number') {
      return responsiveBorderRadius(borderRadius);
    }
    
    return responsiveBorderRadius(borderRadius);
  };
  
  const responsiveStyle = {
    ...(padding && getPadding()),
    ...(margin && getMargin()),
    ...(width && { width: getWidth() }),
    ...(height && { height: getHeight() }),
    ...(borderRadius && { borderRadius: getBorderRadius() }),
    ...(backgroundColor && { backgroundColor }),
    ...(flex && { flex }),
    ...(direction && { flexDirection: direction }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...style,
  };
  
  return (
    <View style={responsiveStyle} {...props}>
      {children}
    </View>
  );
};

export default ResponsiveView;
