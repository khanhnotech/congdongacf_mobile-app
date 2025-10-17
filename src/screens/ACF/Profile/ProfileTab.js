import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
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
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    responsiveSpacing,
    listContentPaddingBottom,
  } = useResponsiveSpacing();
  const actionIconSize = responsiveSpacing(48, { min: 44, max: 60 });

  if (user) {
    return <MyProfile />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center" style={{ gap: gapSmall }}>
        <View
          className="items-center justify-center bg-red-100"
          style={{
            height: 96,
            width: 96,
            borderRadius: 48,
          }}
        >
          <MaterialCommunityIcons name="account-circle" size={responsiveFontSize(52)} color="#DC2626" />
        </View>
        <Text
          className="font-bold text-slate-900"
          style={{ marginTop: gapSmall, fontSize: responsiveFontSize(28) }}
        >
          Xin chào!
        </Text>
        <Text
          className="text-center text-slate-500"
          style={{
            marginTop: gapSmall / 2,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Bạn cần đăng nhập để xem hồ sơ cá nhân, theo dõi hoạt động và tham gia cộng đồng ACF.
        </Text>
      </View>

      <View style={{ marginTop: gapMedium, gap: gapMedium }}>
        {authActions.map((action) => {
          const isPrimary = action.variant === 'primary';
          return (
            <TouchableOpacity
              key={action.key}
              onPress={() => navigation.navigate(action.route)}
              activeOpacity={0.85}
              className={`flex-row items-center justify-between ${isPrimary ? 'bg-red-500' : 'bg-red-50 border border-red-100'}`}
              style={{
                borderRadius: cardRadius,
                paddingHorizontal: cardPadding * 0.8,
                paddingVertical: cardPadding * 0.7,
              }}
            >
              <View className="flex-1" style={{ paddingRight: gapSmall }}>
                <Text
                  className={`font-semibold ${isPrimary ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontSize: responsiveFontSize(18) }}
                >
                  {action.label}
                </Text>
                <Text
                  className={`${isPrimary ? 'text-white/80' : 'text-slate-600'}`}
                  style={{
                    marginTop: gapSmall / 2,
                    fontSize: responsiveFontSize(14),
                    lineHeight: responsiveFontSize(20, { min: 18 }),
                  }}
                >
                  {action.description}
                </Text>
              </View>
              <View
                className={`items-center justify-center ${isPrimary ? 'bg-white/15' : 'bg-white'}`}
                style={{
                  height: actionIconSize,
                  width: actionIconSize,
                  borderRadius: actionIconSize / 2,
                }}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={responsiveFontSize(22)}
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
