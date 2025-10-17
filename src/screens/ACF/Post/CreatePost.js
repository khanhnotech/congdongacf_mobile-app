import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../../../hooks/usePosts';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';

export default function CreatePost() {
  const navigation = useNavigation();
  const { createPost } = usePosts();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const spacing = useResponsiveSpacing();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    inputPaddingVertical,
    buttonPaddingVertical,
  } = spacing;
  const gapLarge = spacing.gapLarge ?? gapMedium * 1.5;

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
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: gapLarge,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        Tạo bài viết mới
      </Text>
      <Text
        className="text-slate-500"
        style={{
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Chia sẻ thông tin, câu chuyện hoặc hoạt động ý nghĩa cùng cộng đồng.
      </Text>

      <View style={{ marginTop: gapMedium, gap: gapMedium }}>
        <TextInput
          value={form.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Tiêu đề"
          className="border border-slate-200 text-slate-700"
          style={{
            borderRadius: cardRadius - 4,
            paddingHorizontal: cardPadding * 0.7,
            paddingVertical: inputPaddingVertical,
            fontSize: responsiveFontSize(15, { min: 13 }),
            backgroundColor: '#FFFFFF',
          }}
        />
        <TextInput
          value={form.excerpt}
          onChangeText={(value) => handleChange('excerpt', value)}
          placeholder="Mô tả ngắn"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="border border-slate-200 text-slate-700"
          style={{
            borderRadius: cardRadius - 4,
            paddingHorizontal: cardPadding * 0.7,
            paddingVertical: inputPaddingVertical,
            fontSize: responsiveFontSize(15, { min: 13 }),
            backgroundColor: '#FFFFFF',
            minHeight: cardPadding * 5,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`bg-red-500 ${isSubmitting ? 'opacity-60' : ''}`}
        activeOpacity={0.85}
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius - 2,
          paddingVertical: buttonPaddingVertical,
        }}
      >
        <Text
          className="text-center font-semibold text-white"
          style={{ fontSize: responsiveFontSize(16) }}
        >
          {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

