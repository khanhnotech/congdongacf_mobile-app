import { Text, View } from 'react-native';

export default function EmptyState({
  title = 'Chưa có nội dung',
  description = 'Hãy quay lại sau hoặc tạo mới.',
  action,
}) {
  return (
    <View className="w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-10 shadow-sm">
      <Text className="text-lg font-semibold text-slate-700">{title}</Text>
      <Text className="text-center text-sm leading-5 text-slate-500">
        {description}
      </Text>
      {action}
    </View>
  );
}
