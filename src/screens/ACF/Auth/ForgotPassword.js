import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../../services/auth.service';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('demo@gmail.com');
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

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email của bạn.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.forgotPassword({ email });
      Alert.alert('Đã gửi yêu cầu', 'Vui lòng kiểm tra email để đặt lại mật khẩu.');
      navigation.navigate(ROUTES.AUTH.LOGIN);
    } catch (error) {
      Alert.alert('Có lỗi xảy ra', error?.message ?? 'Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      className="flex-1 justify-center bg-red-50"
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
          Quên mật khẩu
        </Text>
        <Text
          className="text-slate-500"
          style={{
            marginTop: gapSmall,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
        </Text>

        <View style={{ marginTop: gapMedium, gap: gapMedium }}>
          <View>
            <Text
              className="font-semibold uppercase text-slate-500"
              style={{
                fontSize: responsiveFontSize(11, { min: 10 }),
                marginBottom: gapSmall / 1.3,
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
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
          </View>
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
            {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
          style={{ marginTop: gapSmall }}
        >
          <Text
            className="text-center font-medium text-red-600"
            style={{ fontSize: responsiveFontSize(14, { min: 13 }) }}
          >
            Quay về đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
