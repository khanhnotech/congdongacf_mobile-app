import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

export default function Register() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const {
    width,
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
    if (errorMessage) setErrorMessage(null);
  };

  const handleRegister = async () => {
    if (!form.name?.trim() || !form.username?.trim() || !form.email?.trim() || !form.password) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        password: form.password,
        confirm_password: form.confirmPassword,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_TABS }],
      });
    } catch (error) {
      console.warn('Register error', error);
      const message =
        error?.data?.message ?? error?.message ?? 'Đăng ký thất bại, vui lòng thử lại.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-red-600"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : (width <= 360 ? 40 : 20)}
      style={{ flex: 1, justifyContent: 'center' }}
      enabled={true}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingVertical: verticalPadding,
          paddingBottom: verticalPadding + (width <= 360 ? 80 : 200), // Extra padding for keyboard
          flexGrow: 1,
          justifyContent: 'center',
          minHeight: '100%', // Ensure full height
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
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
            value={form.username}
            onChangeText={(value) => handleChange('username', value)}
            autoCapitalize="none"
            placeholder="Tên đăng nhập"
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
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
            keyboardType="phone-pad"
            placeholder="Số điện thoại (tuỳ chọn)"
            className="border border-slate-200 text-slate-700"
            style={{
              borderRadius: cardRadius - 4,
              paddingHorizontal: cardPadding * 0.7,
              paddingVertical: inputPaddingVertical,
              fontSize: responsiveFontSize(15, { min: 13 }),
              backgroundColor: '#FFFFFF',
            }}
          />

          <PasswordField
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            visible={isPasswordVisible}
            onToggleVisible={() => setIsPasswordVisible((prev) => !prev)}
            placeholder="Mật khẩu"
            cardRadius={cardRadius}
            cardPadding={cardPadding}
            inputPaddingVertical={inputPaddingVertical}
            responsiveFontSize={responsiveFontSize}
          />
          <PasswordField
            value={form.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            visible={isConfirmVisible}
            onToggleVisible={() => setIsConfirmVisible((prev) => !prev)}
            placeholder="Xác nhận mật khẩu"
            cardRadius={cardRadius}
            cardPadding={cardPadding}
            inputPaddingVertical={inputPaddingVertical}
            responsiveFontSize={responsiveFontSize}
          />

          {errorMessage ? (
            <Text
              className="text-center font-medium text-red-600"
              style={{ fontSize: responsiveFontSize(13) }}
            >
              {errorMessage}
            </Text>
          ) : null}

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PasswordField({
  value,
  onChangeText,
  visible,
  onToggleVisible,
  placeholder,
  cardRadius,
  cardPadding,
  inputPaddingVertical,
  responsiveFontSize,
}) {
  return (
    <View
      className="border border-slate-200"
      style={{
        borderRadius: cardRadius - 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        placeholder={placeholder}
        className="text-slate-700 flex-1"
        style={{
          paddingHorizontal: cardPadding * 0.7,
          paddingVertical: inputPaddingVertical,
          fontSize: responsiveFontSize(15, { min: 13 }),
          backgroundColor: 'transparent',
        }}
      />
      <TouchableOpacity
        onPress={onToggleVisible}
        activeOpacity={0.8}
        style={{
          paddingHorizontal: cardPadding * 0.4,
          paddingVertical: inputPaddingVertical * 0.6,
        }}
      >
        <MaterialCommunityIcons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={responsiveFontSize(20)}
          color="#475569"
        />
      </TouchableOpacity>
    </View>
  );
}

