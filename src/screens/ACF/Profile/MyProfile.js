import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../utils/constants';
import { formatName } from '../../../utils/format';

export default function MyProfile() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-base text-slate-500">
          Bạn chưa đăng nhập. Hãy đăng nhập để xem hồ sơ.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <View className="items-center rounded-3xl bg-white px-6 py-10 shadow-sm">
        <Image
          source={{
            uri:
              user.avatar ??
              'https://dummyimage.com/128x128/0f172a/ffffff&text=ACF',
          }}
          className="h-28 w-28 rounded-full border-4 border-red-500"
        />
        <Text className="mt-4 text-2xl font-bold text-slate-900">
          {formatName(user)}
        </Text>
        <Text className="mt-1 text-sm text-slate-500">{user.email}</Text>
        <Text className="mt-3 text-center text-sm leading-6 text-slate-600">
          {user.bio}
        </Text>

        <View className="mt-6 w-full flex-row justify-center gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.STACK.EDIT_PROFILE)}
            className="flex-1 rounded-2xl bg-red-500 py-3"
            activeOpacity={0.85}
          >
            <Text className="text-center text-base font-semibold text-white">
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={logout}
            className="flex-1 rounded-2xl border border-slate-200 py-3"
            activeOpacity={0.85}
          >
            <Text className="text-center text-base font-semibold text-slate-600">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-lg font-semibold text-slate-900">
          Hoạt động gần đây
        </Text>
        <Text className="mt-2 text-sm text-slate-500">
          Danh sách bài viết/hoạt động bạn tham gia sẽ xuất hiện tại đây.
        </Text>
      </View>
    </View>
  );
}

