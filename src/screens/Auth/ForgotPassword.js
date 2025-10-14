import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../utils/constants';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('demo@acf-community.app');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email của bạn.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.forgotPassword({ email });
      Alert.alert(
        'Đã gửi yêu cầu',
        'Vui lòng kiểm tra email để đặt lại mật khẩu.'
      );
      navigation.navigate(ROUTES.AUTH.LOGIN);
    } catch (error) {
      Alert.alert('Có lỗi xảy ra', error?.message ?? 'Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-red-50 px-6">
      <View className="rounded-3xl bg-white p-8 shadow">
        <Text className="text-3xl font-bold text-slate-900">
          Quên mật khẩu
        </Text>
        <Text className="mt-2 text-sm text-slate-500">
          Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
        </Text>

        <View className="mt-6 gap-4">
          <Text className="text-xs font-semibold uppercase text-slate-500">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700"
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
            {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
          className="mt-4"
        >
          <Text className="text-center text-sm font-medium text-red-600">
            Quay về đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
