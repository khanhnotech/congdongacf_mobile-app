import { apiClient } from './api';

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const toBooleanOrUndefined = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', 'y'].includes(normalized)) return true;
    if (['false', 'no', 'n'].includes(normalized)) return false;
  }
  return undefined;
};

const extractLikeCount = (payload) => {
  if (!payload) return undefined;
  const candidates = [
    payload?.data?.like_count,
    payload?.data?.likes,
    payload?.data?.count,
    payload?.like_count,
    payload?.likes,
    payload?.count,
    payload?.data?.data?.like_count,
    payload?.data?.data?.count,
  ];

  for (const candidate of candidates) {
    const parsed = toNumber(candidate);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  return undefined;
};

const mapArticleToPost = (article = {}) => {
  const author =
    article.author?.name ??
    article.author_name ??
    article.authorName ??
    article.author ??
    'ACF';

  const articleId =
    toNumber(article.article_id) ??
    toNumber(article.id) ??
    toNumber(article._id) ??
    undefined;

  const slug =
    article.slug ??
    article.seo_slug ??
    article.url_slug ??
    article.permalink ??
    null;

  const likeCount =
    toNumber(article.like_count) ??
    toNumber(article.likes) ??
    toNumber(article.likeCount) ??
    undefined;
  const likedSource =
    article.liked ??
    article.isLiked ??
    article.user_liked ??
    article.viewer_liked ??
    article.is_liked ??
    undefined;
  const liked = toBooleanOrUndefined(likedSource);

  return {
    id: String(article.id ?? article.slug ?? article._id ?? `${author}-${article.title ?? ''}`),
    articleId,
    slug: slug ? String(slug) : null,
    title: article.title ?? article.name ?? 'B\u00E0i vi\u1EBFt',
    excerpt: article.excerpt ?? article.summary ?? article.description ?? '',
    content: article.content ?? article.body ?? '',
    author,
    createdAt:
      article.published_at ??
      article.created_at ??
      article.updated_at ??
      new Date().toISOString(),
    topicId: article.topic_id ?? article.topicId ?? article.topic?.id ?? null,
    cover:
      article.cover ??
      article.cover_url ??
      article.main_image_url ??
      article.mainImageUrl ??
      article.main_image ??
      article.mainImage ??
      article.thumbnail ??
      article.thumbnail_url ??
      null,
    likeCount,
    liked,
    tags: Array.isArray(article.tags) ? article.tags : [],
    media: Array.isArray(article.media) ? article.media : [],
    raw: article,
  };
};

const extractData = (payload) => {
  if (!payload) return { items: [], meta: undefined };
  const data = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const meta = payload.meta ?? payload.pagination ?? undefined;
  return { data, meta };
};

const fetchArticleLikeCount = async (articleId) => {
  if (!Number.isFinite(articleId)) return undefined;
  try {
    const response = await apiClient.get(`article/count-like/${articleId}`);
    return extractLikeCount(response);
  } catch (error) {
    console.warn('Failed to fetch like count for article', articleId, error);
    return undefined;
  }
};

const hydrateLikeCount = async (post, source) => {
  if (typeof post.likeCount === 'number') {
    return post;
  }

  const sourceId =
    post.articleId ??
    toNumber(source?.article_id) ??
    toNumber(source?.id);

  if (!Number.isFinite(sourceId)) {
    return post;
  }

  const likeCount = await fetchArticleLikeCount(sourceId);
  if (typeof likeCount === 'number') {
    return { ...post, likeCount };
  }
  return post;
};

export const postsService = {
  async listPosts(params) {
    const response = await apiClient.get('article', { params });
    const { data, meta } = extractData(response);
    const posts = data.map(mapArticleToPost);
    const items = await Promise.all(
      posts.map((post, index) => hydrateLikeCount(post, data[index])),
    );

    return {
      items,
      meta,
    };
  },

  async listTrendingPosts(params) {
    const response = await apiClient.get('article/trend', { params });
    const { data, meta } = extractData(response);
    const posts = data.map(mapArticleToPost);
    const items = await Promise.all(
      posts.map((post, index) => hydrateLikeCount(post, data[index])),
    );

    return {
      items,
      meta,
    };
  },

  async getPost(identifier) {
    if (!identifier) return null;

    const target =
      typeof identifier === 'object' && identifier !== null
        ? identifier
        : { id: identifier };

    const slugCandidate =
      target.slug ?? target.postSlug ?? target.slugId ?? undefined;
    const idCandidate =
      target.articleId ??
      target.id ??
      target.postId ??
      target.identifier ??
      undefined;
    const numericIdFallback = toNumber(idCandidate);
    const hasNumericFallback = Number.isFinite(numericIdFallback);

    let article;

    if (slugCandidate) {
      const slug = String(slugCandidate).trim();
      if (slug) {
        try {
          const response = await apiClient.get(
            `article/detail/${encodeURIComponent(slug)}`,
          );
          article = response?.data ?? response;
        } catch (error) {
          console.warn('Fetch article by slug failed', slug, error);
          if (!hasNumericFallback) {
            throw error;
          }
        }
      }
    }

    if (!article) {
      if (!hasNumericFallback) {
        return null;
      }
      const response = await apiClient.get(`article/${numericIdFallback}`);
      article = response?.data ?? response;
    }

    if (!article) return null;
    const post = mapArticleToPost(article);
    return hydrateLikeCount(post, article);
  },

  async createPost(payload) {
    try {
      const response = await apiClient.post('article', { body: payload });
      const article = response?.data ?? response;
      return mapArticleToPost(article);
    } catch (error) {
      console.warn('Create article failed, falling back to local mock', error);
      return mapArticleToPost({
        id: `draft-${Date.now()}`,
        title: payload?.title,
        summary: payload?.excerpt,
        content: payload?.content,
        cover: payload?.cover,
        author_name: 'B\u1EA1n',
        created_at: new Date().toISOString(),
        topic_id: payload?.topicId,
        like_count: 0,
        liked: false,
      });
    }
  },

  async toggleLike(articleId) {
    const targetId = toNumber(articleId);
    if (!Number.isFinite(targetId)) {
      throw new Error('Invalid article id');
    }
    const response = await apiClient.post(`article/like/${targetId}`);
    const data = response?.data ?? response;
    return {
      articleId: toNumber(data?.article_id) ?? targetId,
      liked: Boolean(data?.liked),
      likeCount: toNumber(data?.like_count),
    };
  },
};
