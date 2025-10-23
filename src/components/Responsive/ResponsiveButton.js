import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { responsiveWidth, responsiveHeight, responsivePadding, responsiveFontSize, responsiveBorderRadius } from '../../utils/responsive';

const ResponsiveButton = ({ 
  children, 
  style, 
  textStyle,
  onPress,
  disabled = false,
  size = 'md',
  variant = 'primary',
  width,
  height,
  padding,
  borderRadius,
  ...props 
}) => {
  // Get responsive button size
  const getButtonSize = () => {
    const sizeMap = {
      xs: { padding: 8, fontSize: 12, minHeight: 32 },
      sm: { padding: 12, fontSize: 14, minHeight: 36 },
      md: { padding: 16, fontSize: 16, minHeight: 44 },
      lg: { padding: 20, fontSize: 18, minHeight: 52 },
      xl: { padding: 24, fontSize: 20, minHeight: 60 },
    };
    
    return sizeMap[size] || sizeMap.md;
  };
  
  // Get responsive variant styles
  const getVariantStyles = () => {
    const variantMap = {
      primary: {
        backgroundColor: '#007AFF',
        textColor: '#FFFFFF',
      },
      secondary: {
        backgroundColor: '#F2F2F7',
        textColor: '#007AFF',
      },
      outline: {
        backgroundColor: 'transparent',
        textColor: '#007AFF',
        borderWidth: 1,
        borderColor: '#007AFF',
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: '#007AFF',
      },
      danger: {
        backgroundColor: '#FF3B30',
        textColor: '#FFFFFF',
      },
      success: {
        backgroundColor: '#34C759',
        textColor: '#FFFFFF',
      },
    };
    
    return variantMap[variant] || variantMap.primary;
  };
  
  const buttonSize = getButtonSize();
  const variantStyles = getVariantStyles();
  
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
  
  // Get responsive padding
  const getPadding = () => {
    if (!padding) return responsivePadding(buttonSize.padding);
    
    if (typeof padding === 'number') {
      return responsivePadding(padding);
    }
    
    return responsivePadding(buttonSize.padding);
  };
  
  // Get responsive border radius
  const getBorderRadius = () => {
    if (!borderRadius) return responsiveBorderRadius(8);
    
    if (typeof borderRadius === 'number') {
      return responsiveBorderRadius(borderRadius);
    }
    
    return responsiveBorderRadius(8);
  };
  
  const buttonStyle = {
    ...(width && { width: getWidth() }),
    ...(height && { height: getHeight() }),
    ...(!height && { minHeight: responsiveHeight(buttonSize.minHeight) }),
    padding: getPadding(),
    borderRadius: getBorderRadius(),
    backgroundColor: variantStyles.backgroundColor,
    ...(variantStyles.borderWidth && { borderWidth: variantStyles.borderWidth }),
    ...(variantStyles.borderColor && { borderColor: variantStyles.borderColor }),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };
  
  const textStyleCombined = {
    fontSize: responsiveFontSize(buttonSize.fontSize),
    color: variantStyles.textColor,
    fontWeight: '600',
    textAlign: 'center',
    ...textStyle,
  };
  
  return (
    <TouchableOpacity 
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={textStyleCombined}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default ResponsiveButton;
