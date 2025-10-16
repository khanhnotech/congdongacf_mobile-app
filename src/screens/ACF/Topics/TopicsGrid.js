import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useTopics } from '../../../hooks/useTopics';
import { ROUTES } from '../../../utils/constants';

export default function TopicsGrid() {
  const navigation = useNavigation();
  const { listQuery } = useTopics();

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải chủ đề..." />;
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="mb-4 text-3xl font-bold text-slate-900">
        Chủ đề cộng đồng
      </Text>
      <Text className="mb-6 text-sm text-slate-500">
        Lựa chọn chủ đề để xem các bài viết, media và hoạt động liên quan.
      </Text>

      <FlatList
        data={listQuery.data ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có chủ đề"
            description="Quản trị viên sẽ thêm chủ đề trong thời gian tới."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.TOPIC_POSTS, {
                topicId: item.id,
              })
            }
            className="h-32 w-[48%] items-start justify-between rounded-3xl bg-white p-4 shadow-sm"
            style={{ borderLeftWidth: 6, borderColor: item.color }}
            activeOpacity={0.85}
          >
            <Text className="text-xs uppercase tracking-wider text-slate-400">
              Chủ đề
            </Text>
            <Text className="text-lg font-semibold text-slate-900">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
      />
    </View>
  );
}
