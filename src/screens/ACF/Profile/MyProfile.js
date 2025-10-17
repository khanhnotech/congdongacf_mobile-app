import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';
import { formatName } from '../../../utils/format';

export default function MyProfile() {
  const navigation = useNavigation();
  const { user, logout, logoutStatus } = useAuth();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    buttonPaddingVertical,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  if (!user) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: screenPadding }}
      >
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Bạn chưa đăng nhập. Hãy đăng nhập để xem hồ sơ.
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom / 2,
      }}
    >
      <View
        className="items-center bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Image
          source={{
            uri:
              user.avatar ??
              'https://dummyimage.com/128x128/0f172a/ffffff&text=ACF',
          }}
          style={{
            height: 112,
            width: 112,
            borderRadius: 56,
            borderWidth: 4,
            borderColor: '#DC2626',
          }}
        />
        <Text
          className="font-bold text-slate-900"
          style={{ marginTop: gapSmall, fontSize: responsiveFontSize(24) }}
        >
          {formatName(user)}
        </Text>
        <Text
          className="text-slate-500"
          style={{ marginTop: gapSmall / 2, fontSize: responsiveFontSize(14) }}
        >
          {user.email}
        </Text>
        <Text
          className="text-center text-slate-600"
          style={{
            marginTop: gapSmall,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          {user.bio}
        </Text>

        <View
          className="w-full flex-row justify-center"
          style={{ marginTop: gapMedium, gap: gapSmall }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.STACK.EDIT_PROFILE)}
            activeOpacity={0.85}
            className="flex-1 bg-red-500"
            style={{
              borderRadius: cardRadius - 4,
              paddingVertical: buttonPaddingVertical,
            }}
          >
            <Text
              className="text-center font-semibold text-white"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logout().catch((error) => console.warn('Logout failed', error))}
            activeOpacity={0.85}
            className="flex-1 border border-slate-200"
            disabled={logoutStatus === 'pending'}
            style={{
              borderRadius: cardRadius - 4,
              paddingVertical: buttonPaddingVertical,
              opacity: logoutStatus === 'pending' ? 0.6 : 1,
            }}
          >
            <Text
              className="text-center font-semibold text-slate-600"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              {logoutStatus === 'pending' ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Hoạt động gần đây
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Danh sách bài viết/hoạt động bạn tham gia sẽ xuất hiện tại đây.
        </Text>
      </View>
    </View>
  );
}

