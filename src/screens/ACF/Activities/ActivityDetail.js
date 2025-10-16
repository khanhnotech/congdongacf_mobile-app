import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useActivities } from '../../../hooks/useActivities';
import { formatDate } from '../../../utils/format';

export default function ActivityDetail() {
  const route = useRoute();
  const { activityId } = route.params ?? {};
  const { detailQuery } = useActivities(activityId);

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải chi tiết hoạt động..." />;
  }

  const activity = detailQuery.data;

  if (!activity) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-slate-500">
          Không tìm thấy hoạt động.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14 pb-24">
      <Text className="text-xs uppercase text-red-600">
        {formatDate(activity.date)}
      </Text>
      <Text className="mt-2 text-3xl font-bold text-slate-900">
        {activity.title}
      </Text>
      <Text className="mt-4 text-base leading-6 text-slate-600">
        {activity.summary}
      </Text>
      <View className="mt-6 rounded-2xl bg-slate-100 p-4">
        <Text className="text-sm font-semibold text-slate-700">Địa điểm</Text>
        <Text className="mt-1 text-sm text-slate-500">
          {activity.location}
        </Text>
      </View>
      <View className="mt-4 rounded-2xl bg-slate-100 p-4">
        <Text className="text-sm font-semibold text-slate-700">
          Kế hoạch triển khai
        </Text>
        <Text className="mt-2 text-sm leading-5 text-slate-500">
          Mô tả chi tiết sẽ được cập nhật bởi quản trị viên. Đây là vị trí để mô
          tả timeline, nhân sự, ngân sách...
        </Text>
      </View>
    </ScrollView>
  );
}

