import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { TouchableOpacity, View, Text, Animated, PanResponder, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

const BUBBLE_SIZE = 60;
const BUBBLE_MARGIN = 16;

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

const ChatBubble = ({ onPress, isVisible = true, unreadCount = 0 }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lastPosition = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0 });

  const minX = BUBBLE_MARGIN;
  const maxX = Math.max(minX, width - BUBBLE_SIZE - BUBBLE_MARGIN);
  const minY = Math.max(BUBBLE_MARGIN + insets.top, BUBBLE_MARGIN);
  const maxY = Math.max(minY, height - BUBBLE_SIZE - insets.bottom - BUBBLE_MARGIN);

  const initialX = maxX;
  const initialY = Math.max(minY, maxY - 120);

  useEffect(() => {
    const boundedX = clamp(lastPosition.current.x || initialX, minX, maxX);
    const boundedY = clamp(lastPosition.current.y || initialY, minY, maxY);
    const nextPosition = { x: boundedX, y: boundedY };
    lastPosition.current = nextPosition;
    dragOrigin.current = nextPosition;
    pan.setValue(nextPosition);
  }, [initialX, initialY, maxX, maxY, minX, minY, pan]);

  const handlePress = useCallback(() => { 
    if (typeof onPress === 'function') onPress(); 
  }, [onPress]);
  
  const animateScale = useCallback((value) => { 
    Animated.spring(scale, { 
      toValue: value, 
      useNativeDriver: true, 
      speed: 20, 
      bounciness: value === 1 ? 8 : 0 
    }).start(); 
  }, [scale]);
  
  console.log('ChatBubble render:', { isVisible, unreadCount });
  
  if (!isVisible) {
    console.log('ChatBubble not visible');
    return null;
  }

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: () => { 
      pan.stopAnimation(); 
      dragOrigin.current = lastPosition.current; 
      animateScale(0.94); 
    },
    onPanResponderMove: (_, gestureState) => {
      const nextX = clamp(dragOrigin.current.x + gestureState.dx, minX, maxX);
      const nextY = clamp(dragOrigin.current.y + gestureState.dy, minY, maxY);
      pan.setValue({ x: nextX, y: nextY });
    },
    onPanResponderRelease: (_, gestureState) => {
      const nextX = clamp(dragOrigin.current.x + gestureState.dx, minX, maxX);
      const nextY = clamp(dragOrigin.current.y + gestureState.dy, minY, maxY);
      lastPosition.current = { x: nextX, y: nextY };
      pan.setValue(lastPosition.current);
      animateScale(1);
      if (Math.abs(gestureState.dx) + Math.abs(gestureState.dy) < 8) handlePress();
    },
    onPanResponderTerminate: (_, gestureState) => {
      const nextX = clamp(dragOrigin.current.x + gestureState.dx, minX, maxX);
      const nextY = clamp(dragOrigin.current.y + gestureState.dy, minY, maxY);
      lastPosition.current = { x: nextX, y: nextY };
      pan.setValue(lastPosition.current);
      animateScale(1);
    },
  }), [animateScale, handlePress, maxX, maxY, minX, minY, pan]);

  return (
    <Animated.View 
      {...panResponder.panHandlers} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: BUBBLE_SIZE, 
        height: BUBBLE_SIZE, 
        zIndex: 999, 
        transform: [...pan.getTranslateTransform(), { scale }] 
      }}
    >
      <View 
        style={{ 
          height: BUBBLE_SIZE, 
          width: BUBBLE_SIZE, 
          borderRadius: BUBBLE_SIZE / 2, 
          backgroundColor: '#DC2626', 
          alignItems: 'center', 
          justifyContent: 'center', 
          ...Platform.select({ 
            ios: { 
              shadowColor: '#000', 
              shadowOpacity: 0.22, 
              shadowRadius: 8, 
              shadowOffset: { width: 0, height: 6 } 
            }, 
            android: { 
              elevation: 10 
            } 
          }) 
        }}
      >
        <MaterialCommunityIcons
          name="chat"
          size={24}
          color="white"
        />
        
        {unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: '#EF4444',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              paddingHorizontal: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ 
                color: 'white',
                fontWeight: 'bold',
                fontSize: 10 
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default ChatBubble;
