import React from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import { responsiveWidth, responsiveValue } from '../utils/responsive';

const ResponsiveScreen = ({ 
  children, 
  style, 
  backgroundColor = '#FFFFFF',
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor,
  safeArea = true,
  padding = 0,
  ...props 
}) => {
  // Get responsive padding
  const getPadding = () => {
    if (!padding) return 0;
    
    if (typeof padding === 'number') {
      return responsiveWidth(padding);
    }
    
    if (typeof padding === 'object') {
      const { top, right, bottom, left, horizontal, vertical, all } = padding;
      
      if (all !== undefined) {
        return responsiveWidth(all);
      }
      
      if (horizontal !== undefined && vertical !== undefined) {
        return {
          paddingHorizontal: responsiveWidth(horizontal),
          paddingVertical: responsiveWidth(vertical),
        };
      }
      
      return {
        paddingTop: top ? responsiveWidth(top) : undefined,
        paddingRight: right ? responsiveWidth(right) : undefined,
        paddingBottom: bottom ? responsiveWidth(bottom) : undefined,
        paddingLeft: left ? responsiveWidth(left) : undefined,
      };
    }
    
    return responsiveWidth(padding);
  };
  
  const screenStyle = {
    flex: 1,
    backgroundColor,
    ...(padding && getPadding()),
    ...style,
  };
  
  const content = (
    <View style={screenStyle} {...props}>
      {children}
    </View>
  );
  
  return (
    <>
      <StatusBar 
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor || backgroundColor}
        translucent={false}
      />
      {safeArea ? (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          {content}
        </SafeAreaView>
      ) : (
        content
      )}
    </>
  );
};

export default ResponsiveScreen;
