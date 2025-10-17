import { useRoute } from '@react-navigation/native';
import { Image, ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useMedia } from '../../../hooks/useMedia';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';

export default function MediaViewer() {
  const route = useRoute();
  const { mediaId } = route.params ?? {};
  const { detailQuery } = useMedia(mediaId);
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

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang mở media..." />;
  }

  const media = detailQuery.data;

  if (!media) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Media đã bị xoá hoặc không tồn tại.
        </Text>
      </View>
    );
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
      <Text
        className="uppercase text-red-600"
        style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
      >
        Media
      </Text>
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        {media.title}
      </Text>
      <Text
        className="text-slate-500"
        style={{ marginTop: gapSmall, fontSize: responsiveFontSize(14) }}
      >
        Loại nội dung: {media.type.toUpperCase()}
      </Text>

      {media.type === 'image' ? (
        <Image
          source={{ uri: media.url }}
          style={{
            marginTop: gapMedium,
            width: '100%',
            height: Math.max(280, cardRadius * 9),
            borderRadius: cardRadius,
          }}
        />
      ) : (
        <View
          className="items-center justify-center bg-slate-900"
          style={{
            marginTop: gapMedium,
            borderRadius: cardRadius,
            padding: cardPadding,
          }}
        >
          <Text
            className="text-center text-white"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Video demo: tích hợp trình phát video (Expo AV) tại đây.
          </Text>
        </View>
      )}

      <Text
        className="text-slate-500"
        style={{
          marginTop: gapMedium,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Thêm mô tả chi tiết cho media tại đây. Bạn có thể bổ sung các thẻ liên quan, mô tả sự kiện hoặc liên kết đến bài viết liên quan.
      </Text>
    </ScrollView>
  );
}
