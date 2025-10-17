import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
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

  const handleSubmit = () => {
    Alert.alert('Đã gửi', 'Cảm ơn bạn đã liên hệ với ACF!');
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
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        Liên hệ ban điều hành
      </Text>
      <Text
        className="text-slate-500"
        style={{
          marginTop: gapSmall,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Gửi thông tin phản hồi hoặc câu hỏi tới ban điều hành cộng đồng.
      </Text>

      <View style={{ marginTop: gapMedium, gap: gapMedium }}>
        <TextInput
          value={form.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Họ và tên"
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
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
          autoCapitalize="none"
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
          value={form.message}
          onChangeText={(value) => handleChange('message', value)}
          placeholder="Nội dung"
          multiline
          numberOfLines={6}
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
        className="bg-red-500"
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
          Gửi liên hệ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

