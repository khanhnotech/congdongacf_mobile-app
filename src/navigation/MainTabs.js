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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/ACF/Home/HomeScreen';
import TrendScreen from '../screens/ACF/Trend/TrendScreen';
import ActivitiesList from '../screens/ACF/Activities/ActivitiesList';
import AcfHub from '../screens/ACF/Hub/AcfHub';
import NotificationsList from '../screens/ACF/Notifications/NotificationsList';
import ProfileTab from '../screens/ACF/Profile/ProfileTab';
import LatestPosts from '../screens/ACF/Post/LatestPosts';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { useProfileDetail } from '../hooks/useProfile';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';

const Tab = createBottomTabNavigator();

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

const tabLabels = {
  [ROUTES.TABS.HOME]: 'Trang chủ',
  [ROUTES.TABS.LATEST]: 'Mới nhất',
  [ROUTES.TABS.PORTAL]: 'Xu hướng',
  [ROUTES.TABS.ACTIVITIES]: 'Đăng bài',
  [ROUTES.TABS.HUB]: 'ACF',
  [ROUTES.TABS.NOTIFICATIONS]: 'Thông báo',
  [ROUTES.TABS.PROFILE]: 'Tôi',
};


const tabIconMap = {
  [ROUTES.TABS.HOME]: 'home-variant',
  [ROUTES.TABS.LATEST]: 'clock-outline',
  [ROUTES.TABS.PORTAL]: 'trending-up',
  [ROUTES.TABS.ACTIVITIES]: 'pencil-plus',
  [ROUTES.TABS.NOTIFICATIONS]: 'bell-badge',
  [ROUTES.TABS.PROFILE]: 'account-circle',
};

const menuItems = [
  { label: 'Trang chủ', icon: 'home-outline', action: { type: 'tab', screen: ROUTES.TABS.HOME } },
  { label: 'Mới nhất', icon: 'new-box', action: { type: 'tab', screen: ROUTES.TABS.LATEST } },
  { label: 'Xu hướng', icon: 'trending-up', action: { type: 'tab', screen: ROUTES.TABS.PORTAL } },
  { label: 'Văn bản pháp luật', icon: 'file-document-outline', action: { type: 'stack', screen: ROUTES.STACK.LEGAL_LIST } },
  { label: 'Media', icon: 'image-multiple-outline', action: { type: 'stack', screen: ROUTES.STACK.MEDIA_LIBRARY } },
  { label: 'Liên hệ', icon: 'email-outline', action: { type: 'stack', screen: ROUTES.STACK.CONTACT_FORM } },
];



const menuFooter = [
  { label: 'Về chúng tôi', icon: 'information-outline' },
  { label: 'Thỏa thuận dịch vụ', icon: 'file-document' },
  { label: 'Chính sách riêng tư', icon: 'shield-lock-outline' },
];


