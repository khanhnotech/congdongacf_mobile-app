import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ActivitiesList from '../screens/Activities/ActivitiesList';
import AcfHub from '../screens/Hub/AcfHub';
import NotificationsList from '../screens/Notifications/NotificationsList';
import ProfileTab from '../screens/Profile/ProfileTab';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();

const tabLabels = {
  [ROUTES.TABS.HOME]: 'Trang chủ',
  [ROUTES.TABS.ACTIVITIES]: 'Hoạt động',
  [ROUTES.TABS.HUB]: 'ACF',
  [ROUTES.TABS.NOTIFICATIONS]: 'Thông báo',
  [ROUTES.TABS.PROFILE]: 'Tôi',
};

const tabIconMap = {
  [ROUTES.TABS.HOME]: 'home-variant',
  [ROUTES.TABS.ACTIVITIES]: 'calendar-check',
  [ROUTES.TABS.NOTIFICATIONS]: 'bell-badge',
  [ROUTES.TABS.PROFILE]: 'account-circle',
};

const menuItems = [
  {
    label: 'Trang chủ',
    icon: 'home-outline',
    action: { type: 'tab', screen: ROUTES.TABS.HOME },
  },
  {
    label: 'Hoạt động trung tâm',
    icon: 'calendar-check-outline',
    action: { type: 'tab', screen: ROUTES.TABS.ACTIVITIES },
  },
  {
    label: 'Văn bản pháp luật',
    icon: 'file-document-outline',
    action: { type: 'stack', screen: ROUTES.STACK.LEGAL_LIST },
  },
  {
    label: 'Chủ đề',
    icon: 'format-list-bulleted',
    action: { type: 'stack', screen: ROUTES.STACK.TOPICS_GRID },
  },
  {
    label: 'Media',
    icon: 'image-multiple-outline',
    action: { type: 'stack', screen: ROUTES.STACK.MEDIA_LIBRARY },
  },
  {
    label: 'Chuyên đề',
    icon: 'layers-triple-outline',
    action: { type: 'tab', screen: ROUTES.TABS.HUB },
  },
  {
    label: 'Liên hệ',
    icon: 'email-outline',
    action: { type: 'stack', screen: ROUTES.STACK.CONTACT_FORM },
  },
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
  avatarColor = '#0D9488',
}) {
  return (
    <View className="flex-row items-center justify-between bg-white px-6 pt-14 pb-4 shadow-sm">
      <TouchableOpacity
        onPress={onOpenMenu}
        className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-slate-100"
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="menu" size={22} color="#1E293B" />
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-center text-xl font-semibold text-slate-900">
          {title}
        </Text>
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
          <Text className="text-base font-semibold text-white">
            {avatarInitials ?? 'A'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MenuDrawer({ visible, onClose, onSelect }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable onPress={onClose} className="flex-1 bg-black/50">
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="ml-auto h-full w-5/6 bg-white px-6 pt-10 pb-12 shadow-2xl"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-slate-900">Menu</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <MaterialCommunityIcons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
          <View className="mt-8 gap-4">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => onSelect(item.action)}
                className="flex-row items-center gap-4 rounded-2xl px-3 py-3"
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color="#0F172A"
                />
                <Text className="flex-1 text-base font-medium text-slate-800">
                  {item.label}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            ))}
          </View>
          <View className="mt-10 border-t border-slate-200 pt-6 gap-4">
            {menuFooter.map((item) => (
              <View
                key={item.label}
                className="flex-row items-center gap-3 px-3"
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color="#94A3B8"
                />
                <Text className="text-sm text-slate-500">{item.label}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function LogoTabButton({ children, onPress, accessibilityState }) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="items-center justify-center"
      style={{ top: -24 }}
    >
      <View
        className={`h-16 w-16 items-center justify-center rounded-full ${
          focused ? 'bg-emerald-600' : 'bg-emerald-500'
        } shadow-xl`}
      >
        <Text className="text-xl font-black tracking-widest text-white">
          ACF
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MainTabs() {
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
      rootNavigation.navigate(ROUTES.MAIN_TABS, {
        screen: action.screen,
      });
    } else if (action.type === 'stack') {
      rootNavigation.navigate(action.screen);
    }
  };

  const handleSearch = () => {
    rootNavigation.navigate(ROUTES.STACK.TOPICS_GRID);
  };

  return (
    <>
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelect={handleMenuSelect}
      />
      <Tab.Navigator
        initialRouteName={ROUTES.TABS.HOME}
        screenOptions={({ route }) => ({
          header: () => (
            <AppHeader
              title={tabLabels[route.name] ?? 'ACF Community'}
              onOpenMenu={() => setMenuVisible(true)}
              onSearch={handleSearch}
              onAvatarPress={() =>
                rootNavigation.navigate(ROUTES.MAIN_TABS, {
                  screen: ROUTES.TABS.PROFILE,
                })
              }
              avatarInitials={avatarInitials}
              avatarColor={user ? '#0D9488' : '#94A3B8'}
            />
          ),
          tabBarShowLabel: true,
          tabBarLabel: tabLabels[route.name],
          tabBarActiveTintColor: '#0D9488',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            height: 115,
            paddingBottom: 14,
            paddingTop: 12,
            borderTopWidth: 0,
            elevation: 8,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === ROUTES.TABS.HUB) {
              return null;
            }
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
          options={{ title: 'Trang chủ' }}
        />
        <Tab.Screen
          name={ROUTES.TABS.ACTIVITIES}
          component={ActivitiesList}
          options={{ title: 'Hoạt động' }}
        />
        <Tab.Screen
          name={ROUTES.TABS.HUB}
          component={AcfHub}
          options={{
            tabBarLabel: '',
            title: 'ACF Hub',
            tabBarButton: (props) => <LogoTabButton {...props} />,
          }}
        />
        <Tab.Screen
          name={ROUTES.TABS.NOTIFICATIONS}
          component={NotificationsList}
          options={{ title: 'Thông báo' }}
        />
        <Tab.Screen
          name={ROUTES.TABS.PROFILE}
          component={ProfileTab}
          options={{ title: 'Tôi' }}
        />
      </Tab.Navigator>
    </>
  );
}
