import { useRoute } from '@react-navigation/native';
import { Image, ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { formatName } from '../../utils/format';

export default function ProfileView() {
  const route = useRoute();
  const { user } = useAuth();
  const { userId } = route.params ?? {};

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-slate-500">
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
    <ScrollView className="flex-1 bg-white px-6 pt-14 pb-24">
      <View className="items-center">
        <Image
          source={{
            uri:
              user.avatar ??
              'https://dummyimage.com/128x128/1e293b/ffffff&text=ACF',
          }}
          className="h-28 w-28 rounded-full border-4 border-red-500"
        />
        <Text className="mt-4 text-2xl font-bold text-slate-900">
          {formatName(user)}
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          Thành viên cộng đồng • ID: {userId}
        </Text>
      </View>

      <View className="mt-8 gap-4">
        <Text className="text-lg font-semibold text-slate-900">
          Giới thiệu
        </Text>
        <Text className="text-sm leading-6 text-slate-600">
          Đây là trang hồ sơ để hiển thị thông tin của thành viên khác. Bạn có
          thể bổ sung danh sách bài viết, hoạt động đã tham gia hoặc liên hệ
          trực tiếp.
        </Text>
      </View>
    </ScrollView>
  );
}
