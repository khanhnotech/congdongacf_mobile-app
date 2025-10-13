import { Image, Text, TouchableOpacity, View } from 'react-native';
import { formatDate, truncate } from '../utils/format';

export default function PostCard({ post, onPress }) {
  if (!post) return null;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(post)}
      activeOpacity={0.85}
      className="mb-4 overflow-hidden rounded-2xl bg-white shadow"
    >
      {post.cover ? (
        <Image source={{ uri: post.cover }} className="h-40 w-full" />
      ) : null}
      <View className="gap-2 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs uppercase tracking-wide text-emerald-600">
            {post.author}
          </Text>
          <Text className="text-xs text-slate-400">
            {formatDate(post.createdAt)}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-slate-900">
          {post.title}
        </Text>
        <Text className="text-sm leading-5 text-slate-600">
          {truncate(post.excerpt, 140)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
