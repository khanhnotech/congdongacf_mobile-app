import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function TopicPosts() {
  const route = useRoute();
  const navigation = useNavigation();
  const { topicId, highlightedPostId } = route.params ?? {};
  const { listQuery } = usePosts();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    responsiveFontSize,
    listContentPaddingBottom,
    responsiveSpacing,
  } = useResponsiveSpacing();
  const itemLength = responsiveSpacing(280, { min: 240, max: 340 });

  const posts = useMemo(() => {
    const allPosts = listQuery.data?.items ?? [];
    return topicId ? allPosts.filter((post) => post.topicId === topicId) : allPosts;
  }, [listQuery.data, topicId]);

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải bài viết theo chủ đề..." />;
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
        className="uppercase text-red-600"
        style={{ marginBottom: gapSmall / 1.5, fontSize: responsiveFontSize(12, { min: 11 }) }}
      >
        Chủ đề cộng đồng
      </Text>
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        {topicId ?? 'Tất cả chủ đề'}
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
        ItemSeparatorComponent={() => <View style={{ height: gapMedium }} />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate(ROUTES.STACK.POST_DETAIL, { postId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}
        initialScrollIndex={(() => {
          if (!highlightedPostId) return undefined;
          const index = posts.findIndex(
            (post) => post.id === highlightedPostId,
          );
          return index > 0 ? index : undefined;
        })()}
        getItemLayout={(data, index) => ({
          length: itemLength,
          offset: itemLength * index,
          index,
        })}
      />
    </View>
  );
}

