import { Image, ScrollView, Text, View } from 'react-native';

export default function HighlightCarousel({ items = [] }) {
  if (!items.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
    >
      {items.map((item) => (
        <View
          key={item.id}
          className="mr-4 w-64 overflow-hidden rounded-3xl bg-white shadow"
        >
          {item.image ? (
            <Image source={{ uri: item.image }} className="h-36 w-full" />
          ) : null}
          <View className="gap-2 p-4">
            <Text className="text-xs uppercase tracking-wide text-emerald-600">
              {item.tagline}
            </Text>
            <Text className="text-lg font-semibold text-slate-900">
              {item.title}
            </Text>
            <Text className="text-sm leading-5 text-slate-500">
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
