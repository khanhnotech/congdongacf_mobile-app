import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useLegal } from '../../../hooks/useLegal';
import { formatDate } from '../../../utils/format';
import { ROUTES } from '../../../utils/constants';

export default function LegalList() {
  const navigation = useNavigation();
  const { listQuery } = useLegal();

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải tài liệu pháp lý..." />;
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="mb-4 text-3xl font-bold text-slate-900">Tài liệu pháp lý</Text>
      <Text className="mb-6 text-sm text-slate-500">
        Tổng hợp các quy định, hướng dẫn quan trọng dành cho thành viên cộng đồng.
      </Text>

      <FlatList
        data={listQuery.data ?? []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có tài liệu"
            description="Các tài liệu sẽ được cập nhật bởi ban pháp chế."
          />
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.LEGAL_DETAIL, {
                documentId: item.id,
              })
            }
            className="rounded-3xl bg-white p-5 shadow-sm"
            activeOpacity={0.85}
          >
            <Text className="text-xs uppercase tracking-wider text-slate-400">
              Cập nhật {formatDate(item.publishedAt)}
            </Text>
            <Text className="mt-1 text-xl font-semibold text-slate-900">
              {item.title}
            </Text>
            <Text className="mt-2 text-sm leading-5 text-slate-500">
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
      />
    </View>
  );
}
