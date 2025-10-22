import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { topicsService } from '../../../services/topics.service';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';

export default function TopicPosts() {
  const route = useRoute();
  const { topicId, topicSlug, highlightedPostId } = route.params ?? {};
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

  // Sử dụng API endpoint /topic/slug để lấy topic + articles
  const topicQuery = useQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => topicsService.getTopicBySlug(topicSlug),
    enabled: !!topicSlug,
  });

  const {
    data: topicData,
    isLoading: topicLoading,
    isRefetching,
    refetch,
  } = topicQuery;

  const topic = topicData?.topic;
  const posts = topicData?.articles ?? [];

  // Refresh data when screen comes into focus (e.g., returning from PostDetail)
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we have data and it's not already loading
      if (posts.length > 0 && !topicLoading) {
        refetch();
      }
    }, [posts.length, topicLoading, refetch])
  );

  const renderFooter = useMemo(() => {
    return null; // Không cần pagination cho topic posts
  }, []);

  if (topicLoading) {
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
        {topic?.name ?? 'Chủ đề'}
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
        renderItem={({ item }) => <PostCard post={item} />}
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
        refreshing={isRefetching && !topicLoading}
        onRefresh={refetch}
      />
    </View>
  );
}
