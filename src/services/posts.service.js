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
    status: article.status ?? article.state ?? article.approval_status ?? null,
    likeCount,
    liked,
    tags: Array.isArray(article.tags) ? article.tags : [],
    media: Array.isArray(article.media) ? article.media : [],
    raw: article,
  };
};

const extractData = (payload) => {
  if (!payload) return { items: [], meta: undefined };
  const rootData =
    Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(payload.rows)
          ? payload.rows
          : Array.isArray(payload)
            ? payload
            : Array.isArray(payload.data?.items)
              ? payload.data.items
              : Array.isArray(payload.data?.rows)
                ? payload.data.rows
                : Array.isArray(payload.data?.data)
                  ? payload.data.data
                  : [];
  const meta =
    payload.meta ??
    payload.pagination ??
    payload.data?.meta ??
    payload.data?.pagination ??
    undefined;
  return { data: rootData, meta };
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

const mapComment = (comment = {}) => {
  const id =
    toNumber(comment.id) ??
    toNumber(comment.comment_id) ??
    toNumber(comment.commentId) ??
    comment.uuid ??
    `comment-${Date.now()}`;

  return {
    id,
    content:
      comment.content ??
      comment.comment ??
      comment.body ??
      '',
    author:
      comment.author_name ??
      comment.author ??
      comment.user_name ??
      comment.user?.name ??
      'Nguoi dung',
    authorAvatar:
      comment.avatar_url ??
      comment.author_avatar ??
      comment.user?.avatar_url ??
      comment.raw?.avatar_url ??
      comment.raw?.author_avatar ??
      null,
    createdAt:
      comment.created_at ??
      comment.updated_at ??
      new Date().toISOString(),
    raw: comment,
  };
};

const normalizeCommentResponse = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.comments)) return response.comments;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.rows)) return response.data.rows;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.comments)) return response.data.comments;
  if (Array.isArray(response?.rows)) return response.rows;
  if (Array.isArray(response?.list)) return response.list;
  return [];
};

