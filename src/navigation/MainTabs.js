// src/navigation/MainTabs.js
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, ScrollView, Text, TouchableOpacity, View, Platform, Image } from 'react-native';
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

const Tab = createBottomTabNavigator();

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
      className="flex-row items-center gap-3 pr-10"
      onLayout={
        shouldMeasure ? (event) => setContentWidth(event.nativeEvent.layout.width) : undefined
      }
    >
      <MaterialCommunityIcons name="bullhorn" size={16} color="#991B1B" />
      <Text className="text-sm font-semibold text-red-700">{tickerMessage}</Text>
      <View className="flex-row items-center gap-2 rounded-full bg-red-500 px-3 py-1">
        <MaterialCommunityIcons name="clock-outline" size={14} color="#FFFFFF" />
        <Text className="text-xs font-semibold text-white">{timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View
      className="bg-white px-6 pb-4 shadow-sm"
      style={{ paddingTop: padTop + 6 }}
    >
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onOpenMenu}
          className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-slate-100"
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="menu" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-center text-xl font-semibold text-slate-900">{title}</Text>
        </View>

        <View className="ml-3 flex-row items-center">
          <TouchableOpacity
            onPress={onSearch}
            className="mr-2 h-11 w-11 items-center justify-center rounded-full bg-slate-100"
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="magnify" size={22} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAvatarPress}
            activeOpacity={0.9}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: avatarColor }}
          >
            <Text className="text-base font-semibold text-white">{avatarInitials ?? 'A'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="mt-3 h-9 flex-row items-center overflow-hidden rounded-full bg-red-100 px-4"
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
          <View className="pl-10">{renderTickerContent()}</View>
        </Animated.View>
      </View>
    </View>
  );
}

function MenuDrawer({ visible, onClose, onSelect }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-white px-6 pb-24"
        style={{ paddingTop: Math.max(insets.top, 10) }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-slate-900">Menu</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <MaterialCommunityIcons name="close" size={22} color="#475569" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 mt-8">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="gap-4">
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => onSelect(item.action)}
                  className="flex-row items-center gap-4 rounded-2xl px-3 py-3"
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name={item.icon} size={22} color="#0F172A" />
                  <Text className="flex-1 text-base font-medium text-slate-800">{item.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View className="mt-6 border-t border-slate-200 pt-6 gap-4">
            {menuFooter.map((item) => (
              <View key={item.label} className="flex-row items-center gap-3 px-3">
                <MaterialCommunityIcons name={item.icon} size={20} color="#94A3B8" />
                <Text className="text-sm text-slate-500">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function LogoTabButton({ onPress, accessibilityState }) {
  const focused = accessibilityState?.selected;
  const insets = useSafeAreaInsets();
  // Nổi lên nhưng vẫn cách mép dưới theo safe-area để khỏi đè home indicator
  const floatUp = 5; // độ nổi cơ bản
  const extraLift = Math.max(0, insets.bottom - 8) * 0.5;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="items-center justify-center"
      style={{ top: -(floatUp + extraLift) }}
    >
      <View
        className={`h-16 w-16 items-center justify-center rounded-full ${
          focused ? 'bg-red-600' : 'bg-red-500'
        }`}
        style={{
          // shadow cross-platform
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
            android: { elevation: 6 },
          }),
        }}
      >
        <Image
          source={require('../assets/logo.png')}
          className="h-[62px] w-[62px]"
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
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

  // ➜ TabBar responsive theo safe-area
  const TAB_BASE = 60; // base height cho icon + label
  const padBottom = Math.max(insets.bottom, 10); // tối thiểu 10 cho đẹp
  const tabHeight = TAB_BASE + padBottom;

  return (
    <>
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} onSelect={handleMenuSelect} />

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
            if (route.name === ROUTES.TABS.HUB) return null; // nút tròn custom
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
            tabBarLabel: '',
            title: 'ACF Hub',
            tabBarButton: (props) => <LogoTabButton {...props} />,
          }}
        />
        <Tab.Screen name={ROUTES.TABS.NOTIFICATIONS} component={NotificationsList} options={{ title: 'Thông báo' }} />
        <Tab.Screen name={ROUTES.TABS.PROFILE} component={ProfileTab} options={{ title: 'Tôi' }} />
      </Tab.Navigator>
    </>
  );
}

