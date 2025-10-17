import { Text, View } from 'react-native';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';

export default function EmptyState({
  title = 'Chưa có nội dung',
  description = 'Hãy quay lại sau hoặc tạo mới.',
  action,
}) {
  const {
    cardPadding,
    cardRadius,
    responsiveFontSize,
    gapSmall,
    gapMedium,
  } = useResponsiveSpacing();

  return (
    <View
      className="w-full items-center justify-center bg-white shadow-sm"
      style={{
        padding: cardPadding,
        borderRadius: cardRadius,
        gap: gapSmall,
      }}
    >
      <Text
        className="font-semibold text-slate-700"
        style={{ fontSize: responsiveFontSize(18) }}
      >
        {title}
      </Text>
      <Text
        className="text-center text-slate-500"
        style={{
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
          marginBottom: gapMedium > gapSmall ? gapSmall : 0,
        }}
      >
        {description}
      </Text>
      {action}
    </View>
  );
}
