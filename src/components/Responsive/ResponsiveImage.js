import React from 'react';
import { Image } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveValue } from '../../utils/responsive';

const ResponsiveImage = ({ 
  source, 
  style, 
  width,
  height,
  aspectRatio,
  resizeMode = 'cover',
  ...props 
}) => {
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
  
  // Get responsive aspect ratio
  const getAspectRatio = () => {
    if (!aspectRatio) return undefined;
    
    if (typeof aspectRatio === 'number') {
      return aspectRatio;
    }
    
    // Handle string aspect ratios like "16:9"
    if (typeof aspectRatio === 'string' && aspectRatio.includes(':')) {
      const [w, h] = aspectRatio.split(':').map(Number);
      return w / h;
    }
    
    return aspectRatio;
  };
  
  const responsiveStyle = {
    ...(width && { width: getWidth() }),
    ...(height && { height: getHeight() }),
    ...(aspectRatio && { aspectRatio: getAspectRatio() }),
    resizeMode,
    ...style,
  };
  
  return (
    <Image 
      source={source} 
      style={responsiveStyle} 
      {...props} 
    />
  );
};

export default ResponsiveImage;
