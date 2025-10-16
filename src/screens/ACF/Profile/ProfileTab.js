import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../utils/constants';
import MyProfile from './MyProfile';

const authActions = [
  {
    key: 'login',
    label: 'Đăng nhập',
    description: 'Truy cập vào tài khoản hiện có của bạn.',
    icon: 'login-variant',
    route: ROUTES.AUTH.LOGIN,
    variant: 'primary',
  },
  {
    key: 'register',
    label: 'Tạo tài khoản mới',
    description: 'Gia nhập cộng đồng ACF và kết nối hoạt động ý nghĩa.',
    icon: 'account-plus',
    route: ROUTES.AUTH.REGISTER,
    variant: 'outline',
  },
  {
    key: 'forgot',
    label: 'Quên mật khẩu',
    description: 'Nhận hướng dẫn đặt lại mật khẩu qua email.',
    icon: 'shield-key',
    route: ROUTES.AUTH.FORGOT_PASSWORD,
    variant: 'outline',
  },
];

export default function ProfileTab() {
  const navigation = useNavigation();
  const { user } = useAuth();

  if (user) {
    return <MyProfile />;
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14 pb-24">
      <View className="items-center">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <MaterialCommunityIcons name="account-circle" size={56} color="#DC2626" />
        </View>
        <Text className="mt-6 text-3xl font-bold text-slate-900">
          Xin chào!
        </Text>
        <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
          Bạn cần đăng nhập để xem hồ sơ cá nhân, theo dõi hoạt động và tham gia cộng đồng ACF.
        </Text>
      </View>

      <View className="mt-10 gap-4">
        {authActions.map((action) => {
          const isPrimary = action.variant === 'primary';
          return (
            <TouchableOpacity
              key={action.key}
              onPress={() => navigation.navigate(action.route)}
              className={`flex-row items-center justify-between rounded-3xl px-5 py-5 ${
                isPrimary ? 'bg-red-500' : 'bg-red-50 border border-red-100'
              }`}
              activeOpacity={0.85}
            >
              <View className="flex-1 pr-4">
                <Text
                  className={`text-lg font-semibold ${
                    isPrimary ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {action.label}
                </Text>
                <Text
                  className={`mt-1 text-sm ${
                    isPrimary ? 'text-white/80' : 'text-slate-600'
                  }`}
                >
                  {action.description}
                </Text>
              </View>
              <View
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  isPrimary ? 'bg-white/15' : 'bg-white'
                }`}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={24}
                  color={isPrimary ? '#FFFFFF' : '#DC2626'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
