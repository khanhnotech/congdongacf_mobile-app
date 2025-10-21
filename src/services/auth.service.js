import { apiClient } from './api';
import { useAuthStore } from '../store/auth.store';

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

const buildEditProfilePayload = (changes = {}) => {
  if (!changes || typeof changes !== 'object') return {};

  const payload = {};
  const trimString = (value) =>
    typeof value === 'string' ? value.trim() : value;

  if ('firstName' in changes || 'lastName' in changes) {
    const first = trimString(changes.firstName) || '';
    const last = trimString(changes.lastName) || '';
    const displayName = `${first} ${last}`.trim();
    if (displayName) {
      payload.name = displayName;
      payload.display_name = displayName;
    }
  }

  if ('bio' in changes) {
    const bio = trimString(changes.bio);
    payload.description = typeof bio === 'string' ? bio : '';
  }

  const passthroughKeys = [
    'phone',
    'avatar_url',
    'cover_photo',
    'description',
    'setting_avatar',
    'display_name',
    'birth_year',
    'workplace',
    'studied_at',
    'live_at',
    'link_code',
    'privacy',
    'business',
  ];

  passthroughKeys.forEach((key) => {
    if (key in changes && payload[key] === undefined) {
      payload[key] = changes[key];
    }
  });

  if (!payload.name) {
    const first = trimString(changes.firstName) || '';
    const last = trimString(changes.lastName) || '';
    const full = [first, last].filter(Boolean).join(' ');
    if (full) {
      payload.name = full;
    }
  }

  if (!payload.display_name && payload.name) {
    payload.display_name = payload.name;
  }

  return payload;
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
  async googleLogin() {
    const { googleAuthService } = await import('./googleAuth.service');
    const response = await googleAuthService.signIn();
    return adaptAuthPayload(response);
  },
  async updateProfile(changes) {
    const body = buildEditProfilePayload(changes);
    const files = {
      avatar: changes?.avatarFile ?? null,
      cover: changes?.coverFile ?? null,
    };

    const hasFiles = Boolean(files.avatar || files.cover);
    const payload = hasFiles ? new FormData() : body;

    if (hasFiles) {
      Object.entries(body).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        payload.append(key, typeof value === 'string' ? value : String(value));
      });
      if (files.avatar) {
        payload.append('avatar', files.avatar);
      }
      if (files.cover) {
        payload.append('cover', files.cover);
      }
    }

    const response = await apiClient.post('profile/edit-user', {
      body: payload,
    });
    const profilePayload = response?.data ?? response ?? null;
    const user = profilePayload?.user ?? profilePayload ?? null;
    const normalized = normalizeUserProfile(user);
    if (normalized) {
      return { user: normalized, profile: profilePayload };
    }

    const current = useAuthStore.getState().user;
    if (!current) return { user: null, profile: profilePayload };

    const safeString = (value) =>
      typeof value === 'string' ? value.trim() : '';

    const hasFirst = Object.prototype.hasOwnProperty.call(changes ?? {}, 'firstName');
    const hasLast = Object.prototype.hasOwnProperty.call(changes ?? {}, 'lastName');
    const hasBio = Object.prototype.hasOwnProperty.call(changes ?? {}, 'bio');

    const nextFirst = hasFirst ? safeString(changes.firstName) : current.firstName ?? '';
    const nextLast = hasLast ? safeString(changes.lastName) : current.lastName ?? '';
    const nextFullName = [nextFirst, nextLast].filter(Boolean).join(' ') || current.fullName || '';
    const nextBio = hasBio ? safeString(changes.bio) : current.bio ?? '';

    const fallbackUser = {
      ...current,
      firstName: nextFirst,
      lastName: nextLast,
      fullName: nextFullName,
      bio: nextBio,
      avatar: body.avatar_url ?? current.avatar,
      cover: body.cover_photo ?? current.cover,
      raw: {
        ...(current.raw ?? {}),
        name: body.name ?? current.raw?.name ?? nextFullName,
        display_name: body.display_name ?? current.raw?.display_name ?? nextFullName,
        description: body.description ?? current.raw?.description ?? nextBio,
        avatar_url: body.avatar_url ?? current.raw?.avatar_url,
        cover_photo: body.cover_photo ?? current.raw?.cover_photo,
      },
    };
    return { user: fallbackUser, profile: profilePayload };
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
