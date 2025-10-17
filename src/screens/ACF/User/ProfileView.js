import { useRoute } from '@react-navigation/native';
import { Image, ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatName } from '../../../utils/format';

export default function ProfileView() {
  const route = useRoute();
  const { user } = useAuth();
  const { userId } = route.params ?? {};
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  if (!userId) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Không tìm thấy thành viên tương ứng.
        </Text>
      </View>
    );
  }

  // Tạm thời sử dụng dữ liệu hiện tại làm ví dụ.
  if (!user) {
    return <LoadingSpinner message="Đang tải hồ sơ người dùng..." />;
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
        <Image
          source={{
            uri:
              user.avatar ??
              'https://dummyimage.com/128x128/1e293b/ffffff&text=ACF',
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
          style={{ fontSize: responsiveFontSize(24) }}
        >
          {formatName(user)}
        </Text>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Thành viên cộng đồng • ID: {userId}
        </Text>
      </View>

      <View style={{ gap: gapSmall }}>
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Giới thiệu
        </Text>
        <Text
          className="text-slate-600"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Đây là trang hồ sơ để hiển thị thông tin của thành viên khác. Bạn có thể bổ sung danh sách bài viết, hoạt động đã tham gia hoặc liên hệ trực tiếp.
        </Text>
      </View>
    </ScrollView>
  );
}
