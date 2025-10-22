import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../hooks/useEvents';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';
import { ROUTES } from '../utils/constants';

export default function EventsTicker() {
  const navigation = useNavigation();
  const spacing = useResponsiveSpacing();
  const { gapMedium, chipPaddingHorizontal, chipPaddingVertical, responsiveFontSize } = spacing;

  // Get latest 10 events
  const { listQuery: eventsQuery } = useEvents(null, { 
    pageSize: 10,
    filters: { sort: 'created_at', order: 'desc' }
  });

  const events = eventsQuery.data?.items ?? [];
  const isLoading = eventsQuery.isLoading;

  const handleEventPress = useCallback((event) => {
    navigation.navigate(ROUTES.STACK.EVENT_DETAIL, {
      eventId: event.eventId || event.id,
    });
  }, [navigation]);

  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  // Create ticker messages for all events
  const tickerMessages = useMemo(() => {
    if (!events.length) return [];
    return events.map(event => ({
      id: event.id,
      text: `Sự kiện: ${event.title}`,
      date: event.startAt ? formatEventDate(event.startAt) : null,
      event: event,
    }));
  }, [events]);

  // Render ticker content with all events
  const renderTickerContent = useCallback((shouldMeasure = false) => {
    if (isLoading) {
      return (
        <View
          className="flex-row items-center"
          style={{ paddingRight: gapMedium * 2 }}
          onLayout={shouldMeasure ? (event) => {
            // Pass the layout event to parent for width measurement
            if (event.nativeEvent.layout.width) {
              // This will be handled by MainTabs.js
            }
          } : undefined}
        >
          <MaterialCommunityIcons name="bullhorn" size={responsiveFontSize(16)} color="#991B1B" />
          <Text className="font-semibold text-red-700" style={{ fontSize: responsiveFontSize(13) }}>
            Đang tải sự kiện...
          </Text>
        </View>
      );
    }

    if (!tickerMessages.length) {
      return (
        <View
          className="flex-row items-center"
          style={{ paddingRight: gapMedium * 2 }}
          onLayout={shouldMeasure ? (event) => {
            // Pass the layout event to parent for width measurement
            if (event.nativeEvent.layout.width) {
              // This will be handled by MainTabs.js
            }
          } : undefined}
        >
          <MaterialCommunityIcons name="bullhorn" size={responsiveFontSize(16)} color="#991B1B" />
          <Text className="font-semibold text-red-700" style={{ fontSize: responsiveFontSize(13) }}>
            Sự kiện: Hệ thống sẽ cập nhật sớm.
          </Text>
        </View>
      );
    }

    // Render all events in sequence for ticker
    return (
      <View
        className="flex-row items-center"
        style={{ paddingRight: gapMedium * 2 }}
        onLayout={shouldMeasure ? (event) => {
          // Pass the layout event to parent for width measurement
          if (event.nativeEvent.layout.width) {
            // This will be handled by MainTabs.js
          }
        } : undefined}
      >
        <MaterialCommunityIcons name="bullhorn" size={responsiveFontSize(16)} color="#991B1B" />
        {tickerMessages.map((message, index) => (
          <TouchableOpacity
            key={message.id}
            onPress={() => handleEventPress(message.event)}
            className="flex-row items-center"
            style={{ marginRight: gapMedium * 2 }}
            activeOpacity={0.8}
          >
            <Text className="font-semibold text-red-700" style={{ fontSize: responsiveFontSize(13) }}>
              {message.text}
            </Text>
            {message.date && (
              <View className="flex-row items-center rounded-full bg-red-500 ml-2" style={{ paddingHorizontal: chipPaddingHorizontal, paddingVertical: chipPaddingVertical / 1.6 }}>
                <MaterialCommunityIcons name="calendar" size={responsiveFontSize(12)} color="#FFFFFF" />
                <Text className="font-semibold text-white ml-1" style={{ fontSize: responsiveFontSize(11) }}>
                  {message.date}
                </Text>
              </View>
            )}
            {index < tickerMessages.length - 1 && (
              <Text className="text-red-700 mx-2" style={{ fontSize: responsiveFontSize(13) }}>
                •
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [isLoading, tickerMessages, handleEventPress, gapMedium, responsiveFontSize, chipPaddingHorizontal, chipPaddingVertical]);

  return {
    renderTickerContent,
    isLoading,
    hasEvents: !!tickerMessages.length,
  };
}
