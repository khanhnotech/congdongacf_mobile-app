import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { usePosts } from '../../hooks/usePosts';
import { formatDateTime } from '../../utils/format';

export default function PostDetail() {
  const route = useRoute();
  const { postId } = route.params ?? {};
  const { detailQuery } = usePosts(postId);

  if (!postId) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-base text-slate-500">
          Bài viết không tồn tại hoặc đã bị xoá.
        </Text>
      </View>
    );
  }

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải bài viết..." />;
  }

  if (!detailQuery.data) {
    return (
      <View className="flex-1 bg-white px-6 pt-14">
        <EmptyState
          title="Không tìm thấy bài viết"
          description="Có thể bài viết đã bị gỡ hoặc liên kết không chính xác."
        />
      </View>
    );
  }

  const post = detailQuery.data;
  const initials =
    post.author
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AC';

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14 pb-24">
      <View className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-200">
            <Text className="text-base font-semibold text-slate-700">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-red-600">{post.author}</Text>
            <Text className="text-xs text-slate-400">{formatDateTime(post.createdAt)}</Text>
          </View>
        </View>

        <Text className="mt-4 text-2xl font-bold text-slate-900">{post.title}</Text>
        <Text className="mt-3 text-sm leading-6 text-slate-600">
          {post.excerpt}
        </Text>

        {post.cover ? (
          <View className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
            <Image source={{ uri: post.cover }} className="h-56 w-full" />
          </View>
        ) : null}

        <View className="mt-6 gap-3">
          <Text className="text-base font-semibold text-slate-900">
            Nội dung chi tiết
          </Text>
          <Text className="text-sm leading-7 text-slate-600">
            Nội dung chi tiết của bài viết sẽ được hiển thị tại đây. Bạn có thể
            mở rộng dữ liệu từ API thực tế để trình bày đầy đủ văn bản, hình ảnh
            hoặc tài liệu đính kèm.
          </Text>
        </View>

        <View className="mt-8 flex-row items-center gap-3">
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3"
          >
            <MaterialCommunityIcons name="heart-outline" size={20} color="#DC2626" />
            <Text className="text-sm font-semibold text-red-600">Thích</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3"
          >
            <MaterialCommunityIcons name="comment-outline" size={20} color="#DC2626" />
            <Text className="text-sm font-semibold text-red-600">Bình luận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className="ml-auto flex-row items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3"
          >
            <MaterialCommunityIcons name="share-variant" size={20} color="#DC2626" />
            <Text className="text-sm font-semibold text-red-600">Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
