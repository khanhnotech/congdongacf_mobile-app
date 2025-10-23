import React from 'react';
import { View } from 'react-native';
import { responsiveWidth, responsiveValue } from '../../utils/responsive';

const ResponsiveGrid = ({ 
  children, 
  style, 
  columns = 2,
  gap = 16,
  padding = 16,
  ...props 
}) => {
  // Get responsive gap
  const getGap = () => {
    if (typeof gap === 'number') {
      return responsiveWidth(gap);
    }
    
    return responsiveWidth(gap);
  };
  
  // Get responsive padding
  const getPadding = () => {
    if (typeof padding === 'number') {
      return responsiveWidth(padding);
    }
    
    return responsiveWidth(padding);
  };
  
  // Calculate item width based on columns and gap
  const getItemWidth = () => {
    const screenWidth = responsiveWidth(390); // Base width
    const totalGap = getGap() * (columns - 1);
    const totalPadding = getPadding() * 2;
    const availableWidth = screenWidth - totalPadding - totalGap;
    return availableWidth / columns;
  };
  
  const gridStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: getPadding(),
    ...style,
  };
  
  const itemStyle = {
    width: getItemWidth(),
    marginBottom: getGap(),
  };
  
  // Clone children and add responsive styles
  const responsiveChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        style: [itemStyle, child.props.style],
      });
    }
    return child;
  });
  
  return (
    <View style={gridStyle} {...props}>
      {responsiveChildren}
    </View>
  );
};

export default ResponsiveGrid;
