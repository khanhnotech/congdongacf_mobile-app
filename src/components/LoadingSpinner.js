import { ActivityIndicator, Text, View } from 'react-native';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';

export default function LoadingSpinner({ message = 'Đang tải dữ liệu...' }) {
  const {
    gapSmall,
    cardPadding,
    responsiveFontSize,
  } = useResponsiveSpacing();

  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ gap: gapSmall, padding: cardPadding }}
    >
      <ActivityIndicator size="large" color="#DC2626" />
      <Text
        className="text-slate-500"
        style={{ fontSize: responsiveFontSize(14) }}
      >
        {message}
      </Text>
    </View>
  );
}