const fetchArticleDetailById = async (articleId) => {
  const targetId = toNumber(articleId);
  if (!Number.isFinite(targetId)) return null;
  try {
    const response = await apiClient.get(`article/detail/${targetId}`);
    return response?.data ?? response;
  } catch (error) {
    if (error?.status === 404) {
      return null;
    }
    console.warn('Failed to fetch article detail by id', targetId, error);
    return null;
  }
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

  async listNewPosts(params) {
    const response = await apiClient.get('article/new', { params });
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

  async listMyPosts(params) {
    const response = await apiClient.get('article/my', { params });
    const { data, meta } = extractData(response);
    const posts = data.map(mapArticleToPost);
    return {
      items: posts,
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

    if (hasNumericFallback) {
      article = await fetchArticleDetailById(numericIdFallback);
    }

    if (!article && slugCandidate) {
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

  async listComments(articleId, { page = 1, limit = 10, parentId } = {}) {
    const targetId = toNumber(articleId);
    if (!Number.isFinite(targetId)) {
      return { items: [] };
    }
    const params = {
      page,
      limit,
    };
    if (parentId !== undefined && parentId !== null) {
      const parentNumeric = toNumber(parentId);
      if (Number.isFinite(parentNumeric)) {
        params.parent_id = parentNumeric;
      }
    }
    const response = await apiClient.get(`article/show-comment/${targetId}`, {
      params,
    });
    const payload = response ?? {};
    const dataSource = payload?.data ?? payload;
    const commentsArray = normalizeCommentResponse(dataSource);
    const metaSource =
      payload?.meta ??
      payload?.data?.meta ??
      payload?.metadata ??
      null;
    const resolvedMeta = metaSource
      ? {
          page: toNumber(metaSource.page) ?? page,
          limit: toNumber(metaSource.limit) ?? limit,
          total: toNumber(metaSource.total),
          mode: metaSource.mode ?? (parentId ? 'replies' : 'top_level'),
          parentId:
            toNumber(metaSource.parent_id) ??
            toNumber(metaSource.parentId) ??
            (parentId ?? null),
        }
      : {
          page,
          limit,
          total: undefined,
          mode: parentId ? 'replies' : 'top_level',
          parentId: parentId ?? null,
        };
    return {
      items: commentsArray
        .map(mapComment)
        .filter((comment) => Boolean(comment?.content)),
      meta: resolvedMeta,
    };
  },

  async createComment(articleId, payload = {}) {
    const targetId = toNumber(articleId);
    if (!Number.isFinite(targetId)) {
      throw new Error('Invalid article id');
    }
    const body = {
      content: payload?.content ?? payload?.comment ?? '',
    };
    if (payload?.parentId !== undefined && payload?.parentId !== null) {
      const parentNumeric = toNumber(payload.parentId);
      if (Number.isFinite(parentNumeric)) {
        body.parent_id = parentNumeric;
      }
    }
    const response = await apiClient.post(`article/comment/${targetId}`, { body });
    const data = response?.data ?? response;
    const mapped = mapComment(data);
    if (mapped?.content) {
      return mapped;
    }
    return mapComment({
      id: `local-${Date.now()}`,
      content: body.content,
      created_at: new Date().toISOString(),
    });
  },

  async createPost(payload = {}) {
    const formData = new FormData();
    const title = payload.title ?? '';
    const summary = payload.summary ?? payload.excerpt ?? '';
    const content = payload.content ?? '';
    const status = payload.status ?? 'pending';

    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('status', status);

    if (payload.topicId !== undefined && payload.topicId !== null) {
      formData.append('topic_id', String(payload.topicId));
    }

    if (payload.mainVideoUrl) {
      formData.append('main_video_url', payload.mainVideoUrl);
    }

    const hasStructure =
      payload.structure &&
      typeof payload.structure === 'object' &&
      Array.isArray(payload.structure.sections);

    if (hasStructure) {
      try {
        formData.append('structure', JSON.stringify(payload.structure));
      } catch (structureError) {
        console.warn(
          'Unable to serialize structure, falling back to default.',
          structureError,
        );
      }
    } else if (content) {
      formData.append(
        'structure',
        JSON.stringify({
          sections: [
            {
              title: '',
              content,
              media: [],
            },
          ],
        }),
      );
    }

    if (payload.coverFile) {
      formData.append('cover', payload.coverFile);
    }

    if (Array.isArray(payload.mediaFiles)) {
      payload.mediaFiles.forEach((entry, index) => {
        if (!entry) return;
        const file = entry.file ?? entry;
        if (!file?.uri && !file?.path) return;
        const name =
          entry.fileKey ??
          file.name ??
          `media-${index}.jpg`;
        const mediaType =
          file.type && file.type.includes('/') ? file.type : 'image/jpeg';
        const fileToAppend = {
          uri: file.uri ?? file.path,
          type: mediaType,
          name,
        };
        formData.append('media', fileToAppend);
      });
    }

    try {
      const response = await apiClient.post('article/create', { body: formData });
      const base = response?.data ?? response;
      const createdId =
        toNumber(base?.id) ?? toNumber(base?.article_id) ?? undefined;
      if (createdId) {
        try {
          const detail = await postsService.getPost({ id: createdId });
          if (detail) {
            return {
              ...detail,
              status: detail.status ?? status,
              raw: { ...detail.raw, status: detail.status ?? status },
            };
          }
        } catch (detailError) {
          console.warn('Unable to fetch created article detail', detailError);
        }
      }

      const fallbackArticle = mapArticleToPost({
        id: base?.id ?? `pending-${Date.now()}`,
        slug: base?.slug,
        title,
        summary,
        content,
        status,
        main_image_url: base?.image ?? null,
        created_at: new Date().toISOString(),
      });
      return {
        ...fallbackArticle,
        status,
        raw: { ...fallbackArticle.raw, status },
      };
    } catch (error) {
      console.warn('Create article failed', error);
      throw error;
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

  async shareArticle(slug) {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Invalid article slug');
    }
    const response = await apiClient.post(`article/share/${slug}`);
    const data = response?.data ?? response;
    return {
      articleId: toNumber(data?.article_id),
      slug: data?.slug,
      shared: Boolean(data?.shared),
      shareCount: toNumber(data?.share_count),
    };
  },
};

