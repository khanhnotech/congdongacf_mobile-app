import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function Register() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: 'Người',
    lastName: 'Mới',
    email: 'new@acf-community.app',
    password: '123456',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    screenPadding,
    verticalPadding,
    contentMaxWidth,
    cardPadding,
    cardRadius,
    gapSmall,
    gapMedium,
    responsiveFontSize,
    inputPaddingVertical,
    buttonPaddingVertical,
  } = useResponsiveSpacing();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      setIsSubmitting(true);
      await register(form);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_TABS }],
      });
    } catch (error) {
      console.warn('Register error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      className="flex-1 justify-center bg-red-600"
      style={{
        paddingHorizontal: screenPadding,
        paddingVertical: verticalPadding,
      }}
    >
      <View
        className="bg-white shadow-sm"
        style={{
          padding: cardPadding,
          borderRadius: cardRadius,
          width: '100%',
          maxWidth: contentMaxWidth,
          alignSelf: 'center',
        }}
      >
        <Text
          className="font-bold text-slate-900"
          style={{ fontSize: responsiveFontSize(28) }}
        >
          Tạo tài khoản mới
        </Text>
        <Text
          className="text-slate-500"
          style={{
            marginTop: gapSmall,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Hãy bắt đầu hành trình đóng góp cho cộng đồng.
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
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
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
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            placeholder="Mật khẩu"
            className="border border-slate-200 text-slate-700"
            style={{
              borderRadius: cardRadius - 4,
              paddingHorizontal: cardPadding * 0.7,
              paddingVertical: inputPaddingVertical,
              fontSize: responsiveFontSize(15, { min: 13 }),
              backgroundColor: '#FFFFFF',
            }}
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isSubmitting}
            className={`bg-slate-900 ${isSubmitting ? 'opacity-60' : ''}`}
            style={{
              borderRadius: cardRadius - 2,
              paddingVertical: buttonPaddingVertical,
            }}
          >
            <Text
              className="text-center font-semibold text-white"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingVertical: gapSmall }}
          >
            <Text
              className="text-center text-slate-500"
              style={{ fontSize: responsiveFontSize(14, { min: 13 }) }}
            >
              Đã có tài khoản?{' '}
              <Text
                className="font-semibold text-red-600"
                style={{ fontSize: responsiveFontSize(14, { min: 13 }) }}
              >
                Đăng nhập ngay
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

