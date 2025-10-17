import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useMedia } from '../../../hooks/useMedia';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function MediaList() {
  const navigation = useNavigation();
  const { listQuery } = useMedia();
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
    140,
    Math.floor((width - screenPadding * 2 - tileGap) / 2),
  );

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải thư viện media..." />;
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
        Thư viện media
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginBottom: gapMedium,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Tổng hợp hình ảnh và video từ cộng đồng ACF.
      </Text>

      <FlatList
        data={listQuery.data ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: tileGap, marginBottom: tileGap }}
        ListEmptyComponent={
          <EmptyState
            title="Media trống"
            description="Bạn có thể tải lên hình ảnh/video đầu tiên."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.MEDIA_VIEWER, {
                mediaId: item.id,
              })
            }
            activeOpacity={0.85}
            className="bg-white shadow-sm"
            style={{
              width: tileWidth,
              maxWidth: tileWidth,
              borderRadius: cardRadius,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: item.thumbnail ?? item.url }}
              style={{
                width: '100%',
                height: Math.max(140, cardRadius * 5),
              }}
            />
            <View style={{ padding: cardPadding * 0.6, gap: gapSmall / 2 }}>
              <Text
                className="font-medium text-slate-800"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                {item.title}
              </Text>
              <Text
                className="uppercase text-slate-400"
                style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
              >
                {item.type}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingBottom: listContentPaddingBottom,
          gap: tileGap,
        }}
      />
    </View>
  );
}
