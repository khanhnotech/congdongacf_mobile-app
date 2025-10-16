import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useActivities } from '../../../hooks/useActivities';
import { formatDate } from '../../../utils/format';
import { ROUTES } from '../../../utils/constants';

export default function ActivitiesList() {
  const navigation = useNavigation();
  const { listQuery } = useActivities();

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải hoạt động..." />;
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="mb-4 text-3xl font-bold text-slate-900">
        Hoạt động cộng đồng
      </Text>
      <Text className="mb-6 text-sm text-slate-500">
        Danh sách các sự kiện đang và sắp diễn ra. Chọn hoạt động để xem chi
        tiết.
      </Text>

      <FlatList
        data={listQuery.data ?? []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState title="Chưa có hoạt động" description="Các hoạt động sẽ được cập nhật liên tục." />
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.ACTIVITY_DETAIL, {
                activityId: item.id,
              })
            }
            activeOpacity={0.85}
            className="rounded-3xl bg-white p-5 shadow-sm"
          >
            <Text className="text-sm uppercase tracking-wider text-red-600">
              {formatDate(item.date)}
            </Text>
            <Text className="mt-1 text-xl font-semibold text-slate-900">
              {item.title}
            </Text>
            <Text className="mt-2 text-sm text-slate-500">{item.summary}</Text>
            <Text className="mt-3 text-xs font-medium uppercase text-slate-400">
              {item.location}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
      />
    </View>
  );
}

