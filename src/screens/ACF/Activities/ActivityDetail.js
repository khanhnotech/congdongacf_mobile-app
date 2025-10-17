import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useActivities } from '../../../hooks/useActivities';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDate } from '../../../utils/format';

export default function ActivityDetail() {
  const route = useRoute();
  const { activityId } = route.params ?? {};
  const { detailQuery } = useActivities(activityId);
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

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải chi tiết hoạt động..." />;
  }

  const activity = detailQuery.data;

  if (!activity) {
    return (
      <View className="flex-1 items-center justify-center bg-white" style={{ padding: cardPadding }}>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Không tìm thấy hoạt động.
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
        className="uppercase text-red-600"
        style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
      >
        {formatDate(activity.date)}
      </Text>
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        {activity.title}
      </Text>
      <Text
        className="text-slate-600"
        style={{
          fontSize: responsiveFontSize(15),
          lineHeight: responsiveFontSize(22, { min: 20 }),
          marginTop: gapSmall,
        }}
      >
        {activity.summary}
      </Text>
      <View
        className="bg-slate-100"
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall / 1.3,
        }}
      >
        <Text
          className="font-semibold text-slate-700"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Địa điểm
        </Text>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          {activity.location}
        </Text>
      </View>
      <View
        className="bg-slate-100"
        style={{
          marginTop: gapSmall,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-700"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Kế hoạch triển khai
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Mô tả chi tiết sẽ được cập nhật bởi quản trị viên. Đây là vị trí để mô tả timeline,
          nhân sự, ngân sách...
        </Text>
      </View>
    </ScrollView>
  );
}

