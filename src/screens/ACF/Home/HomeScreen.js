import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopicChip from '../../../components/TopicChip';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { useTopics } from '../../../hooks/useTopics';
import { ROUTES } from '../../../utils/constants';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { listQuery: postsQuery } = usePosts();
  const { listQuery: topicsQuery } = useTopics();
  const [activeTopic, setActiveTopic] = useState(null);

  if (postsQuery.isLoading || topicsQuery.isLoading) {
    return <LoadingSpinner message="Đang tải nội dung trang chủ..." />;
  }

  const filteredPosts =
    activeTopic && postsQuery.data
      ? postsQuery.data.filter((post) => post.topicId === activeTopic)
      : postsQuery.data ?? [];

  return (
    <ScrollView className="flex-1 bg-slate-100">
      <View className="gap-6 px-6 pt-14 pb-24">
        <View className="rounded-3xl bg-red-500 p-6 shadow">
          <Text className="text-xs uppercase tracking-wider text-white/80">
            Cộng đồng ACF
          </Text>
          <Text className="mt-2 text-3xl font-black text-white">
            Hệ thống phòng chống hàng giả Bảo vệ người tiêu dùng Việt Nam
          </Text>
          <Text className="mt-3 text-sm text-white/80">
            Khám phá hoạt động, chủ đề và media nổi bật trong tuần này.
          </Text>
        </View>

        <View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-slate-900">
              Chủ đề nổi bật
            </Text>
            <Text className="text-xs uppercase tracking-wider text-red-600">
              Xem tất cả
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  setActiveTopic(
                    activeTopic === topic.id ? null : topic.id,
                  );
                }}
              />
            ))}
          </ScrollView>
        </View>

        <View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-slate-900">
              Bài viết mới nhất
            </Text>
            <Text className="text-xs uppercase tracking-wider text-slate-400">
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
      </View>
    </ScrollView>
  );
}

