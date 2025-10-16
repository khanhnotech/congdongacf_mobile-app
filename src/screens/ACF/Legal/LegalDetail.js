import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLegal } from '../../../hooks/useLegal';
import { formatDate } from '../../../utils/format';

export default function LegalDetail() {
  const route = useRoute();
  const { documentId } = route.params ?? {};
  const { detailQuery } = useLegal(documentId);

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải tài liệu..." />;
  }

  const document = detailQuery.data;

  if (!document) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-slate-500">
          Không tìm thấy tài liệu.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14 pb-24">
      <Text className="text-xs uppercase text-slate-400">
        Cập nhật {formatDate(document.publishedAt)}
      </Text>
      <Text className="mt-2 text-3xl font-bold text-slate-900">
        {document.title}
      </Text>
      <Text className="mt-4 text-base leading-6 text-slate-600">
        {document.description}
      </Text>
      <View className="mt-6 h-[1px] bg-slate-200" />
      <Text className="mt-6 text-sm leading-6 text-slate-500">
        Đây là nội dung mô phỏng cho tài liệu pháp lý. Bạn có thể đặt nội dung
        Markdown hoặc HTML được render tuỳ theo nhu cầu. Để thêm cấu trúc chi
        tiết, hãy tích hợp trình đọc tài liệu hoặc webview vào màn hình này.
      </Text>
    </ScrollView>
  );
}
