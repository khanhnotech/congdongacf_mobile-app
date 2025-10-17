import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function Login() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@acf-community.app');
  const [password, setPassword] = useState('123456');
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

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      await login({ email, password });
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_TABS }],
      });
    } catch (error) {
      console.warn('Login error', error);
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
          Chào bạn quay lại!
        </Text>
        <Text
          className="text-slate-500"
          style={{
            marginTop: gapSmall,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Đăng nhập để tiếp tục tham gia cộng đồng ACF.
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
          <View>
            <Text
              className="font-semibold uppercase text-slate-500"
              style={{
                fontSize: responsiveFontSize(11, { min: 10 }),
                marginBottom: gapSmall / 1.3,
              }}
            >
              Mật khẩu
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••"
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

          <View className="items-end">
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
            >
              <Text
                className="font-medium text-red-600"
                style={{ fontSize: responsiveFontSize(14, { min: 13 }) }}
              >
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isSubmitting}
            className={`bg-red-500 ${isSubmitting ? 'opacity-60' : ''}`}
            style={{
              borderRadius: cardRadius - 2,
              paddingVertical: buttonPaddingVertical,
            }}
          >
            <Text
              className="text-center font-semibold text-white"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)}
            style={{ paddingVertical: gapSmall }}
          >
            <Text
              className="text-center text-slate-500"
              style={{ fontSize: responsiveFontSize(14, { min: 13 }) }}
            >
              Chưa có tài khoản?{' '}
              <Text
                className="font-semibold text-red-500"
                style={{ fontSize: responsiveFontSize(14, { min: 13 }) }}
              >
                Đăng ký ngay
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

