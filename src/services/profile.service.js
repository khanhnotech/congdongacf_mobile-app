import { apiClient } from './api';

const normalizeList = (value) => (Array.isArray(value) ? value : []);

const normalizePersonalInfo = (items) => {
  const normalized = [];
  const lookup = {};
  normalizeList(items).forEach((item) => {
    if (!item) return;
    const key = item.key ?? item.id ?? item.label ?? `info-${normalized.length}`;
    const label = item.label ?? key;
    const value = item.value ?? null;
    const display =
      item.display ??
      (typeof value === 'string' && value.trim() ? value : value ?? '');
    const entry = {
      key,
      label,
      value,
      display: (display ?? '').toString(),
    };
    normalized.push(entry);
    if (key) lookup[key] = entry;
  });
  return { list: normalized, lookup };
};

const normalizeStats = (items) => {
  const normalized = [];
  const lookup = {};
  normalizeList(items).forEach((item) => {
    if (!item) return;
    const key = item.key ?? item.id ?? item.label ?? `stat-${normalized.length}`;
    const label = item.label ?? key;
    const value = Number.isFinite(Number(item.value))
      ? Number(item.value)
      : 0;
    const entry = { key, label, value };
    normalized.push(entry);
    if (key) lookup[key] = entry;
  });
  return { list: normalized, lookup };
};

const adaptProfile = (payload) => {
  const source = payload?.data ?? payload;
  if (!source) return null;

  const { list: personalInfo, lookup: personalInfoMap } =
    normalizePersonalInfo(source.personalInfo);
  const { list: stats, lookup: statsMap } = normalizeStats(source.stats);

  return {
    id: source.userId ?? source.id ?? null,
    name: source.name ?? null,
    email: source.email ?? null,
    avatar: source.avatar ?? null,
    cover: source.cover ?? null,
    personalInfo,
    personalInfoMap,
    stats,
    statsMap,
    raw: source.raw ?? source,
  };
};

export const profileService = {
  async getProfile(userId) {
    if (!userId) {
      throw new Error('Missing userId to fetch profile');
    }
    const response = await apiClient.get(`profile/${userId}`);
    return adaptProfile(response);
  },
};
