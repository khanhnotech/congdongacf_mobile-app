import { ActivityIndicator, Text, View } from 'react-native';

export default function LoadingSpinner({ message = 'Đang tải dữ liệu...' }) {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-white p-6">
      <ActivityIndicator size="large" color="#0D9488" />
      <Text className="text-sm text-slate-500">{message}</Text>
    </View>
  );
}
