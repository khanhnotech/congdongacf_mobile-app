import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useLegal } from '../../../hooks/useLegal';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDate } from '../../../utils/format';
import { ROUTES } from '../../../utils/constants';

export default function LegalList() {
  const navigation = useNavigation();
  const { listQuery } = useLegal();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  if (listQuery.isLoading) {
    return <LoadingSpinner message="Đang tải tài liệu pháp lý..." />;
  }

  return (
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
      }}
    >
      <Text
        className="font-bold text-slate-900"
        style={{ marginBottom: gapSmall, fontSize: responsiveFontSize(28) }}
      >
        Tài liệu pháp lý
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginBottom: gapMedium,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
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
        ItemSeparatorComponent={() => <View style={{ height: gapMedium }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.STACK.LEGAL_DETAIL, {
                documentId: item.id,
              })
            }
            activeOpacity={0.85}
            className="bg-white shadow-sm"
            style={{ borderRadius: cardRadius, padding: cardPadding }}
          >
            <Text
              className="uppercase tracking-wider text-slate-400"
              style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
            >
              Cập nhật {formatDate(item.publishedAt)}
            </Text>
            <Text
              className="font-semibold text-slate-900"
              style={{ marginTop: gapSmall / 2, fontSize: responsiveFontSize(20) }}
            >
              {item.title}
            </Text>
            <Text
              className="text-slate-500"
              style={{
                marginTop: gapSmall,
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20, { min: 18 }),
              }}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}
      />
    </View>
  );
}
