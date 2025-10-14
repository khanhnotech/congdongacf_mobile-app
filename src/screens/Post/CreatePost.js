import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../../hooks/usePosts';

export default function CreatePost() {
  const navigation = useNavigation();
  const { createPost } = usePosts();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createPost(form);
      Alert.alert('Thành công', 'Bài viết đã được tạo (demo).');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error?.message ?? 'Không thể tạo bài viết.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="text-3xl font-bold text-slate-900">
        Tạo bài viết mới
      </Text>
      <Text className="mt-2 text-sm text-slate-500">
        Chia sẻ thông tin, câu chuyện hoặc hoạt động ý nghĩa cùng cộng đồng.
      </Text>

      <View className="mt-8 gap-4">
        <TextInput
          value={form.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Tiêu đề"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
        <TextInput
          value={form.excerpt}
          onChangeText={(value) => handleChange('excerpt', value)}
          placeholder="Mô tả ngắn"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`mt-6 rounded-2xl bg-red-500 py-4 ${
          isSubmitting ? 'opacity-60' : ''
        }`}
        activeOpacity={0.85}
      >
        <Text className="text-center text-base font-semibold text-white">
          {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

