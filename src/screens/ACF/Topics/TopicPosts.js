import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { ROUTES } from '../../../utils/constants';

export default function TopicPosts() {
  const route = useRoute();
  const navigation = useNavigation();
  const { topicId, highlightedPostId } = route.params ?? {};
  const { listQuery } = usePosts();

  const posts = useMemo(() => {
    if (!listQuery.data) return [];
    return topicId
      ? listQuery.data.filter((post) => post.topicId === topicId)
      : listQuery.data;
  }, [listQuery.data, topicId]);

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải bài viết theo chủ đề..." />;
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="mb-2 text-xs uppercase text-red-600">
        Chủ đề cộng đồng
      </Text>
      <Text className="text-3xl font-bold text-slate-900">
        {topicId ?? 'Tất cả chủ đề'}
      </Text>
      <Text className="mt-2 mb-6 text-sm text-slate-500">
        Đây là nơi tổng hợp các bài viết thuộc chủ đề bạn đã chọn.
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có bài viết"
            description="Hãy là người đầu tiên tạo bài viết mới cho chủ đề này."
          />
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate(ROUTES.STACK.POST_DETAIL, { postId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
        initialScrollIndex={(() => {
          if (!highlightedPostId) return undefined;
          const index = posts.findIndex(
            (post) => post.id === highlightedPostId,
          );
          return index > 0 ? index : undefined;
        })()}
        getItemLayout={(data, index) => ({
          length: 260,
          offset: 260 * index,
          index,
        })}
      />
    </View>
  );
}

