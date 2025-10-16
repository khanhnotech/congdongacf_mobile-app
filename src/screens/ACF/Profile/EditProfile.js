import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { formatName } from '../../../utils/format';

export default function EditProfile() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    bio: user?.bio ?? '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await updateProfile(form);
      Alert.alert('Thành công', 'Hồ sơ của bạn đã được cập nhật.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error?.message ?? 'Không thể cập nhật hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-14">
      <Text className="text-xs uppercase text-red-600">
        Hồ sơ cá nhân
      </Text>
      <Text className="text-3xl font-bold text-slate-900">
        {formatName(user)}
      </Text>
      <Text className="mt-2 text-sm text-slate-500">
        Cập nhật thông tin để mọi người hiểu thêm về bạn.
      </Text>

      <View className="mt-8 gap-4">
        <TextInput
          value={form.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          placeholder="Họ"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
        <TextInput
          value={form.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          placeholder="Tên"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
        <TextInput
          value={form.bio}
          onChangeText={(value) => handleChange('bio', value)}
          placeholder="Giới thiệu ngắn gọn về bạn"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSaving}
        className={`mt-6 rounded-2xl bg-red-500 py-4 ${
          isSaving ? 'opacity-60' : ''
        }`}
        activeOpacity={0.85}
      >
        <Text className="text-center text-base font-semibold text-white">
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

