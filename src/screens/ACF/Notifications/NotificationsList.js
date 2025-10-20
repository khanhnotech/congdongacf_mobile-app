import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../../../hooks/useEvents';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';
import { formatDateTime, truncate } from '../../../utils/format';

export default function NotificationsList() {
  const navigation = useNavigation();
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

  const {
    listQuery: {
      data,
      isLoading,
      isError,
      error,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      isRefetching,
      refetch,
    },
  } = useEvents(null, { pageSize: 20 });

  const notifications = useMemo(
    () => (Array.isArray(data?.items) ? data.items : []),
    [data],
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenDetail = useCallback(
    (item) => {
      const id = item?.eventId ?? item?.id;
      if (!id) return;
      navigation.navigate(ROUTES.STACK.EVENT_DETAIL, { eventId: id });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderNotificationItem = useCallback(
    ({ item }) => {
      const timestamp =
        item.startAt ??
        item.endAt ??
        item.raw?.start_at ??
        item.raw?.createdAt ??
        item.raw?.created_at ??
        null;
      const description =
        item.summary ??
        item.description ??
        item.raw?.summary ??
        item.raw?.description ??
        '';

      return (
        <TouchableOpacity
          className="bg-white shadow-sm"
          style={{
            borderRadius: cardRadius,
            padding: cardPadding,
          }}
          activeOpacity={0.85}
          onPress={() => handleOpenDetail(item)}
        >
          <Text
            className="uppercase tracking-wider text-red-600"
            style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
          >
            Sự kiện
          </Text>
          <Text
            className="font-semibold text-slate-900"
            style={{ marginTop: gapSmall / 2, fontSize: responsiveFontSize(18) }}
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
            {truncate(description, 200)}
          </Text>
          {timestamp ? (
            <Text
              className="text-slate-400"
              style={{ marginTop: gapSmall, fontSize: responsiveFontSize(12, { min: 10 }) }}
            >
              {formatDateTime(timestamp)}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    },
    [cardPadding, cardRadius, gapSmall, handleOpenDetail, responsiveFontSize],
  );

  const isInitialLoading = isLoading && !notifications.length;
  const errorMessage =
    (error && (error.message || '')) || 'Không thể tải thông báo! Thử lại sau.';

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
        style={{ fontSize: responsiveFontSize(28) }}
      >
        Thông báo
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginTop: gapSmall,
          marginBottom: gapMedium,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Cập nhật mới nhất từ cộng đồng ACF
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: gapMedium }} />}
        renderItem={renderNotificationItem}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View
            className="items-center justify-center"
            style={{ paddingVertical: gapMedium * 2 }}
          >
            {isInitialLoading ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : isError ? (
              <Text
                className="text-center text-slate-500"
                style={{
                  fontSize: responsiveFontSize(14),
                  lineHeight: responsiveFontSize(20, { min: 18 }),
                }}
              >
                {errorMessage}
              </Text>
            ) : (
              <Text
                className="text-center text-slate-500"
                style={{
                  fontSize: responsiveFontSize(14),
                  lineHeight: responsiveFontSize(20, { min: 18 }),
                }}
              >
                Chưa có thông báo nào.
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View
              className="items-center justify-center"
              style={{ paddingVertical: gapMedium }}
            >
              <ActivityIndicator size="small" color="#DC2626" />
            </View>
          ) : null
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
