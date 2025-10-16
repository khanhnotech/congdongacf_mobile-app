import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
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
    <View className="flex-1 justify-center bg-red-600 px-6">
      <View className="rounded-3xl bg-white p-8">
        <Text className="text-3xl font-bold text-slate-900">
          Tạo tài khoản mới
        </Text>
        <Text className="mt-2 text-sm text-slate-500">
          Hãy bắt đầu hành trình đóng góp cho cộng đồng.
        </Text>

        <View className="mt-6 gap-4">
          <TextInput
            value={form.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
            placeholder="Họ"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700"
          />
          <TextInput
            value={form.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
            placeholder="Tên"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700"
          />
          <TextInput
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700"
          />
          <TextInput
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            placeholder="Mật khẩu"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700"
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isSubmitting}
            className={`rounded-2xl bg-slate-900 py-4 ${
              isSubmitting ? 'opacity-60' : ''
            }`}
          >
            <Text className="text-center text-base font-semibold text-white">
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="py-2"
          >
            <Text className="text-center text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Text className="font-semibold text-red-600">
                Đăng nhập ngay
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

