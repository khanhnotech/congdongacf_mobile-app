// src/navigation/MainTabs.js
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/ACF/Home/HomeScreen';
import PortalScreen from '../screens/Portal/PortalScreen';
import ActivitiesList from '../screens/ACF/Activities/ActivitiesList';
import AcfHub from '../screens/ACF/Hub/AcfHub';
import NotificationsList from '../screens/ACF/Notifications/NotificationsList';
import ProfileTab from '../screens/ACF/Profile/ProfileTab';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';

const Tab = createBottomTabNavigator();

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

const tabLabels = {
  [ROUTES.TABS.HOME]: 'Trang chủ',
  [ROUTES.TABS.PORTAL]: 'Cổng',
  [ROUTES.TABS.ACTIVITIES]: 'Hoạt động',
  [ROUTES.TABS.HUB]: 'ACF',
  [ROUTES.TABS.NOTIFICATIONS]: 'Thông báo',
  [ROUTES.TABS.PROFILE]: 'Tôi',
};

const tabIconMap = {
  [ROUTES.TABS.HOME]: 'home-variant',
  [ROUTES.TABS.PORTAL]: 'web',
  [ROUTES.TABS.ACTIVITIES]: 'calendar-check',
  [ROUTES.TABS.NOTIFICATIONS]: 'bell-badge',
  [ROUTES.TABS.PROFILE]: 'account-circle',
};

const menuItems = [
  { label: 'Trang chủ', icon: 'home-outline', action: { type: 'tab', screen: ROUTES.TABS.HOME } },
  { label: 'Hoạt động trung tâm', icon: 'calendar-check-outline', action: { type: 'tab', screen: ROUTES.TABS.ACTIVITIES } },
  { label: 'Văn bản pháp luật', icon: 'file-document-outline', action: { type: 'stack', screen: ROUTES.STACK.LEGAL_LIST } },
  { label: 'Chủ đề', icon: 'format-list-bulleted', action: { type: 'stack', screen: ROUTES.STACK.TOPICS_GRID } },
  { label: 'Media', icon: 'image-multiple-outline', action: { type: 'stack', screen: ROUTES.STACK.MEDIA_LIBRARY } },
  { label: 'Chuyên đề', icon: 'layers-triple-outline', action: { type: 'tab', screen: ROUTES.TABS.HUB } },
  { label: 'Liên hệ', icon: 'email-outline', action: { type: 'stack', screen: ROUTES.STACK.CONTACT_FORM } },
];

const menuFooter = [
  { label: 'Về chúng tôi', icon: 'information-outline' },
  { label: 'Thỏa thuận dịch vụ', icon: 'file-document' },
  { label: 'Chính sách riêng tư', icon: 'shield-lock-outline' },
];

