import { ScrollView, Text, View } from 'react-native';

const cards = [
  {
    id: 'hub-1',
    title: 'Tạo bài viết mới',
    description: 'Chia sẻ câu chuyện hoặc hoạt động của bạn với cộng đồng.',
  },
  {
    id: 'hub-2',
    title: 'Khám phá chủ đề',
    description: 'Xem các chủ đề đang được thảo luận sôi nổi.',
  },
  {
    id: 'hub-3',
    title: 'Trung tâm hỗ trợ',
    description: 'Tài nguyên hữu ích dành cho tình nguyện viên ACF.',
  },
];

export default function AcfHub() {
  return (
    <ScrollView className="flex-1 bg-slate-100 px-6 pt-14 pb-24">
      <View className="rounded-3xl bg-emerald-500 p-6 shadow-lg">
        <Text className="text-xs uppercase tracking-[0.2em] text-white/80">
          ACF HUB
        </Text>
        <Text className="mt-3 text-3xl font-black text-white">
          Trung tâm kết nối thành viên
        </Text>
        <Text className="mt-4 text-sm leading-6 text-white/80">
          Điểm đến để quản lý hoạt động, khám phá tài nguyên và kết nối đồng đội.
        </Text>
      </View>

      <View className="mt-6 gap-4">
        {cards.map((card) => (
          <View
            key={card.id}
            className="rounded-3xl bg-white p-5 shadow-sm"
          >
            <Text className="text-lg font-semibold text-slate-900">
              {card.title}
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              {card.description}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
