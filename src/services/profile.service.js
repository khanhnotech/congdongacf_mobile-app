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

const mapArticle = (item) => {
  if (!item) return null;
  const publishedAt =
    item.publishedAt ??
    item.published_at ??
    item.createdAt ??
    item.created_at ??
    null;

  return {
    id: item.id ?? null,
    title: item.title ?? '',
    slug: item.slug ?? null,
    summary: item.summary ?? '',
    status: item.status ?? 'unknown',
    imageUrl:
      item.imageUrl ??
      item.image_url ??
      item.main_image_url ??
      item.mainImageUrl ??
      null,
    videoUrl: item.main_video_url ?? item.videoUrl ?? null,
    publishedAt,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
    viewCount: item.viewCount ?? item.view_count ?? 0,
    commentCount: item.commentCount ?? item.comment_count ?? 0,
    likeCount: Number.isFinite(Number(item.likeCount ?? item.like_count))
      ? Number(item.likeCount ?? item.like_count)
      : 0,
    liked: Boolean(
      item.liked ??
      item.like ??
      item.is_liked ??
      item.raw?.liked ??
      item.raw?.like
    ),
    isHot: Boolean(item.isHot ?? item.is_hot ?? false),
    isAnalysis: Boolean(item.isAnalysis ?? item.is_analysis ?? false),
    topicId: item.topicId ?? item.topic_id ?? null,
    author: item.author ?? item.author_name ?? item.raw?.author_name ?? null,
    authorAvatar: item.authorAvatar ?? item.author_avatar ?? item.raw?.author_avatar ?? null,
    raw: item,
  };
};

const adaptProfileArticles = (payload) => {
  const source = payload?.data ?? payload ?? {};
  const rawItems =
    normalizeList(source.items).length
      ? normalizeList(source.items)
      : normalizeList(source.rows);

  const items = rawItems
    .map(mapArticle)
    .filter(Boolean);

  const paginationSource = source.pagination ?? source.meta ?? {};
  const page =
    paginationSource.page ??
    paginationSource.currentPage ??
    paginationSource.pageNumber ??
    source.page ??
    1;
  const limit =
    paginationSource.limit ??
    paginationSource.per_page ??
    paginationSource.perPage ??
    source.limit ??
    rawItems.length;
  const total = paginationSource.total ?? paginationSource.totalItems ?? source.total ?? items.length;

  const totalPages =
    paginationSource.totalPages ??
    paginationSource.total_pages ??
    (limit ? Math.ceil(total / limit) : 1);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    raw: source,
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
  async getProfileArticles(userId, params) {
    if (!userId) {
      throw new Error('Missing userId to fetch profile articles');
    }
    const response = await apiClient.get(`profile/${userId}/article`, {
      params,
    });
    return adaptProfileArticles(response);
  },
};
