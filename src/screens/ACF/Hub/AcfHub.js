import { ScrollView, Text, View } from 'react-native';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';

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
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    heroHeight,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className="bg-red-500 shadow-lg"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          minHeight: heroHeight,
          justifyContent: 'center',
          gap: gapSmall,
        }}
      >
        <Text
          className="uppercase text-white/80"
          style={{ letterSpacing: 2, fontSize: responsiveFontSize(12, { min: 11 }) }}
        >
          ACF HUB
        </Text>
        <Text
          className="font-black text-white"
          style={{
            fontSize: responsiveFontSize(28, { min: 24, max: 32 }),
            lineHeight: responsiveFontSize(34, { min: 30, max: 38 }),
          }}
        >
          Trung tâm kết nối thành viên
        </Text>
        <Text
          className="text-white/80"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Điểm đến để quản lý hoạt động, khám phá tài nguyên và kết nối đồng đội.
        </Text>
      </View>

      <View style={{ gap: gapMedium }}>
        {cards.map((card) => (
          <View
            key={card.id}
            className="bg-white shadow-sm"
            style={{
              borderRadius: cardRadius,
              padding: cardPadding,
              gap: gapSmall / 1.3,
            }}
          >
            <Text
              className="font-semibold text-slate-900"
              style={{ fontSize: responsiveFontSize(18) }}
            >
              {card.title}
            </Text>
            <Text
              className="text-slate-500"
              style={{
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20, { min: 18 }),
              }}
            >
              {card.description}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

