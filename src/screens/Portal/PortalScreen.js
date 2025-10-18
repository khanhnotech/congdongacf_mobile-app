import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../utils/constants';
const applications = [
  {
    id: 1,
    title: 'Sổ tay đảng viên',
    icon: 'book-open-variant',
    description: 'Hệ thống quản lý thông tin đảng viên',
  },
  {
    id: 2,
    title: 'Thu thập thông tin Internet',
    icon: 'web',
    description: 'Thu thập và phân tích dữ liệu từ Internet',
  },
  {
    id: 3,
    title: 'Trợ lý tổ chức đại hội',
    icon: 'robot',
    description: 'Hỗ trợ tư vấn công tác đại hội các cấp',
  },
  {
    id: 4,
    title: 'Theo dõi tiến trình đại hội',
    icon: 'chart-line',
    description: 'Giám sát và báo cáo tiến độ đại hội',
  },
  {
    id: 5,
    title: 'Cổng thông tin điện tử',
    icon: 'web',
    description: 'Cổng thông tin chính thức của tổ chức',
  },
  {
    id: 6,
    title: 'Hệ thống thông tin',
    icon: 'information',
    description: 'Quản lý thông tin tổng hợp',
  },
];
const PortalScreen = () => {
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const { cardWidth, gapSpacing } = useMemo(() => {
    const horizontalPadding = 40; // 20 left + 20 right

    if (!width) {
      return { cardWidth: 140, gapSpacing: 16 };
    }

    // if (width >= 1024) {
    //   const gap = 22;
    //   const columns = 4;
    //   const available = width - horizontalPadding - gap * (columns - 1);
    //   return { cardWidth: available / columns, gapSpacing: gap };
    // }

    if (width >= 768) {
      const gap = 18;
      const columns = 3;
      const available = width - horizontalPadding - gap * (columns - 1);
      return { cardWidth: available / columns, gapSpacing: gap };
    }

    const gap = 14;
    const columns = 3;
    const available = width - horizontalPadding - gap * (columns - 1);
    return { cardWidth: available / columns, gapSpacing: gap };
  }, [width]);
  const handleAppPress = () => {
    navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TABS.HOME });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate(ROUTES.STACK.PORTAL);
    }, 100);
    return () => clearTimeout(timer);
  }, [navigation]);
  const renderApplicationCard = (app) => (
    <TouchableOpacity
      key={app.id}
      className="items-center rounded-2xl border border-slate-200 bg-white"
      activeOpacity={0.85}
      onPress={() => handleAppPress(app)}
      style={{
        width: cardWidth,
        padding: 18,
        marginBottom: gapSpacing,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <View className="mb-3.5 h-[55px] w-[55px] items-center justify-center rounded-[16px] border-2 border-red-500 bg-rose-50">
        <MaterialCommunityIcons name={app.icon} size={30} color="#DC2626" />
      </View>
      <Text className="text-center text-sm font-semibold text-slate-800 leading-5">
        {app.title}
      </Text>
      <Text className="mt-2 text-center text-xs text-slate-500 leading-4">
        {app.description}
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View
        className="bg-red-600 px-5 py-6"
        style={{
          // paddingTop: insets.top,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="mb-6 flex-row items-center">
          <View className="relative mr-5 h-12 w-14 items-center justify-center">
            <Image
              source={require('../../assets/logo.png')}
              className="h-12 w-12 rounded-lg"
              resizeMode="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold uppercase tracking-wide text-white">
              Cổng thông tin phòng chống hàng giả ACF
            </Text>
            <Text className="text-sm font-medium text-white/90">
              Cụm các chức năng chuyên dụng
            </Text>
          </View>
        </View>
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <View
            className="flex-1 flex-row items-center rounded-full bg-white"
            style={{
              paddingHorizontal: 18,
              paddingVertical: 14,
              gap: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#666666" />
            <TextInput
              className="flex-1 text-base font-medium text-slate-700"
              placeholder="Tìm kiếm ứng dụng"
              placeholderTextColor="#666666"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            className="rounded-full bg-white px-6 py-3.5"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text className="text-base font-semibold text-red-600">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-semibold text-slate-900">Ứng dụng nổi bật</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Khởi chạy nhanh các công cụ phục vụ công tác quản lý và vận hành.
        </Text>
        <View
          className="mt-5 flex-row flex-wrap justify-start"
          style={{ gap: gapSpacing }}
        >
          {applications.map(renderApplicationCard)}
        </View>
        <View className="mt-8 rounded-xl border-l-4 border-red-600 bg-slate-50 px-5 py-5">
          <Text className="text-base font-semibold text-slate-900">Hỗ trợ & liên hệ</Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500">
            Liên hệ: 1900 066 689
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default PortalScreen;
