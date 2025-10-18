import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
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

  const {
    data: postsData,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = listQuery;

  const posts = useMemo(() => {
    const allPosts = postsData?.items ?? [];
    return topicId ? allPosts.filter((post) => post.topicId === topicId) : allPosts;
  }, [postsData, topicId]);

  if (postsLoading) {
    return <LoadingSpinner message="Đang tải bài viết theo chủ đề..." />;
  }

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderFooter = useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ marginTop: gapMedium }}>
        <ActivityIndicator size="small" color="#DC2626" />
      </View>
    );
  }, [gapMedium, isFetchingNextPage]);

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
        ListFooterComponent={renderFooter}
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
          const index = posts.findIndex((post) => post.id === highlightedPostId);
          return index > 0 ? index : undefined;
        })()}
        getItemLayout={(data, index) => ({
          length: itemLength,
          offset: itemLength * index,
          index,
        })}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching && !postsLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

