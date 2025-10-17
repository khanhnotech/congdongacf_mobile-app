import { Text, TouchableOpacity } from 'react-native';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';

export default function TopicChip({
  label,
  active = false,
  onPress,
  color = '#DC2626',
}) {
  const {
    chipPaddingHorizontal,
    chipPaddingVertical,
    responsiveFontSize,
    gapSmall,
  } = useResponsiveSpacing();

  return (
    <TouchableOpacity
      className={`rounded-full border ${
        active ? 'bg-red-500 border-red-500' : 'border-slate-200 bg-white'
      }`}
      style={{
        paddingHorizontal: chipPaddingHorizontal,
        paddingVertical: chipPaddingVertical,
        marginRight: gapSmall,
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        className={`font-medium ${active ? 'text-white' : 'text-slate-600'}`}
        style={{
          fontSize: responsiveFontSize(14),
          color: active ? '#FFFFFF' : color,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
