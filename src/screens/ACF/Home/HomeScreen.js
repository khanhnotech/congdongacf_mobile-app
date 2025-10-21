import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import TopicChip from '../../../components/TopicChip';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { useTopics } from '../../../hooks/useTopics';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { useTogglePostLike } from '../../../hooks/useTogglePostLike';

export default function HomeScreen() {
  const { listQuery: postsQuery } = usePosts();
  const { listQuery: topicsQuery } = useTopics();
  const [activeTopic, setActiveTopic] = useState(null);
  const spacing = useResponsiveSpacing();
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
  } = spacing;
  const gapLarge = spacing.gapLarge ?? gapMedium + 6;

  const {
    data: postsData,
    isLoading: postsLoading,
    isRefetching: postsRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchPosts,
  } = postsQuery;

  const allPosts = postsData?.items ?? [];
  const filteredPosts = useMemo(() => {
    if (!activeTopic) return allPosts;
    return allPosts.filter((post) => post.topicId === activeTopic);
  }, [activeTopic, allPosts]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(() => {
    refetchPosts();
  }, [refetchPosts]);

  const isRefreshing = postsRefetching && !postsLoading;
  const { toggleLike, toggleLikeStatus } = useTogglePostLike();

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

  const listHeader = useMemo(
    () => (
      <View style={{ gap: gapLarge }}>
        <View
          className="bg-red-500 shadow"
          style={{
            padding: cardPadding,
            borderRadius: cardRadius,
            minHeight: heroHeight,
            justifyContent: 'center',
            gap: gapSmall,
          }}
        >
          <Text
            className="uppercase tracking-wider text-white/80"
            style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
          >
            Cộng đồng ACF
          </Text>
          <Text
            className="font-black text-white"
            style={{
              fontSize: responsiveFontSize(26, { min: 22, max: 30 }),
              lineHeight: responsiveFontSize(32, { min: 28, max: 36 }),
            }}
          >
            Hệ thống phòng chống hàng giả Bảo vệ người tiêu dùng Việt Nam
          </Text>
          <Text
            className="text-white/80"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(20, { min: 18 }),
            }}
          >
            Khám phá hoạt động, chủ đề và media nổi bật trong tuần này.
          </Text>
        </View>

        {/* Topic Filter Section */}
        <View style={{ gap: gapSmall }}>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: gapSmall }}
          >
            <Text
              className="font-semibold text-slate-900"
              style={{ fontSize: responsiveFontSize(18) }}
            >
              Chủ đề nổi bật
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: screenPadding - cardPadding }}
          >
            <TopicChip
              label="Tất cả"
              active={activeTopic === null}
              onPress={() => setActiveTopic(null)}
            />
            {(topicsQuery.data?.items ?? [])
              .sort((a, b) => (b.article_count || 0) - (a.article_count || 0))
              .map((topic) => (
                <TopicChip
                  key={topic.id}
                  label={`${topic.name} (${topic.article_count || 0})`}
                  color={topic.color}
                  active={activeTopic === topic.id}
                  onPress={() => {
                    setActiveTopic(activeTopic === topic.id ? null : topic.id);
                  }}
                />
              ))}
          </ScrollView>
        </View>

        <View
          className="flex-row items-center justify-between"
          style={{ marginBottom: gapSmall }}
        >
          <Text
            className="font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(18) }}
          >
            Bài viết mới nhất
          </Text>
        </View>
      </View>
    ),
    [
      activeTopic,
      cardPadding,
      cardRadius,
      gapLarge,
      gapSmall,
      heroHeight,
      filteredPosts.length,
      responsiveFontSize,
      screenPadding,
      topicsQuery.data,
    ],
  );

  const renderPostItem = useCallback(
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
    () => <View style={{ height: gapSmall }} />,
    [gapSmall],
  );

  const renderFooter = useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: gapMedium }}>
        <ActivityIndicator size="small" color="#DC2626" />
      </View>
    );
  }, [gapMedium, isFetchingNextPage]);

  const renderEmptyState = useCallback(
    () => (
      <View style={{ marginTop: gapSmall }}>
        <EmptyState
          title="Chưa có bài viết"
          description="Khi cộng đồng đăng bài, chúng sẽ xuất hiện tại đây."
        />
      </View>
    ),
    [gapSmall],
  );

  if (postsLoading || topicsQuery.isLoading) {
    return <LoadingSpinner message="Đang tải nội dung trang chủ..." />;
  }

  return (
    <FlatList
      data={filteredPosts}
      keyExtractor={(item) => item.id}
      renderItem={renderPostItem}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={listHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        paddingTop: verticalPadding + statusBarOffset,
        paddingHorizontal: screenPadding,
        paddingBottom: listContentPaddingBottom,
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.6}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  );
}
