import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useEvents } from '../../../hooks/useEvents';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDateTime, truncate } from '../../../utils/format';

const formatSchedule = (startAt, endAt) => {
  if (startAt && endAt) {
    return `${formatDateTime(startAt)} - ${formatDateTime(endAt)}`;
  }
  if (startAt) return formatDateTime(startAt);
  if (endAt) return formatDateTime(endAt);
  return '';
};

export default function EventDetail() {
  const route = useRoute();
  const { eventId } = route.params ?? {};
  const { detailQuery } = useEvents(eventId);
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

  if (!eventId) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(14) }}>
          Không tìm thấy sự kiện nào
        </Text>
      </View>
    );
  }

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải chi tiết sự kiện..." />;
  }

  if (detailQuery.isError) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(14) }}>
          Không thể tải dữ liệu sự kiện. Thử lại sau.
        </Text>
      </View>
    );
  }

  const event = detailQuery.data;

  if (!event) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(14) }}>
          Không tìm thấy sự kiện
        </Text>
      </View>
    );
  }

  const schedule = formatSchedule(event.startAt, event.endAt);
  const summary = event.summary ? truncate(event.summary, 260) : '';
  const description = event.description ?? '';

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
      {schedule ? (
        <Text
          className="uppercase text-red-600"
          style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
        >
          {schedule}
        </Text>
      ) : null}
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        {event.title}
      </Text>
      {summary ? (
        <Text
          className="text-slate-600"
          style={{
            fontSize: responsiveFontSize(15),
            lineHeight: responsiveFontSize(22, { min: 20 }),
            marginTop: gapSmall,
          }}
        >
          {summary}
        </Text>
      ) : null}
      {event.location ? (
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
            Dia diem
          </Text>
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            {event.location}
          </Text>
        </View>
      ) : null}
      {description ? (
        <View
          className="bg-slate-50"
          style={{
            borderRadius: cardRadius,
            padding: cardPadding,
            gap: gapSmall,
          }}
        >
          <Text
            className="font-semibold text-slate-700"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Nội dung
          </Text>
          <Text
            className="text-slate-600"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(20, { min: 18 }),
            }}
          >
            {description}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
