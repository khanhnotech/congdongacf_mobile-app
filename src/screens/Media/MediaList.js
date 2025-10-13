import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { useMedia } from '../../hooks/useMedia';
import { ROUTES } from '../../utils/constants';

export default function MediaList() {
  const navigation = useNavigation();
  const { listQuery } = useMedia();

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải thư viện media..." />;
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="mb-4 text-3xl font-bold text-slate-900">
        Thư viện media
      </Text>
      <Text className="mb-6 text-sm text-slate-500">
        Tổng hợp hình ảnh và video từ cộng đồng ACF.
      </Text>

      <FlatList
        data={listQuery.data ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        ListEmptyComponent={
          <EmptyState
            title="Media trống"
            description="Bạn có thể tải lên hình ảnh/video đầu tiên."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.MEDIA_VIEWER, {
                mediaId: item.id,
              })
            }
            className="w-[48%] overflow-hidden rounded-3xl bg-white shadow-sm"
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.thumbnail ?? item.url }}
              className="h-32 w-full"
            />
            <View className="p-3">
              <Text className="text-sm font-medium text-slate-800">
                {item.title}
              </Text>
              <Text className="mt-1 text-xs uppercase text-slate-400">
                {item.type}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
      />
    </View>
  );
}
