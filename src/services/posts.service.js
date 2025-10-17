import { apiClient } from './api';

const mapArticleToPost = (article = {}) => {
  const author =
    article.author?.name ??
    article.author_name ??
    article.authorName ??
    article.author ??
    'ACF';

  return {
    id: String(article.id ?? article.slug ?? article._id ?? `${author}-${article.title ?? ''}`),
    title: article.title ?? article.name ?? 'Bài viết',
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
      article.thumbnail ??
      article.thumbnail_url ??
      null,
    raw: article,
  };
};

const extractData = (payload) => {
  if (!payload) return { items: [], meta: undefined };
  const data = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const meta = payload.meta ?? payload.pagination ?? undefined;
  return { data, meta };
};

export const postsService = {
  async listPosts(params) {
    const response = await apiClient.get('article', { params });
    const { data, meta } = extractData(response);
    return {
      items: data.map(mapArticleToPost),
      meta,
    };
  },

  async getPost(id) {
    if (!id) return null;
    const response = await apiClient.get(`article/${id}`);
    const article = response?.data ?? response;
    if (!article) return null;
    return mapArticleToPost(article);
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
        author_name: 'Bạn',
        created_at: new Date().toISOString(),
        topic_id: payload?.topicId,
      });
    }
  },
};