function AppHeader({
  title,
  onOpenMenu,
  onSearch,
  onAvatarPress,
  avatarInitials,
  avatarColor = '#DC2626',
}) {
  // ? dùng safe-area top để không bị đè bởi status bar (edge-to-edge)
  const insets = useSafeAreaInsets();
  const padTop = Math.max(insets.top, 8);
  const spacing = useResponsiveSpacing();
  const {
    screenPadding,
    verticalPadding,
    gapSmall,
    gapMedium,
    responsiveFontSize,
    cardRadius,
    chipPaddingHorizontal,
    chipPaddingVertical,
    responsiveSpacing,
  } = spacing;
  const gapLarge = spacing.gapLarge ?? gapMedium + 6;
  const actionSize = responsiveSpacing(46, { min: 40, max: 52 });
  const tickerHeight = responsiveSpacing(38, { min: 32, max: 46 });
  const tickerMessage = 'Sự kiện: Hệ thống sẽ cập nhật sớm.';
  const timestamp = useMemo(
    () =>
      new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    [],
  );
  const tickerTranslate = useRef(new Animated.Value(0));
  const [tickerWidth, setTickerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!tickerWidth || !contentWidth) return;

    tickerTranslate.current.setValue(tickerWidth);

    const distance = contentWidth + tickerWidth;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(tickerTranslate.current, {
          toValue: -contentWidth,
          duration: Math.max(12000, distance * 18),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(tickerTranslate.current, {
          toValue: tickerWidth,
          duration: 16,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [tickerWidth, contentWidth]);

  const renderTickerContent = (shouldMeasure = false) => (
    <View
      className="flex-row items-center"
      style={{ gap: gapSmall, paddingRight: gapMedium * 2 }}
      onLayout={
        shouldMeasure ? (event) => setContentWidth(event.nativeEvent.layout.width) : undefined
      }
    >
      <MaterialCommunityIcons name="bullhorn" size={responsiveFontSize(16)} color="#991B1B" />
      <Text
        className="font-semibold text-red-700"
        style={{ fontSize: responsiveFontSize(13) }}
      >
        {tickerMessage}
      </Text>
      <View
        className="flex-row items-center rounded-full bg-red-500"
        style={{
          gap: gapSmall / 1.4,
          paddingHorizontal: chipPaddingHorizontal,
          paddingVertical: chipPaddingVertical / 1.6,
        }}
      >
        <MaterialCommunityIcons name="clock-outline" size={responsiveFontSize(14)} color="#FFFFFF" />
        <Text
          className="font-semibold text-white"
          style={{ fontSize: responsiveFontSize(12) }}
        >
          {timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      className="bg-white shadow-sm"
      style={{
        paddingTop: padTop + gapSmall,
        paddingBottom: verticalPadding * 0.6,
        paddingHorizontal: screenPadding,
      }}
    >
      <View
        className="flex-row items-center justify-between"
        style={{ gap: gapSmall }}
      >
        <TouchableOpacity
          onPress={onOpenMenu}
          className="items-center justify-center bg-slate-100"
          activeOpacity={0.8}
          style={{
            height: actionSize,
            width: actionSize,
            borderRadius: actionSize / 2,
          }}
        >
          <MaterialCommunityIcons name="menu" size={responsiveFontSize(22)} color="#1E293B" />
        </TouchableOpacity>

        <View className="flex-1" style={{ paddingHorizontal: gapSmall }}>
          <Text
            className="text-center font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(20) }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={onSearch}
            className="items-center justify-center bg-slate-100"
            activeOpacity={0.8}
            style={{
              height: actionSize,
              width: actionSize,
              borderRadius: actionSize / 2,
              marginRight: gapSmall / 1.2,
            }}
          >
            <MaterialCommunityIcons name="magnify" size={responsiveFontSize(22)} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAvatarPress}
            activeOpacity={0.9}
            className="items-center justify-center"
            style={{
              backgroundColor: avatarColor,
              height: actionSize,
              width: actionSize,
              borderRadius: actionSize / 2,
            }}
          >
            <Text
              className="font-semibold text-white"
              style={{ fontSize: responsiveFontSize(14) }}
            >
              {avatarInitials ?? 'A'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="flex-row items-center overflow-hidden bg-red-100"
        style={{
          marginTop: gapMedium,
          height: tickerHeight,
          borderRadius: cardRadius,
          paddingHorizontal: chipPaddingHorizontal,
        }}
        onLayout={(event) => setTickerWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            transform: [{ translateX: tickerTranslate.current }],
          }}
        >
          {renderTickerContent(true)}
          <View style={{ paddingLeft: gapMedium * 2 }}>{renderTickerContent()}</View>
        </Animated.View>
      </View>
    </View>
  );
}

function MenuDrawer({ visible, onClose, onSelect }) {
  const insets = useSafeAreaInsets();
  const spacing = useResponsiveSpacing();
  const {
    screenPadding,
    verticalPadding,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    listContentPaddingBottom,
  } = spacing;
  const gapLarge = spacing.gapLarge ?? gapMedium + 6;
  return (
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-white"
        style={{
          paddingTop: Math.max(insets.top, verticalPadding),
          paddingHorizontal: screenPadding,
          paddingBottom: verticalPadding,
        }}
      >
        <View
          className="flex-row items-center justify-between"
          style={{ marginBottom: gapMedium }}
        >
          <Text
            className="font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(24) }}
          >
            Menu
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={{ padding: gapSmall }}>
            <MaterialCommunityIcons name="close" size={responsiveFontSize(22)} color="#475569" />
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}
          >
            <View style={{ gap: gapMedium }}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => onSelect(item.action)}
                  activeOpacity={0.85}
                  className="flex-row items-center"
                  style={{
                    gap: gapSmall,
                    borderRadius: cardRadius,
                    paddingHorizontal: cardPadding * 0.6,
                    paddingVertical: cardPadding * 0.5,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <MaterialCommunityIcons name={item.icon} size={responsiveFontSize(22)} color="#0F172A" />
                  <Text
                    className="flex-1 font-medium text-slate-800"
                    style={{ fontSize: responsiveFontSize(16) }}
                  >
                    {item.label}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={responsiveFontSize(22)} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View
            className="border-t border-slate-200"
            style={{ marginTop: gapLarge, paddingTop: gapMedium, gap: gapSmall }}
          >
            {menuFooter.map((item) => (
              <View
                key={item.label}
                className="flex-row items-center"
                style={{
                  gap: gapSmall,
                  paddingHorizontal: cardPadding * 0.4,
                }}
              >
                <MaterialCommunityIcons name={item.icon} size={responsiveFontSize(20)} color="#94A3B8" />
                <Text
                  className="text-slate-500"
                  style={{ fontSize: responsiveFontSize(14) }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const FLOATING_BUTTON_SIZE = 68;
const FLOATING_MARGIN = 16;

function DraggablePortalButton({ onPress }) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lastPosition = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0 });

  const horizontalMargin = FLOATING_MARGIN;
  const verticalMargin = FLOATING_MARGIN;
  const minX = horizontalMargin;
  const maxX = Math.max(minX, width - FLOATING_BUTTON_SIZE - horizontalMargin);
  const minY = Math.max(verticalMargin + insets.top, verticalMargin);
  const maxY = Math.max(minY, height - FLOATING_BUTTON_SIZE - insets.bottom - verticalMargin);

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

  const handleNavigate = useCallback(() => {
    if (typeof onPress === 'function') {
      onPress();
    }
  }, [onPress]);

  const animateScale = useCallback(
    (value) => {
      Animated.spring(scale, {
        toValue: value,
        useNativeDriver: true,
        speed: 20,
        bounciness: value === 1 ? 8 : 0,
      }).start();
    },
    [scale],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
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
          const travel = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
          if (travel < 8) {
            handleNavigate();
          }
        },
        onPanResponderTerminate: (_, gestureState) => {
          const nextX = clamp(dragOrigin.current.x + gestureState.dx, minX, maxX);
          const nextY = clamp(dragOrigin.current.y + gestureState.dy, minY, maxY);
          lastPosition.current = { x: nextX, y: nextY };
          pan.setValue(lastPosition.current);
          animateScale(1);
        },
      }),
    [animateScale, handleNavigate, maxX, maxY, minX, minY, pan],
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      accessibilityRole="button"
      accessibilityLabel="Đi tới cổng thông tin"
      onAccessibilityTap={handleNavigate}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: FLOATING_BUTTON_SIZE,
        height: FLOATING_BUTTON_SIZE,
        zIndex: 999,
        transform: [...pan.getTranslateTransform(), { scale }],
      }}
    >
      <View
        style={{
          height: FLOATING_BUTTON_SIZE,
          width: FLOATING_BUTTON_SIZE,
          borderRadius: FLOATING_BUTTON_SIZE / 2,
          backgroundColor: '#DC2626',
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.22,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 6 },
            },
            android: { elevation: 10 },
          }),
        }}
      >
        <Image
          source={require('../assets/logo.png')}
          style={{ width: FLOATING_BUTTON_SIZE - 10, height: FLOATING_BUTTON_SIZE - 10 }}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const rootNavigation = useNavigation();

  const avatarInitials = useMemo(() => {
    if (!user) return 'AC';
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    return `${first}${last}`.trim().toUpperCase() || 'AC';
  }, [user]);

  const handleMenuSelect = (action) => {
    setMenuVisible(false);
    if (!action) return;
    if (action.type === 'tab') {
      rootNavigation.navigate(ROUTES.MAIN_TABS, { screen: action.screen });
    } else if (action.type === 'stack') {
      rootNavigation.navigate(action.screen);
    }
  };

  const handleSearch = () => {
    rootNavigation.navigate(ROUTES.STACK.TOPICS_GRID);
  };

  const handlePortalShortcut = useCallback(() => {
    setMenuVisible(false);
    rootNavigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TABS.PORTAL });
  }, [rootNavigation]);

  // ➜ TabBar responsive theo safe-area
  const TAB_BASE = 60; // base height cho icon + label
  const padBottom = Math.max(insets.bottom, 10); // tối thiểu 10 cho đẹp
  const tabHeight = TAB_BASE + padBottom;

  return (
    <>
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} onSelect={handleMenuSelect} />

      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName={ROUTES.TABS.HOME}
          screenOptions={({ route }) => ({
            header: () => (
              <AppHeader
                title={tabLabels[route.name] ?? 'ACF Community'}
                onOpenMenu={() => setMenuVisible(true)}
                onSearch={handleSearch}
                onAvatarPress={() =>
                  rootNavigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TABS.PROFILE })
                }
                avatarInitials={avatarInitials}
                avatarColor={user ? '#DC2626' : '#94A3B8'}
              />
            ),
            tabBarShowLabel: true,
            tabBarLabel: tabLabels[route.name],
            tabBarActiveTintColor: '#DC2626',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarHideOnKeyboard: true, // tránh bàn phím che
            tabBarStyle: {
              height: tabHeight,
              paddingBottom: padBottom,
              paddingTop: 10,
              borderTopWidth: 0,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: -2 } },
                android: { elevation: 12 },
              }),
            },
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
            tabBarIcon: ({ color, size, focused }) => {
              if (route.name === ROUTES.TABS.HUB) return null; // tab đã được ẩn
              const iconName = tabIconMap[route.name] ?? 'circle-outline';
              return <MaterialCommunityIcons name={iconName} color={color} size={focused ? 28 : 24} />;
            },
          })}
        >
          <Tab.Screen name={ROUTES.TABS.HOME} component={HomeScreen} options={{ title: 'Trang chủ' }} />
          <Tab.Screen 
            name={ROUTES.TABS.PORTAL} 
            component={PortalScreen} 
            options={{ 
              title: 'Cổng',
              headerShown: false,
              tabBarStyle: { display: 'none' }
            }} 
          />
          <Tab.Screen name={ROUTES.TABS.ACTIVITIES} component={ActivitiesList} options={{ title: 'Hoạt động' }} />
          <Tab.Screen
            name={ROUTES.TABS.HUB}
            component={AcfHub}
            options={{
              title: 'ACF Hub',
              tabBarButton: () => null,
              tabBarIcon: () => null,
              tabBarLabel: () => null,
              tabBarItemStyle: { display: 'none' },
            }}
          />
          <Tab.Screen name={ROUTES.TABS.NOTIFICATIONS} component={NotificationsList} options={{ title: 'Thông báo' }} />
          <Tab.Screen name={ROUTES.TABS.PROFILE} component={ProfileTab} options={{ title: 'Tôi' }} />
        </Tab.Navigator>

        <DraggablePortalButton onPress={handlePortalShortcut} />
      </View>
    </>
  );
}

