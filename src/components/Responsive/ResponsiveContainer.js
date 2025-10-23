import React from 'react';
import { View, ScrollView } from 'react-native';
import { responsiveWidth, responsivePadding, responsiveMargin, responsiveValue } from '../../utils/responsive';

const ResponsiveContainer = ({ 
  children, 
  style, 
  scrollable = false,
  padding,
  margin,
  backgroundColor,
  flex = 1,
  direction = 'column',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = 'nowrap',
  ...props 
}) => {
  // Get responsive padding
  const getPadding = () => {
    if (!padding) return responsivePadding(16);
    
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
  
  const containerStyle = {
    flex,
    padding: getPadding(),
    ...(margin && getMargin()),
    ...(backgroundColor && { backgroundColor }),
    ...(direction && { flexDirection: direction }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...style,
  };
  
  if (scrollable) {
    return (
      <ScrollView 
        style={containerStyle}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
  
  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

export default ResponsiveContainer;
