import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useLatestPosts } from '../../../hooks/useLatestPosts';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { useTogglePostLike } from '../../../hooks/useTogglePostLike';

export default function LatestPosts() {
  const { listQuery } = useLatestPosts();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    refetch,
  } = listQuery;

  const spacing = useResponsiveSpacing();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    responsiveFontSize,
    listContentPaddingBottom,
  } = spacing;

  const posts = data?.items ?? [];
  const totalPosts = data?.meta?.total ?? posts.length;
  const { toggleLike, toggleLikeStatus } = useTogglePostLike();

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleToggleLike = useCallback(
    async (targetPost) => {
      if (!targetPost) return;
      const candidateId =
        Number(
          targetPost.articleId ?? targetPost?.raw?.article_id ?? targetPost.id,
        );
      if (!Number.isFinite(candidateId)) {
        console.warn('Cannot toggle like, invalid article id', targetPost?.id);
        return;
      }
      try {
        await toggleLike(candidateId);
      } catch (error) {
        console.warn('Toggle like failed', error);
      }
    },
    [toggleLike],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        onToggleLike={handleToggleLike}
        likePending={toggleLikeStatus === 'pending'}
      />
    ),
    [handleToggleLike, toggleLikeStatus],
  );

  const renderSeparator = useCallback(
    () => <View style={{ height: gapMedium }} />,
    [gapMedium],
  );

  const renderFooter = useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: gapMedium }}>
        <ActivityIndicator size="small" color="#DC2626" />
      </View>
    );
  }, [gapMedium, isFetchingNextPage]);

  const renderEmpty = useMemo(
    () => (
      <EmptyState
        title="Chưa có bài viết mới"
        description="Khi có bài viết trong 7 ngày gần nhất, chúng sẽ xuất hiện tại đây."
      />
    ),
    [],
  );

  const listHeader = useMemo(
    () => (
      <View style={{ gap: gapSmall }}>
        <Text
          className="uppercase text-red-600"
          style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
        >
          Mới nhất
        </Text>
        <Text
          className="font-black text-slate-900"
          style={{ fontSize: responsiveFontSize(26) }}
        >
          Bài viết trong 7 ngày qua
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Tổng cộng {totalPosts} bài viết mới được cập nhật cho bạn.
        </Text>
      </View>
    ),
    [gapSmall, responsiveFontSize, totalPosts],
  );

  const isRefreshing = isRefetching && !isLoading;

  if (isLoading) {
    return <LoadingSpinner message="Đang tải bài viết mới nhất..." />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={listHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        paddingTop: verticalPadding + statusBarOffset,
        paddingHorizontal: screenPadding,
        paddingBottom: listContentPaddingBottom,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  );
}
