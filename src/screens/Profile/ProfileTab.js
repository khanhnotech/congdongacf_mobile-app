import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import MyProfile from './MyProfile';

function IconInput({
  icon,
  secure = false,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}) {
  return (
    <View className="flex-row items-center rounded-full border border-slate-200 bg-white px-4">
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color="#6B7280"
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        className="flex-1 py-3 text-sm text-slate-700"
        placeholderTextColor="#94A3B8"
      />
      {secure ? (
        <MaterialCommunityIcons name="eye-outline" size={20} color="#CBD5F5" />
      ) : null}
    </View>
  );
}

function LoginCard({ onLogin, isSubmitting }) {
  const [username, setUsername] = useState('demo@acf-community.app');
  const [password, setPassword] = useState('123456');

  return (
    <View className="rounded-3xl bg-white p-6 shadow-lg">
      <Text className="text-center text-xl font-semibold text-rose-600">
        Đăng nhập
      </Text>
      <View className="mt-4 gap-3">
        <IconInput
          icon="account-outline"
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập tài khoản"
          keyboardType="email-address"
        />
        <IconInput
          icon="lock-outline"
          secure
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
        />
      </View>
      <View className="mt-3 flex-row justify-between">
        <Text className="text-xs text-emerald-600">Quên mật khẩu?</Text>
        <Text className="text-xs text-emerald-600">Tạo tài khoản</Text>
      </View>
      <TouchableOpacity
        onPress={() => onLogin({ email: username, password })}
        disabled={isSubmitting}
        className={`mt-4 rounded-full bg-rose-600 py-3 ${
          isSubmitting ? 'opacity-60' : ''
        }`}
      >
        <Text className="text-center text-base font-semibold text-white">
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-3 flex-row items-center justify-center rounded-full border border-slate-200 py-3">
        <MaterialCommunityIcons
          name="google"
          size={18}
          color="#DB4437"
          style={{ marginRight: 8 }}
        />
        <Text className="text-sm font-medium text-slate-600">
          Đăng nhập bằng Google
        </Text>
      </TouchableOpacity>
      <View className="mt-4 flex-row justify-end">
        <Text className="text-xs text-slate-400">Thoát</Text>
        <MaterialCommunityIcons
          name="logout-variant"
          size={16}
          color="#94A3B8"
          style={{ marginLeft: 4 }}
        />
      </View>
    </View>
  );
}

function RegisterCard({ onRegister, isSubmitting }) {
  const [form, setForm] = useState({
    fullName: 'Thành viên mới',
    username: 'acfmember',
    email: 'new@acf-community.app',
    phone: '0901234567',
    password: '123456',
    confirmPassword: '123456',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    onRegister({
      firstName: form.fullName,
      lastName: '',
      email: form.email,
      phone: form.phone,
      username: form.username,
      password: form.password,
    });
  };

  return (
    <View className="rounded-3xl bg-white p-6 shadow-lg">
      <Text className="text-center text-xl font-semibold text-rose-600">
        Đăng ký tài khoản
      </Text>
      <View className="mt-4 gap-3">
        <IconInput
          icon="account-outline"
          value={form.fullName}
          onChangeText={(value) => handleChange('fullName', value)}
          placeholder="Họ và tên"
        />
        <IconInput
          icon="account-circle-outline"
          value={form.username}
          onChangeText={(value) => handleChange('username', value)}
          placeholder="Tên đăng nhập"
        />
        <IconInput
          icon="email-outline"
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
          keyboardType="email-address"
        />
        <IconInput
          icon="phone-outline"
          value={form.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
        />
        <IconInput
          icon="lock-outline"
          secure
          value={form.password}
          onChangeText={(value) => handleChange('password', value)}
          placeholder="Nhập mật khẩu"
        />
        <IconInput
          icon="lock-check-outline"
          secure
          value={form.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          placeholder="Xác nhận mật khẩu"
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`mt-4 rounded-full bg-rose-600 py-3 ${
          isSubmitting ? 'opacity-60' : ''
        }`}
      >
        <Text className="text-center text-base font-semibold text-white">
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </Text>
      </TouchableOpacity>
      <View className="mt-4 flex-row justify-end">
        <Text className="text-xs text-slate-400">Thoát</Text>
        <MaterialCommunityIcons
          name="logout-variant"
          size={16}
          color="#94A3B8"
          style={{ marginLeft: 4 }}
        />
      </View>
    </View>
  );
}

export default function ProfileTab() {
  const { user, login, register } = useAuth();
  const [isLogging, setIsLogging] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  if (user) {
    return <MyProfile />;
  }

  const handleLogin = async (payload) => {
    try {
      setIsLogging(true);
      await login(payload);
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', error?.message ?? 'Vui lòng thử lại.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleRegister = async (payload) => {
    try {
      setIsRegistering(true);
      await register(payload);
    } catch (error) {
      Alert.alert('Đăng ký thất bại', error?.message ?? 'Vui lòng thử lại.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-emerald-50 px-6 pt-14 pb-24">
      <Text className="text-center text-3xl font-bold text-slate-900">
        Tham gia cộng đồng ACF
      </Text>
      <Text className="mt-2 text-center text-sm text-slate-500">
        Đăng nhập hoặc đăng ký để kết nối với các hoạt động ý nghĩa.
      </Text>

      <View className="mt-8 gap-6">
        <LoginCard onLogin={handleLogin} isSubmitting={isLogging} />
        <RegisterCard
          onRegister={handleRegister}
          isSubmitting={isRegistering}
        />
      </View>
    </ScrollView>
  );
}
