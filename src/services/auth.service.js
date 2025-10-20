import { apiClient } from './api';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

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
    throw new Error('Thieu thong tin dang nhap.');
  }

  return { identifier, password };
};

const splitFullName = (value) => {
  if (!value) return { first: '', last: '' };
  const normalized = String(value).trim();
  if (!normalized) return { first: '', last: '' };
  const parts = normalized.split(/\s+/);
  if (parts.length === 1) {
    return { first: parts[0], last: '' };
  }
  return {
    first: parts.slice(0, -1).join(' '),
    last: parts.at(-1) ?? '',
  };
};

const normalizeUserProfile = (raw = {}) => {
  if (!raw || typeof raw !== 'object') return null;

  const profile = raw.profile && typeof raw.profile === 'object' ? raw.profile : {};

  let firstName =
    raw.firstName ??
    raw.first_name ??
    profile.firstName ??
    profile.first_name ??
    '';
  let lastName =
    raw.lastName ??
    raw.last_name ??
    profile.lastName ??
    profile.last_name ??
    '';

  if ((!firstName || !lastName) && raw.name) {
    const { first, last } = splitFullName(raw.name);
    if (!firstName) firstName = first;
    if (!lastName) lastName = last;
  }

  if ((!firstName || !lastName) && raw.display_name) {
    const { first, last } = splitFullName(raw.display_name);
    if (!firstName) firstName = first;
    if (!lastName) lastName = last;
  }

  const fullName =
    raw.fullName ??
    raw.full_name ??
    raw.name ??
    raw.displayName ??
    raw.display_name ??
    `${firstName} ${lastName}`.trim();

  const bio =
    raw.bio ??
    raw.description ??
    profile.bio ??
    profile.description ??
    '';

  const avatar =
    raw.avatar ??
    raw.avatar_url ??
    profile.avatar ??
    profile.avatar_url ??
    raw.setting_avatar ??
    null;

  const cover =
    raw.cover ??
    raw.cover_photo ??
    profile.cover ??
    profile.cover_photo ??
    null;

  return {
    id: raw.id ?? raw.user_id ?? profile.user_id ?? null,
    firstName,
    lastName,
    fullName:
      fullName ||
      [firstName, lastName].filter(Boolean).join(' ') ||
      raw.username ||
      raw.email ||
      '',
    email: raw.email ?? profile.email ?? '',
    username: raw.username ?? profile.username ?? '',
    phone: raw.phone ?? profile.phone ?? '',
    role: raw.role ?? profile.role ?? 'user',
    avatar,
    cover,
    bio,
    createdAt:
      raw.createdAt ??
      raw.created_at ??
      profile.createdAt ??
      profile.created_at ??
      null,
    updatedAt:
      raw.updatedAt ??
      raw.updated_at ??
      profile.updatedAt ??
      profile.updated_at ??
      null,
    raw,
  };
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
  const userSource =
    source?.user ??
    source?.profile ??
    source?.data?.user ??
    source?.data;

  const normalizedUser = normalizeUserProfile(userSource);

  if (!token || !normalizedUser) {
    throw new Error('Phan hoi dang nhap khong hop le.');
  }

  return { token, refreshToken, user: normalizedUser };
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
    try {
      const response = await apiClient.get('auth/me');
      const user = response?.data?.user ?? null;
      return normalizeUserProfile(user);
    } catch (error) {
      if (error?.status === 401 || error?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  async forgotPassword(payload) {
    console.log('authService.forgotPassword', payload);
    await delay();
    return true;
  },
  async updateProfile(changes) {
    const response = await apiClient.put('auth/profile', {
      body: changes,
    });
    const user = response?.data?.user ?? null;
    return normalizeUserProfile(user);
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
