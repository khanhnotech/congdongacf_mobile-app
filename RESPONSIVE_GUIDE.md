# 📱 Responsive Design Guide

Hệ thống responsive design cho React Native với kích thước màn hình nhỏ nhất là 321px.

## 🚀 Quick Start

```javascript
import { ResponsiveText, ResponsiveView, useResponsive } from './src/components/Responsive';

// Sử dụng components
<ResponsiveText size="lg" weight="bold">
  Hello World
</ResponsiveText>

<ResponsiveView padding={16} backgroundColor="#FFFFFF">
  <ResponsiveText>Content</ResponsiveText>
</ResponsiveView>

// Sử dụng hooks
const { rw, rh, rf, isSmall } = useResponsive();
```

## 📏 Breakpoints

| Size | Width Range | Description |
|------|-------------|-------------|
| xs   | 321-359px   | Extra Small |
| sm   | 360-399px   | Small       |
| md   | 400-449px   | Medium      |
| lg   | 450-499px   | Large       |
| xl   | 500px+      | Extra Large |

## 🎨 Components

### ResponsiveText

```javascript
<ResponsiveText
  size="lg"           // xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
  weight="bold"       // light, normal, medium, semibold, bold, extrabold
  color="#333"        // Any color
  align="center"      // left, center, right
  style={{}}          // Additional styles
>
  Text Content
</ResponsiveText>
```

### ResponsiveView

```javascript
<ResponsiveView
  padding={16}                    // Number or object
  padding={{ top: 16, bottom: 8 }} // Object with specific sides
  margin={12}                     // Number or object
  width={200}                     // Number or percentage string
  height={100}                    // Number or percentage string
  backgroundColor="#FFFFFF"       // Any color
  borderRadius={8}                // Number
  flex={1}                        // Flex properties
  direction="row"                 // column, row
  align="center"                  // flex-start, center, flex-end
  justify="space-between"         // flex-start, center, flex-end, space-between
  wrap="wrap"                     // nowrap, wrap
  style={{}}                      // Additional styles
>
  Content
</ResponsiveView>
```

### ResponsiveButton

```javascript
<ResponsiveButton
  variant="primary"     // primary, secondary, outline, ghost, danger, success
  size="md"            // xs, sm, md, lg, xl
  width={200}          // Number or percentage string
  height={44}          // Number or percentage string
  padding={16}         // Number
  borderRadius={8}     // Number
  onPress={() => {}}   // Press handler
  disabled={false}     // Boolean
  style={{}}           // Additional styles
  textStyle={{}}       // Text styles
>
  Button Text
</ResponsiveButton>
```

### ResponsiveImage

```javascript
<ResponsiveImage
  source={{ uri: 'https://example.com/image.jpg' }}
  width={200}          // Number or percentage string
  height={150}         // Number or percentage string
  aspectRatio={16/9}   // Number or string like "16:9"
  resizeMode="cover"   // cover, contain, stretch, repeat, center
  style={{}}           // Additional styles
/>
```

### ResponsiveContainer

```javascript
<ResponsiveContainer
  scrollable={true}    // Boolean - makes it a ScrollView
  padding={16}         // Number or object
  margin={8}           // Number or object
  backgroundColor="#F5F5F5" // Any color
  flex={1}             // Flex properties
  direction="column"   // column, row
  align="flex-start"   // flex-start, center, flex-end
  justify="flex-start" // flex-start, center, flex-end, space-between
  wrap="nowrap"        // nowrap, wrap
  style={{}}           // Additional styles
>
  Content
</ResponsiveContainer>
```

### ResponsiveGrid

```javascript
<ResponsiveGrid
  columns={2}          // Number of columns
  gap={16}             // Gap between items
  padding={16}         // Container padding
  style={{}}           // Additional styles
>
  <ResponsiveView>Item 1</ResponsiveView>
  <ResponsiveView>Item 2</ResponsiveView>
  <ResponsiveView>Item 3</ResponsiveView>
  <ResponsiveView>Item 4</ResponsiveView>
</ResponsiveGrid>
```

### ResponsiveScreen

```javascript
<ResponsiveScreen
  backgroundColor="#FFFFFF"        // Screen background color
  statusBarStyle="dark-content"    // light-content, dark-content
  statusBarBackgroundColor="#FFFFFF" // Status bar background
  safeArea={true}                  // Boolean - use SafeAreaView
  padding={0}                      // Screen padding
  style={{}}                       // Additional styles
>
  Screen Content
</ResponsiveScreen>
```

## 🎣 Hooks

### useResponsive

```javascript
import { useResponsive } from './src/hooks/useResponsive';

const MyComponent = () => {
  const {
    // Screen data
    width,              // Current screen width
    height,             // Current screen height
    responsiveWidth,    // Responsive width (min 321px)
    responsiveHeight,   // Responsive height
    screenSize,         // Current screen size category
    
    // Responsive helpers
    rw,                 // responsiveWidth function
    rh,                 // responsiveHeight function
    rf,                 // responsiveFontSize function
    rp,                 // responsivePadding function
    rm,                 // responsiveMargin function
    rr,                 // responsiveBorderRadius function
    rv,                 // responsiveValue function
    
    // Screen size checks
    isExtraSmall,       // Boolean
    isSmall,            // Boolean
    isMedium,           // Boolean
    isLarge,            // Boolean
    isExtraLarge,       // Boolean
    
    // Breakpoint checks
    isBelowBreakpoint,  // Function
    isAboveBreakpoint,  // Function
    
    // Utility functions
    getSpacing,         // Function
    getFontSize,        // Function
    getIconSize,        // Function
  } = useResponsive();
  
  return (
    <ResponsiveView
      width={rw(200)}           // Responsive width
      height={rh(100)}          // Responsive height
      padding={rp(16)}          // Responsive padding
      style={{
        fontSize: rf(16),       // Responsive font size
        borderRadius: rr(8),    // Responsive border radius
      }}
    >
      <ResponsiveText size={isSmall ? 'sm' : 'md'}>
        Responsive Text
      </ResponsiveText>
    </ResponsiveView>
  );
};
```

