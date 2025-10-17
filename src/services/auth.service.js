import { apiClient } from './api';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUser = {
  id: 'user-1',
  email: 'demo@acf-community.app',
  firstName: 'Demo',
  lastName: 'User',
  avatar: 'https://dummyimage.com/128x128/0f172a/ffffff&text=DU',
  bio: 'Thành viên cộng đồng ACF - hãy chỉnh sửa hồ sơ của bạn.',
};

const normalizeLoginPayload = (credentials = {}) => {
  const identifier =
    credentials.identifier ??
    credentials.email ??
    credentials.username ??
    credentials.phone ??
    credentials.login;
  const password =
    credentials.password ??
    credentials.pass ??
    credentials.pwd ??
    credentials.password_hash ??
    credentials.secret;

  if (!identifier || !password) {
    throw new Error('Thiếu thông tin đăng nhập.');
  }

  return { identifier, password };
};

const adaptAuthPayload = (payload) => {
  const source = payload?.data ?? payload;
  const token =
    source?.token ??
    source?.accessToken ??
    source?.jwt ??
    source?.tokens?.accessToken ??
    source?.data?.token;
  const refreshToken =
    source?.refreshToken ??
    source?.tokens?.refreshToken ??
    source?.data?.refreshToken;
  const user =
    source?.user ??
    source?.profile ??
    source?.data?.user ??
    source?.data;

  if (!token || !user) {
    throw new Error('Phản hồi đăng nhập không hợp lệ.');
  }

  return { token, refreshToken, user };
};

export const authService = {
  async login(credentials) {
    const body = normalizeLoginPayload(credentials);
    const response = await apiClient.post('auth/login', { body });
    return adaptAuthPayload(response);
  },
  async register(payload) {
    const response = await apiClient.post('auth/register', {
      body: payload,
    });
    return adaptAuthPayload(response);
  },
  async me() {
    await delay();
    return mockUser;
  },
  async forgotPassword(payload) {
    console.log('authService.forgotPassword', payload);
    await delay();
    return true;
  },
  async updateProfile(changes) {
    console.log('authService.updateProfile', changes);
    await delay();
    return { ...mockUser, ...changes };
  },
  async logout({ refreshToken, token } = {}) {
    try {
      await apiClient.post('auth/logout', {
        body: refreshToken ? { refreshToken } : undefined,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch (error) {
      console.warn('Logout request failed', error);
    } finally {
      return true;
    }
  },
};
