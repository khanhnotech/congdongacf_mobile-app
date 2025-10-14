import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDateTime } from '../utils/format';
import { ROUTES } from '../utils/constants';

export default function PostCard({ post, onPress }) {
  if (!post) return null;

  const navigation = useNavigation();
  const initials =
    post.author
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AC';

  const previewLimit = 150;
  const excerpt = post.excerpt ?? '';
  const shouldClamp = excerpt.length > previewLimit;
  const previewText = shouldClamp ? `${excerpt.slice(0, previewLimit)}...` : excerpt;

  const handlePress = () => {
    if (onPress) {
      onPress(post);
      return;
    }

    if (post.id) {
      navigation.navigate(ROUTES.STACK.POST_DETAIL, { postId: post.id });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      className="mb-6 overflow-hidden rounded-3xl border border-red-100 bg-white p-5 shadow-sm"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-200">
          <Text className="text-sm font-semibold text-slate-700">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-red-600">{post.author}</Text>
          <Text className="text-xs text-slate-400">{formatDateTime(post.createdAt)}</Text>
        </View>
      </View>

      <Text className="mt-3 text-base font-bold text-red-600">{post.title}</Text>
      <Text className="mt-2 text-sm leading-6 text-slate-600">
        {previewText}{' '}
        {shouldClamp ? <Text className="font-semibold text-red-600">Xem thêm</Text> : null}
      </Text>

      {post.cover ? (
        <View className="mt-4 overflow-hidden rounded-3xl border border-slate-100">
          <Image source={{ uri: post.cover }} className="h-48 w-full" />
        </View>
      ) : null}

      <View className="mt-5 flex-row items-center gap-3">
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2"
        >
          <MaterialCommunityIcons name="heart-outline" size={18} color="#DC2626" />
          <Text className="text-sm font-medium text-red-600">Thích</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2"
        >
          <MaterialCommunityIcons name="comment-outline" size={18} color="#DC2626" />
          <Text className="text-sm font-medium text-red-600">Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="ml-auto flex-row items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2"
        >
          <MaterialCommunityIcons name="share-variant" size={18} color="#DC2626" />
          <Text className="text-sm font-medium text-red-600">Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