function AppHeader({ title, onOpenMenu, onSearch, onAvatarPress, avatarInitials, avatarColor = '#DC2626', userAvatar }) {
  const insets = useSafeAreaInsets();
  const padTop = Math.max(insets.top, 8);
  const spacing = useResponsiveSpacing();
  const { screenPadding, verticalPadding, gapSmall, gapMedium, responsiveFontSize, cardRadius, chipPaddingHorizontal, chipPaddingVertical, responsiveSpacing } = spacing;
  const actionSize = responsiveSpacing(46, { min: 40, max: 52 });
  const tickerHeight = responsiveSpacing(38, { min: 32, max: 46 });
  const tickerMessage = 'Sự kiện: Hệ thống sẽ cập nhật sớm.';
  const timestamp = useMemo(() => new Date().toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }), []);
  const tickerTranslate = useRef(new Animated.Value(0));
  const [tickerWidth, setTickerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!tickerWidth || !contentWidth) return;
    tickerTranslate.current.setValue(tickerWidth);
    const distance = contentWidth + tickerWidth;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(tickerTranslate.current, { toValue: -contentWidth, duration: Math.max(12000, distance * 18), easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(tickerTranslate.current, { toValue: tickerWidth, duration: 16, useNativeDriver: true, easing: Easing.linear }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [tickerWidth, contentWidth]);

  const renderTickerContent = (shouldMeasure = false) => (
    <View
      className="flex-row items-center"
      style={{ paddingRight: gapMedium * 2 }}
      onLayout={shouldMeasure ? (event) => setContentWidth(event.nativeEvent.layout.width) : undefined}
    >
      <MaterialCommunityIcons name="bullhorn" size={responsiveFontSize(16)} color="#991B1B" />
      <Text className="font-semibold text-red-700" style={{ fontSize: responsiveFontSize(13) }}>
        {tickerMessage}
      </Text>
      <View className="flex-row items-center rounded-full bg-red-500" style={{ paddingHorizontal: chipPaddingHorizontal, paddingVertical: chipPaddingVertical / 1.6 }}>
        <MaterialCommunityIcons name="clock-outline" size={responsiveFontSize(14)} color="#FFFFFF" />
        <Text className="font-semibold text-white" style={{ fontSize: responsiveFontSize(12) }}>
          {timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="bg-white shadow-sm" style={{ paddingTop: padTop + gapSmall, paddingBottom: verticalPadding * 0.6, paddingHorizontal: screenPadding }}>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={onOpenMenu} className="items-center justify-center bg-slate-100" style={{ height: actionSize, width: actionSize, borderRadius: actionSize / 2 }}>
          <MaterialCommunityIcons name="menu" size={responsiveFontSize(22)} color="#1E293B" />
        </TouchableOpacity>
        <View className="flex-1"><Text className="text-center font-semibold text-slate-900" style={{ fontSize: responsiveFontSize(20) }} numberOfLines={1}>{title}</Text></View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onSearch} className="items-center justify-center bg-slate-100" style={{ height: actionSize, width: actionSize, borderRadius: actionSize / 2, marginRight: 6 }}>
            <MaterialCommunityIcons name="magnify" size={responsiveFontSize(22)} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onAvatarPress} className="items-center justify-center" style={{ backgroundColor: avatarColor, height: actionSize, width: actionSize, borderRadius: actionSize / 2, overflow: 'hidden' }}>
            {userAvatar ? (
              <Image 
                source={{ uri: userAvatar }} 
                style={{ 
                  height: actionSize, 
                  width: actionSize, 
                  borderRadius: actionSize / 2 
                }}
                resizeMode="cover"
              />
            ) : (
              <Text className="font-semibold text-white" style={{ fontSize: responsiveFontSize(14) }}>{avatarInitials ?? 'A'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center overflow-hidden bg-red-100" style={{ marginTop: gapMedium, height: tickerHeight, borderRadius: cardRadius, paddingHorizontal: chipPaddingHorizontal }} onLayout={(event) => setTickerWidth(event.nativeEvent.layout.width)}>
        <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ translateX: tickerTranslate.current }] }}>
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
  const { screenPadding, verticalPadding, gapSmall, gapMedium, cardPadding, cardRadius, responsiveFontSize, listContentPaddingBottom } = spacing;
  const gapLarge = spacing.gapLarge ?? gapMedium + 6;
  return (
    <Modal animationType="fade" visible={visible} presentationStyle="fullScreen" onRequestClose={onClose}>
      <View className="flex-1 bg-white" style={{ paddingTop: Math.max(insets.top, verticalPadding), paddingHorizontal: screenPadding, paddingBottom: verticalPadding }}>
        <View className="flex-row items-center justify-between" style={{ marginBottom: gapMedium }}>
          <Text className="font-semibold text-slate-900" style={{ fontSize: responsiveFontSize(24) }}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={{ padding: gapSmall }}>
            <MaterialCommunityIcons name="close" size={responsiveFontSize(22)} color="#475569" />
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}>
            <View style={{ gap: gapMedium }}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.label} onPress={() => onSelect(item.action)} className="flex-row items-center" style={{ gap: gapSmall, borderRadius: cardRadius, paddingHorizontal: cardPadding * 0.6, paddingVertical: cardPadding * 0.5, backgroundColor: '#FFFFFF' }}>
                  <MaterialCommunityIcons name={item.icon} size={responsiveFontSize(22)} color="#0F172A" />
                  <Text className="flex-1 font-medium text-slate-800" style={{ fontSize: responsiveFontSize(16) }}>{item.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={responsiveFontSize(22)} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>

          <View className="border-t border-slate-200" style={{ marginTop: gapLarge, paddingTop: gapMedium, gap: gapSmall }}>
            {menuFooter.map((item) => (
              <View key={item.label} className="flex-row items-center" style={{ gap: gapSmall, paddingHorizontal: cardPadding * 0.4 }}>
                <MaterialCommunityIcons name={item.icon} size={responsiveFontSize(20)} color="#94A3B8" />
                <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(14) }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function AccountModal({
  visible,
  onClose,
  onNavigateProfile,
  onUpgrade,
  onReport,
  onSettings,
  onLogout,
  isLoggingOut,
  user,
  avatarInitials,
}) {
  const insets = useSafeAreaInsets();
  const spacing = useResponsiveSpacing();

  if (!visible || !user) return null;

  const {
    screenPadding,
    cardRadius,
    gapSmall,
    cardPadding,
    responsiveFontSize,
    verticalPadding,
  } = spacing;

  const topOffset = Math.max(insets.top, verticalPadding) + gapSmall * 2;
  const menuWidth = 220;
  const displayName = user.fullName ?? user.name ?? user.displayName ?? avatarInitials ?? 'Tài khoản';
  const displayEmail = user.email ?? user.username ?? '';

  const options = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: 'account-circle-outline', action: onNavigateProfile },
    { key: 'upgrade', label: 'Nâng cấp gói', icon: 'crown-outline', action: onUpgrade },
    { key: 'report', label: 'Báo cáo hàng giả', icon: 'alert-decagram-outline', action: onReport },
    { key: 'settings', label: 'Cài đặt', icon: 'cog-outline', action: onSettings },
  ];

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.15)' }}
        />
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: topOffset,
            right: screenPadding,
            width: menuWidth,
          }}
        >
          <View
            style={{
              borderRadius: cardRadius,
              backgroundColor: '#FFFFFF',
              paddingVertical: gapSmall,
              paddingHorizontal: cardPadding * 0.9,
              shadowColor: '#0F172A',
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
              gap: gapSmall * 0.6,
            }}
          >
            <View style={{ gap: gapSmall * 0.2 }}>
              <Text
                className="font-semibold text-slate-900"
                style={{ fontSize: responsiveFontSize(15) }}
                numberOfLines={1}
              >
                {displayName}
              </Text>
              {displayEmail ? (
                <Text
                  className="text-slate-500"
                  style={{ fontSize: responsiveFontSize(12) }}
                  numberOfLines={1}
                >
                  {displayEmail}
                </Text>
              ) : null}
            </View>

            <View style={{ height: 1, backgroundColor: '#E2E8F0' }} />

            <View style={{ gap: gapSmall * 0.4 }}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={item.action}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: gapSmall,
                    paddingVertical: gapSmall * 0.6,
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={responsiveFontSize(18)}
                    color="#1E293B"
                  />
                  <Text
                    className="flex-1 text-slate-800"
                    style={{ fontSize: responsiveFontSize(14) }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: '#E2E8F0' }} />

            <TouchableOpacity
              onPress={onLogout}
              activeOpacity={0.85}
              disabled={isLoggingOut}
              className="bg-red-500"
              style={{
                borderRadius: cardRadius - 4,
                paddingVertical: gapSmall * 0.8,
                alignItems: 'center',
                opacity: isLoggingOut ? 0.6 : 1,
              }}
            >
              <Text
                className="font-semibold text-white"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </Text>
            </TouchableOpacity>
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

  const minX = FLOATING_MARGIN;
  const maxX = Math.max(minX, width - FLOATING_BUTTON_SIZE - FLOATING_MARGIN);
  const minY = Math.max(FLOATING_MARGIN + insets.top, FLOATING_MARGIN);
  const maxY = Math.max(minY, height - FLOATING_BUTTON_SIZE - insets.bottom - FLOATING_MARGIN);

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

  const handleNavigate = useCallback(() => { if (typeof onPress === 'function') onPress(); }, [onPress]);
  const animateScale = useCallback((value) => { Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 20, bounciness: value === 1 ? 8 : 0 }).start(); }, [scale]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: () => { pan.stopAnimation(); dragOrigin.current = lastPosition.current; animateScale(0.94); },
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
      if (Math.abs(gestureState.dx) + Math.abs(gestureState.dy) < 8) handleNavigate();
    },
    onPanResponderTerminate: (_, gestureState) => {
      const nextX = clamp(dragOrigin.current.x + gestureState.dx, minX, maxX);
      const nextY = clamp(dragOrigin.current.y + gestureState.dy, minY, maxY);
      lastPosition.current = { x: nextX, y: nextY };
      pan.setValue(lastPosition.current);
      animateScale(1);
    },
  }), [animateScale, handleNavigate, maxX, maxY, minX, minY, pan]);

  return (
    <Animated.View {...panResponder.panHandlers} style={{ position: 'absolute', top: 0, left: 0, width: FLOATING_BUTTON_SIZE, height: FLOATING_BUTTON_SIZE, zIndex: 999, transform: [...pan.getTranslateTransform(), { scale }] }}>
      <View style={{ height: FLOATING_BUTTON_SIZE, width: FLOATING_BUTTON_SIZE, borderRadius: FLOATING_BUTTON_SIZE / 2, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 6 } }, android: { elevation: 10 } }) }}>
        <Image source={require('../assets/logo.png')} style={{ width: FLOATING_BUTTON_SIZE - 10, height: FLOATING_BUTTON_SIZE - 10 }} resizeMode="contain" />
      </View>
    </Animated.View>
  );
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const { user, logout, logoutStatus } = useAuth();
  const profileQuery = useProfileDetail(user?.id, {
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const rootNavigation = useNavigation();

  const avatarInitials = useMemo(() => {
    if (!user) return 'AC';
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    return `${first}${last}`.trim().toUpperCase() || 'AC';
  }, [user]);

  // Lấy avatar từ profile giống như MyProfile.js
  const userAvatar = useMemo(() => {
    if (!user) return null;
    
    const profileDetail = profileQuery.data;
    
    // Sử dụng cùng logic như MyProfile.js: profileDetail?.avatar ?? user.avatar ?? null
    const avatar = profileDetail?.avatar ?? user?.avatar ?? null;
    return avatar || null;
  }, [user, profileQuery.data]);

  const handleMenuSelect = (action) => {
    setMenuVisible(false);
    if (!action) return;
    if (action.type === 'tab') {
      rootNavigation.navigate(ROUTES.MAIN_TABS, { screen: action.screen });
    } else if (action.type === 'stack') {
      rootNavigation.navigate(action.screen);
    }
  };

  const handleSearch = () => { rootNavigation.navigate(ROUTES.STACK.SEARCH); };
  const handlePortalShortcut = useCallback(() => {
    setMenuVisible(false);
    rootNavigation.navigate(ROUTES.STACK.PORTAL);
  }, [rootNavigation]);
  const handleOpenCreatePost = useCallback(() => {
    setMenuVisible(false);
    if (!user) {
      rootNavigation.navigate(ROUTES.AUTH.LOGIN);
      return;
    }
    rootNavigation.navigate(ROUTES.STACK.CREATE_POST);
  }, [rootNavigation, setMenuVisible, user]);

  const handleAvatarPress = useCallback(() => {
    if (!user) {
      rootNavigation.navigate(ROUTES.AUTH.LOGIN);
      return;
    }
    setAccountModalVisible(true);
  }, [rootNavigation, user]);

  const handleNavigateProfile = useCallback(() => {
    setAccountModalVisible(false);
    rootNavigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TABS.PROFILE });
  }, [rootNavigation]);

  const handleUpgrade = useCallback(() => {
    setAccountModalVisible(false);
    rootNavigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TABS.PORTAL });
  }, [rootNavigation]);

  const handleReport = useCallback(() => {
    setAccountModalVisible(false);
    rootNavigation.navigate(ROUTES.STACK.CONTACT_FORM);
  }, [rootNavigation]);

  const handleSettings = useCallback(() => {
    setAccountModalVisible(false);
    Alert.alert('Cài đặt', 'Tính năng đang được phát triển.');
  }, []);

  const handleLogout = useCallback(() => {
    logout()
      .catch((error) => {
        console.warn('Logout failed', error);
      })
      .finally(() => {
        setAccountModalVisible(false);
      });
  }, [logout]);

  const TAB_BASE = 60;
  const padBottom = Math.max(insets.bottom, 10);
  const tabHeight = TAB_BASE + padBottom;

  return (
    <>
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} onSelect={handleMenuSelect} />
      <AccountModal
        visible={accountModalVisible}
        onClose={() => setAccountModalVisible(false)}
        onNavigateProfile={handleNavigateProfile}
        onUpgrade={handleUpgrade}
        onReport={handleReport}
        onSettings={handleSettings}
        onLogout={handleLogout}
        isLoggingOut={logoutStatus === 'pending'}
        user={user}
        avatarInitials={avatarInitials}
      />
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName={ROUTES.TABS.HOME}
          screenOptions={({ route }) => ({
            header: () => (
              <AppHeader
                title={tabLabels[route.name] ?? 'ACF Community'}
                onOpenMenu={() => setMenuVisible(true)}
                onSearch={handleSearch}
                onAvatarPress={handleAvatarPress}
                avatarInitials={avatarInitials}
                avatarColor={user ? '#DC2626' : '#94A3B8'}
                userAvatar={userAvatar}
              />
            ),
            tabBarShowLabel: true,
            tabBarLabel: tabLabels[route.name],
            tabBarActiveTintColor: '#DC2626',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              height: tabHeight,
              paddingBottom: padBottom,
              paddingTop: 10,
              borderTopWidth: 0,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: -2 },
                },
                android: { elevation: 12 },
              }),
            },
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
            tabBarIcon: ({ color, size, focused }) => {
              if (route.name === ROUTES.TABS.HUB) return null;
              const iconName = tabIconMap[route.name] ?? 'circle-outline';
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  color={color}
                  size={focused ? 28 : 24}
                />
              );
            },
          })}
        >
          <Tab.Screen
            name={ROUTES.TABS.HOME}
            component={HomeScreen}
            options={{ title: tabLabels[ROUTES.TABS.HOME] }}
          />
          <Tab.Screen
            name={ROUTES.TABS.LATEST}
            component={LatestPosts}
            options={{
              title: tabLabels[ROUTES.TABS.LATEST],
              tabBarButton: () => null,
              tabBarIcon: () => null,
              tabBarLabel: () => null,
              tabBarItemStyle: { display: 'none' },
            }}
          />
          <Tab.Screen
            name={ROUTES.TABS.PORTAL}
            component={TrendScreen}
            options={{ title: tabLabels[ROUTES.TABS.PORTAL] }}
          />
          <Tab.Screen
            name={ROUTES.TABS.ACTIVITIES}
            component={ActivitiesList}
            options={{ title: tabLabels[ROUTES.TABS.ACTIVITIES] }}
            listeners={{
              tabPress: (event) => {
                event.preventDefault();
                handleOpenCreatePost();
              },
            }}
          />
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
          <Tab.Screen
            name={ROUTES.TABS.NOTIFICATIONS}
            component={NotificationsList}
            options={{ title: tabLabels[ROUTES.TABS.NOTIFICATIONS] }}
          />
          <Tab.Screen
            name={ROUTES.TABS.PROFILE}
            component={ProfileTab}
            options={{ title: tabLabels[ROUTES.TABS.PROFILE] }}
          />
        </Tab.Navigator>
        <DraggablePortalButton onPress={handlePortalShortcut} />
      </View>
    </>
  );
}





