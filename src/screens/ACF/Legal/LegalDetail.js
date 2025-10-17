import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLegal } from '../../../hooks/useLegal';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDate } from '../../../utils/format';

export default function LegalDetail() {
  const route = useRoute();
  const { documentId } = route.params ?? {};
  const { detailQuery } = useLegal(documentId);
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải tài liệu..." />;
  }

  const document = detailQuery.data;

  if (!document) {
    return (
      <View className="flex-1 items-center justify-center bg-white" style={{ padding: cardPadding }}>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Không tìm thấy tài liệu.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        className="uppercase text-slate-400"
        style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
      >
        Cập nhật {formatDate(document.publishedAt)}
      </Text>
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        {document.title}
      </Text>
      <Text
        className="text-slate-600"
        style={{
          fontSize: responsiveFontSize(15),
          lineHeight: responsiveFontSize(22, { min: 20 }),
          marginTop: gapSmall,
        }}
      >
        {document.description}
      </Text>
      <View
        className="bg-slate-200"
        style={{ height: 1, marginTop: gapMedium }}
      />
      <Text
        className="text-slate-500"
        style={{
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
          marginTop: gapMedium,
        }}
      >
        Đây là nội dung mô phỏng cho tài liệu pháp lý. Bạn có thể đặt nội dung Markdown hoặc HTML được render tuỳ theo
        nhu cầu. Để thêm cấu trúc chi tiết, hãy tích hợp trình đọc tài liệu hoặc webview vào màn hình này.
      </Text>
    </ScrollView>
  );
}
