import { Text, TouchableOpacity } from 'react-native';

export default function TopicChip({
  label,
  active = false,
  onPress,
  color = '#0D9488',
}) {
  return (
    <TouchableOpacity
      className={`mr-3 rounded-full border px-4 py-2 ${
        active ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white'
      }`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        className={`text-sm font-medium ${
          active ? 'text-white' : 'text-slate-600'
        }`}
        style={active ? undefined : { color }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
