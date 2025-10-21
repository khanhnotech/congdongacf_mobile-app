import { apiClient } from "./api";

const mapTopic = (topic) => ({
  id: topic.id,
  name: topic.name,
  slug: topic.slug,
  description: topic.description,
  icon_url: topic.icon_url,
  color: topic.color || '#DC2626',
  article_count: topic.article_count || 0,
  follower_count: topic.follower_count || 0,
  display_order: topic.display_order,
  createdAt: topic.created_at,
  updatedAt: topic.updated_at,
});

const mapArticle = (article) => ({
  id: article.id,
  title: article.title,
  slug: article.slug,
  summary: article.summary,
  main_image_url: article.main_image_url,
  published_at: article.published_at,
  view_count: article.view_count,
  comment_count: article.comment_count,
  is_hot: article.is_hot,
  is_analysis: article.is_analysis,
  author: {
    id: article.author_id,
    name: article.author_name,
    username: article.author_username,
    avatar_url: article.author_avatar,
  },
  topic: {
    id: article.topic_id,
    name: article.topic_name,
    slug: article.topic_slug,
  },
  tags: article.tags || [],
});

export const topicsService = {
  async listTopics(params = {}) {
    const response = await apiClient.get('topic', { params });
    
    // Server trả về: { success: true, data: { topics: [...], meta: {...} } }
    const data = response?.data || {};
    const topics = data?.topics || [];
    const meta = data?.meta || {};
    
    return {
      items: topics.map(mapTopic),
      meta,
    };
  },

  async getTopicBySlug(slug, params = {}) {
    if (!slug) return null;
    
    const response = await apiClient.get(`topic/${slug}`, { params });
    
    // Server trả về: { topic: {...}, articles: [...], meta: {...} }
    const topic = response?.topic;
    const articles = response?.articles || [];
    const meta = response?.meta || {};
    
    if (!topic) return null;
    
    return {
      topic: mapTopic(topic),
      articles: articles.map(mapArticle),
      meta,
    };
  },

  async getTopic(id) {
    // Fallback method - có thể không cần thiết nếu chỉ dùng slug
    if (!id) return null;
    const response = await apiClient.get(`topic/${id}`);
    const topic = response?.topic || response;
    if (!topic) return null;
    return mapTopic(topic);
  },
};