## 🛠️ Utils

### Responsive Functions

```javascript
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize,
  responsivePadding,
  responsiveMargin,
  responsiveBorderRadius,
  responsiveValue,
  getScreenSizeCategory,
  SPACING,
  FONT_SIZES,
  ICON_SIZES,
  BREAKPOINTS,
  MIN_WIDTH
} from './src/utils/responsive';

// Direct usage
const width = responsiveWidth(200);        // Responsive width
const height = responsiveHeight(100);      // Responsive height
const fontSize = responsiveFontSize(16);   // Responsive font size
const padding = responsivePadding(16);     // Responsive padding
const margin = responsiveMargin(16);       // Responsive margin
const radius = responsiveBorderRadius(8);  // Responsive border radius

// Responsive values based on screen size
const value = responsiveValue({
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
});

// Screen size category
const screenSize = getScreenSizeCategory(); // 'xs', 'sm', 'md', 'lg', 'xl'

// Constants
const spacing = SPACING.md;        // 8
const fontSize = FONT_SIZES.lg;    // 16
const iconSize = ICON_SIZES.md;    // 20
const breakpoint = BREAKPOINTS.md; // 400
const minWidth = MIN_WIDTH;        // 321
```

## 🎨 Theme

```javascript
import theme from './src/theme/responsiveTheme';

// Colors
const primaryColor = theme.colors.primary;        // '#007AFF'
const grayColor = theme.colors.gray[500];         // '#6B7280'

// Typography
const headingStyle = theme.components.text.heading;
const bodyStyle = theme.components.text.body;

// Spacing
const smallSpacing = theme.spacing.sm;            // 4
const largeSpacing = theme.spacing.xl;            // 16

// Border radius
const smallRadius = theme.borderRadius.sm;        // 4
const largeRadius = theme.borderRadius.lg;        // 12

// Shadows
const cardShadow = theme.shadows.md;

// Components
const buttonStyle = theme.components.button.primary;
const cardStyle = theme.components.card;
const inputStyle = theme.components.input;
```

## 📱 Best Practices

### 1. Use Responsive Components

```javascript
// ✅ Good
<ResponsiveText size="lg" weight="bold">
  Title
</ResponsiveText>

// ❌ Avoid
<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
  Title
</Text>
```

### 2. Use Responsive Hooks

```javascript
// ✅ Good
const { rw, rh, isSmall } = useResponsive();
const width = rw(200);

// ❌ Avoid
const width = Dimensions.get('window').width * 0.5;
```

### 3. Use Responsive Values

```javascript
// ✅ Good
const fontSize = responsiveValue({
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
});

// ❌ Avoid
const fontSize = isSmall ? 12 : 16;
```

### 4. Use Theme Constants

```javascript
// ✅ Good
<ResponsiveView backgroundColor={theme.colors.primary}>
  <ResponsiveText color={theme.colors.white}>
    Content
  </ResponsiveText>
</ResponsiveView>

// ❌ Avoid
<ResponsiveView backgroundColor="#007AFF">
  <ResponsiveText color="#FFFFFF">
    Content
  </ResponsiveText>
</ResponsiveView>
```

### 5. Test on Different Screen Sizes

```javascript
// Test with different screen sizes
const { isSmall, isMedium, isLarge } = useResponsive();

return (
  <ResponsiveView>
    {isSmall && <SmallScreenLayout />}
    {isMedium && <MediumScreenLayout />}
    {isLarge && <LargeScreenLayout />}
  </ResponsiveView>
);
```

## 🔧 Customization

### Custom Responsive Function

```javascript
import { responsiveWidth, responsiveHeight } from './src/utils/responsive';

const customResponsiveSize = (size) => {
  const width = responsiveWidth(size);
  const height = responsiveHeight(size);
  return Math.min(width, height);
};
```

### Custom Theme

```javascript
import { theme } from './src/theme/responsiveTheme';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
  },
};
```

## 📊 Performance Tips

1. **Use Responsive Components**: They handle calculations internally
2. **Memoize Responsive Values**: Use `useMemo` for expensive calculations
3. **Avoid Inline Styles**: Use theme constants instead
4. **Test Performance**: Use React DevTools Profiler

## 🐛 Troubleshooting

### Common Issues

1. **Text too small on small screens**: Use responsive font sizes
2. **Layout breaks on small screens**: Use responsive padding/margins
3. **Images not scaling**: Use ResponsiveImage component
4. **Buttons too small**: Use responsive button sizes

### Debug Mode

```javascript
import { useResponsive } from './src/hooks/useResponsive';

const MyComponent = () => {
  const { screenSize, responsiveWidth, responsiveHeight } = useResponsive();
  
  console.log('Screen Size:', screenSize);
  console.log('Responsive Width:', responsiveWidth);
  console.log('Responsive Height:', responsiveHeight);
  
  return <ResponsiveView>Content</ResponsiveView>;
};
```

## 📚 Examples

See `src/examples/ResponsiveExample.js` for a complete example of all responsive components and features.

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test on different screen sizes
