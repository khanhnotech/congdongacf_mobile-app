import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

export default function Login() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@acf-community.app');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <View className="flex-1 justify-center bg-slate-900 px-6">
      <View className="rounded-3xl bg-white p-8">
        <Text className="text-3xl font-bold text-slate-900">
          Chào bạn quay lại!
        </Text>
        <Text className="mt-2 text-sm text-slate-500">
          Đăng nhập để tiếp tục tham gia cộng đồng ACF.
        </Text>

        <View className="mt-6 gap-4">
          <View>
            <Text className="mb-2 text-xs font-semibold uppercase text-slate-500">
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
          <View>
            <Text className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Mật khẩu
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isSubmitting}
            className={`rounded-2xl bg-emerald-500 py-4 ${
              isSubmitting ? 'opacity-60' : ''
            }`}
          >
            <Text className="text-center text-base font-semibold text-white">
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)}
            className="py-2"
          >
            <Text className="text-center text-sm text-slate-500">
              Chưa có tài khoản?{' '}
              <Text className="font-semibold text-emerald-500">
                Đăng ký ngay
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
