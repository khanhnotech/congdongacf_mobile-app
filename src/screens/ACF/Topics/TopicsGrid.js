import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useTopics } from '../../../hooks/useTopics';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function TopicsGrid() {
  const navigation = useNavigation();
  const { listQuery } = useTopics();
  const {
    width,
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

  const tileGap = gapSmall;
  const tileWidth = Math.max(
    150,
    Math.floor((width - screenPadding * 2 - tileGap) / 2),
  );

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải chủ đề..." />;
  }

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
        style={{ marginBottom: gapSmall, fontSize: responsiveFontSize(28) }}
      >
        Chủ đề cộng đồng
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginBottom: gapMedium,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Lựa chọn chủ đề để xem các bài viết, media và hoạt động liên quan.
      </Text>

      <FlatList
        data={listQuery.data?.items ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: tileGap, marginBottom: tileGap }}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có chủ đề"
            description="Quản trị viên sẽ thêm chủ đề trong thời gian tới."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.TOPIC_POSTS, {
                topicId: item.id,
                topicSlug: item.slug,
              })
            }
            className="bg-white shadow-sm"
            style={{
              width: tileWidth,
              maxWidth: tileWidth,
              minHeight: 130,
              borderRadius: cardRadius,
              padding: cardPadding * 0.8,
              justifyContent: 'space-between',
              borderLeftWidth: 6,
              borderColor: item.color,
            }}
            activeOpacity={0.85}
          >
            <Text
              className="uppercase tracking-wider text-slate-400"
              style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
            >
              Chủ đề
            </Text>
            <Text
              className="font-semibold text-slate-900"
              style={{ fontSize: responsiveFontSize(18) }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: listContentPaddingBottom, gap: tileGap }}
      />
    </View>
  );
}
