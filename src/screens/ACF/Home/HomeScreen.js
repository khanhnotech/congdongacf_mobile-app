import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopicChip from '../../../components/TopicChip';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { useTopics } from '../../../hooks/useTopics';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function HomeScreen() {
  const navigation = useNavigation();
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

  if (postsQuery.isLoading || topicsQuery.isLoading) {
    return <LoadingSpinner message="Đang tải nội dung trang chủ..." />;
  }

  const filteredPosts =
    activeTopic && postsQuery.data
      ? postsQuery.data.filter((post) => post.topicId === activeTopic)
      : postsQuery.data ?? [];

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
        gap: gapLarge,
      }}
      showsVerticalScrollIndicator={false}
    >
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
          <Text
            className="uppercase tracking-wider text-red-600"
            style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
          >
            Xem tất cả
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
          {(topicsQuery.data ?? []).map((topic) => (
            <TopicChip
              key={topic.id}
              label={topic.name}
              color={topic.color}
              active={activeTopic === topic.id}
              onPress={() => {
                setActiveTopic(activeTopic === topic.id ? null : topic.id);
              }}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: gapSmall }}>
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
          <Text
            className="uppercase tracking-wider text-slate-400"
            style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
          >
            {filteredPosts.length} bài
          </Text>
        </View>

        {filteredPosts.length === 0 ? (
          <EmptyState
            title="Chưa có bài viết"
            description="Khi cộng đồng đăng bài, chúng sẽ xuất hiện tại đây."
          />
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() =>
                navigation.navigate(ROUTES.STACK.POST_DETAIL, { postId: post.id })
              }
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

