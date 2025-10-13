import { useRoute } from '@react-navigation/native';
import { Image, ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useMedia } from '../../hooks/useMedia';

export default function MediaViewer() {
  const route = useRoute();
  const { mediaId } = route.params ?? {};
  const { detailQuery } = useMedia(mediaId);

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang mở media..." />;
  }

  const media = detailQuery.data;

  if (!media) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-slate-500">
          Media đã bị xoá hoặc không tồn tại.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14 pb-24">
      <Text className="text-xs uppercase text-emerald-600">Media</Text>
      <Text className="mt-2 text-3xl font-bold text-slate-900">
        {media.title}
      </Text>
      <Text className="mt-4 text-sm text-slate-500">
        Loại nội dung: {media.type.toUpperCase()}
      </Text>

      {media.type === 'image' ? (
        <Image
          source={{ uri: media.url }}
          className="mt-6 h-80 w-full rounded-3xl"
        />
      ) : (
        <View className="mt-6 items-center justify-center rounded-3xl bg-slate-900 p-10">
          <Text className="text-center text-sm text-white">
            Video demo: tích hợp trình phát video (Expo AV) tại đây.
          </Text>
        </View>
      )}

      <Text className="mt-6 text-sm leading-6 text-slate-500">
        Thêm mô tả chi tiết cho media tại đây. Bạn có thể bổ sung các thẻ liên
        quan, mô tả sự kiện hoặc liên kết đến bài viết liên quan.
      </Text>
    </ScrollView>
  );
}
