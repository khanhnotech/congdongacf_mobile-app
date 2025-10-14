import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    Alert.alert('Đã gửi', 'Cảm ơn bạn đã liên hệ với ACF!');
  };

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="text-3xl font-bold text-slate-900">
        Liên hệ ban điều hành
      </Text>
      <Text className="mt-2 text-sm text-slate-500">
        Gửi thông tin phản hồi hoặc câu hỏi tới ban điều hành cộng đồng.
      </Text>

      <View className="mt-8 gap-4">
        <TextInput
          value={form.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Họ và tên"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
        <TextInput
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
          autoCapitalize="none"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
        <TextInput
          value={form.message}
          onChangeText={(value) => handleChange('message', value)}
          placeholder="Nội dung"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="mt-6 rounded-2xl bg-red-500 py-4"
        activeOpacity={0.85}
      >
        <Text className="text-center text-base font-semibold text-white">
          Gửi liên hệ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

