import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../utils/format';

const notifications = [
  {
    id: 'notif-1',
    title: 'Hoạt động mới từ Ban Thiện Nguyện',
    description:
      'Tuần này chúng ta sẽ phát quà tại xã Phú Sơn. Đăng ký tham gia ngay.',
    createdAt: '2025-02-01T07:30:00Z',
    type: 'activity',
  },
  {
    id: 'notif-2',
    title: 'Bài viết của bạn được yêu thích',
    description:
      'Bài “Lan tỏa nụ cười” đã nhận được 36 lượt thích. Tiếp tục chia sẻ nhé!',
    createdAt: '2025-02-02T09:15:00Z',
    type: 'post',
  },
];

export default function NotificationsList() {
  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="text-3xl font-bold text-slate-900">Thông báo</Text>
      <Text className="mt-2 mb-6 text-sm text-slate-500">
        Cập nhật mới nhất từ cộng đồng ACF.
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <TouchableOpacity className="rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-xs uppercase tracking-wider text-red-600">
              {item.type === 'activity' ? 'Hoạt động' : 'Bài viết'}
            </Text>
            <Text className="mt-1 text-lg font-semibold text-slate-900">
              {item.title}
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              {item.description}
            </Text>
            <Text className="mt-3 text-xs text-slate-400">
              {formatDate(item.createdAt)}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
      />
    </View>
  );
}
