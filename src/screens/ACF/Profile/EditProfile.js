import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
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
  } = useResponsiveSpacing();

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
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
      }}
    >
      <Text
        className="uppercase text-red-600"
        style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
      >
        Hồ sơ cá nhân
      </Text>
      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        {formatName(user)}
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginTop: gapSmall,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Cập nhật thông tin để mọi người hiểu thêm về bạn.
      </Text>

      <View style={{ marginTop: gapMedium, gap: gapMedium }}>
        <TextInput
          value={form.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          placeholder="Họ"
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
          value={form.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          placeholder="Tên"
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
          value={form.bio}
          onChangeText={(value) => handleChange('bio', value)}
          placeholder="Giới thiệu ngắn gọn về bạn"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="border border-slate-200 text-slate-700"
          style={{
            borderRadius: cardRadius - 4,
            paddingHorizontal: cardPadding * 0.7,
            paddingVertical: inputPaddingVertical,
            fontSize: responsiveFontSize(15, { min: 13 }),
            backgroundColor: '#FFFFFF',
            minHeight: cardPadding * 4.5,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSaving}
        className={`bg-red-500 ${isSaving ? 'opacity-60' : ''}`}
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
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

