import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDate } from '../../../utils/format';

const notifications = [
  {
    id: 'notif-1',
    title: 'Hoạt động mới từ Ban Thiện Nguyện',
    description: 'Tuần này chúng ta sẽ phát quà tại xã Phú Sơn. Đăng ký tham gia ngay.',
    createdAt: '2025-02-01T07:30:00Z',
    type: 'activity',
  },
  {
    id: 'notif-2',
    title: 'Bài viết của bạn được yêu thích',
    description: 'Bài “Lan tỏa nụ cười” đã nhận được 36 lượt thích. Tiếp tục chia sẻ nhé!',
    createdAt: '2025-02-02T09:15:00Z',
    type: 'post',
  },
];

export default function NotificationsList() {
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  return (
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
      }}
    >
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        Thông báo
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginTop: gapSmall,
          marginBottom: gapMedium,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Cập nhật mới nhất từ cộng đồng ACF.
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: gapMedium }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white shadow-sm"
            style={{
              borderRadius: cardRadius,
              padding: cardPadding,
            }}
          >
            <Text
              className="uppercase tracking-wider text-red-600"
              style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
            >
              {item.type === 'activity' ? 'Hoạt động' : 'Bài viết'}
            </Text>
            <Text
              className="font-semibold text-slate-900"
              style={{ marginTop: gapSmall / 2, fontSize: responsiveFontSize(18) }}
            >
              {item.title}
            </Text>
            <Text
              className="text-slate-500"
              style={{
                marginTop: gapSmall,
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20, { min: 18 }),
              }}
            >
              {item.description}
            </Text>
            <Text
              className="text-slate-400"
              style={{ marginTop: gapSmall, fontSize: responsiveFontSize(12, { min: 10 }) }}
            >
              {formatDate(item.createdAt)}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}
      />
    </View>
  );
}
