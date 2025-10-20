import { useCallback, useEffect, useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { useAuthStore } from '../store/auth.store';
import { useLikesStore } from '../store/likes.store';
import { QUERY_KEYS } from '../utils/constants';

const EMPTY_LIKES_MAP = Object.freeze({});

const DEFAULT_PAGE_SIZE = 10;

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', 'y'].includes(normalized)) return true;
    if (['false', 'no', 'n'].includes(normalized)) return false;
  }
  return Boolean(value);
};

const deriveArticleKey = (item) => {
  if (!item) return null;
  const candidates = [
    item.articleId,
    item.article_id,
    item.id,
    item.raw?.article_id,
    item.raw?.id,
  ];

  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue;
    const numeric = Number(candidate);
    if (Number.isFinite(numeric)) {
      return String(numeric);
    }
  }

  return null;
};

const applyLikedToItem = (item, likedLookup, hasActiveUser) => {
  if (!item) return item;
  const articleKey = deriveArticleKey(item);
  const nextLiked = hasActiveUser
    ? Boolean(articleKey && likedLookup?.[articleKey])
    : false;
  const currentLiked = normalizeBoolean(item.liked);

  if (currentLiked === nextLiked) {
    return item;
  }

  if (!nextLiked && item.liked === undefined) {
    return item;
  }

  return { ...item, liked: nextLiked };
};

const mapItemsIfNeeded = (items, likedLookup, hasActiveUser) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { items, changed: false };
  }

  let changed = false;
  const nextItems = items.map((item) => {
    const nextItem = applyLikedToItem(item, likedLookup, hasActiveUser);
    if (nextItem !== item) {
      changed = true;
    }
    return nextItem;
  });

  return { items: changed ? nextItems : items, changed };
};

const applyLikedToListData = (data, likedLookup, hasActiveUser) => {
  if (!data) return data;

  const { items: nextItems, changed: flatChanged } = mapItemsIfNeeded(
    data.items,
    likedLookup,
    hasActiveUser,
  );

  let pagesChanged = false;
  let nextPages = data.pages;

  if (Array.isArray(data.pages)) {
    nextPages = data.pages.map((page) => {
      if (!page?.items) return page;
      const { items: pageItems, changed } = mapItemsIfNeeded(
        page.items,
        likedLookup,
        hasActiveUser,
      );
      if (!changed) return page;
      pagesChanged = true;
      return { ...page, items: pageItems };
    });
  }

  if (!flatChanged && !pagesChanged) {
    return data;
  }

  return {
    ...data,
    items: flatChanged ? nextItems : data.items,
    pages: pagesChanged ? nextPages : data.pages,
  };
};

const toNumberOrUndefined = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const normalizeDetailTarget = (input) => {
  if (!input) {
    return { key: null, params: null };
  }

  if (typeof input === 'object' && !Array.isArray(input)) {
    const slugValue =
      input.postSlug ??
      input.slug ??
      input.slugId ??
      input.identifierSlug ??
      null;

    const rawId =
      input.articleId ??
      input.postId ??
      input.id ??
      input.identifier ??
      null;

    const numericId = toNumberOrUndefined(rawId);
    const stringId =
      rawId !== null && rawId !== undefined ? String(rawId).trim() : null;

    if (slugValue) {
      const slug = String(slugValue).trim();
      if (slug) {
        return {
          key: `slug:${slug}`,
          params: {
            slug,
            articleId: numericId,
            id: numericId ?? stringId ?? undefined,
          },
        };
      }
    }

    if (numericId !== undefined) {
      return {
        key: numericId,
        params: { articleId: numericId, id: numericId },
      };
    }

    if (stringId) {
      return {
        key: stringId,
        params: { id: stringId },
      };
    }

    return { key: null, params: null };
  }

  if (typeof input === 'number') {
    if (Number.isFinite(input)) {
      return {
        key: input,
        params: { articleId: input, id: input },
      };
    }
    return { key: null, params: null };
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) {
      return { key: null, params: null };
    }
    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      return {
        key: trimmed,
        params: { articleId: numeric, id: trimmed },
      };
    }
    return {
      key: `slug:${trimmed}`,
      params: { slug: trimmed },
    };
  }

  return { key: null, params: null };
};

export const resolvePagination = (meta = {}, fallbackPageSize = DEFAULT_PAGE_SIZE) => {
  const pagination = meta?.pagination ?? meta ?? {};
  const pageSize =
    pagination.pageSize ??
    pagination.perPage ??
    pagination.limit ??
    pagination.size ??
    pagination.take ??
    fallbackPageSize;
  const currentPage =
    pagination.page ??
    pagination.currentPage ??
    pagination.current_page ??
    pagination.pageNumber ??
    (typeof pagination.offset === 'number'
      ? Math.floor(pagination.offset / pageSize) + 1
      : undefined);
  const totalPages =
    pagination.pageCount ??
    pagination.totalPages ??
    pagination.total_pages ??
    pagination.pages ??
    (typeof pagination.total === 'number'
      ? Math.ceil(pagination.total / pageSize || 1)
      : undefined);
  const hasNextPageExplicit =
    pagination.hasNextPage ?? pagination.has_next_page ?? undefined;
  const nextExplicit =
    pagination.next ??
    pagination.nextPage ??
    pagination.next_page ??
    (hasNextPageExplicit === true && currentPage
      ? currentPage + 1
      : undefined);

  const hasNextPageImplicit =
    typeof hasNextPageExplicit === 'boolean'
      ? hasNextPageExplicit
      : currentPage && totalPages
        ? currentPage < totalPages
        : undefined;

  return {
    pageSize,
    currentPage,
    totalPages,
    totalItems:
      pagination.total ??
      pagination.totalItems ??
      pagination.count ??
      pagination.totalCount ??
      undefined,
    hasNextPage:
      typeof hasNextPageExplicit === 'boolean'
        ? hasNextPageExplicit
        : hasNextPageImplicit,
    nextPage: nextExplicit,
  };
};

export const usePosts = (postIdentifier, { pageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const queryClient = useQueryClient();
  const { key: detailKey, params: detailParams } = useMemo(
    () => normalizeDetailTarget(postIdentifier),
    [postIdentifier],
  );
  const user = useAuthStore((state) => state.user);
  const userKey = user?.id ?? user?.email ?? null;
  const likesHydrated = useLikesStore((state) => state.hydrated);
  const selectLikedMap = useCallback(
    (state) => {
      if (!userKey) return EMPTY_LIKES_MAP;
      return state.likedByUser[userKey] ?? EMPTY_LIKES_MAP;
    },
    [userKey],
  );
  const likedMap = useLikesStore(selectLikedMap);
  const hasActiveUser = Boolean(userKey);

  useEffect(() => {
    if (!likesHydrated) return;

    const likedLookup = hasActiveUser ? likedMap : EMPTY_LIKES_MAP;

    const applyListOverrides = (oldData) =>
      applyLikedToListData(oldData, likedLookup, hasActiveUser);

    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.POSTS.LIST },
      (oldData) => applyListOverrides(oldData),
    );
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.POSTS.TREND },
      (oldData) => applyListOverrides(oldData),
    );
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.POSTS.NEW },
      (oldData) => applyListOverrides(oldData),
    );

    const detailQueries = queryClient
      .getQueryCache()
      .findAll({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'posts' &&
          query.queryKey.length === 2,
      });

    detailQueries.forEach((query) => {
      queryClient.setQueryData(query.queryKey, (previous) =>
        applyLikedToItem(previous, likedLookup, hasActiveUser),
      );
    });
  }, [hasActiveUser, likedMap, likesHydrated, queryClient, userKey]);

  const listQuery = useInfiniteQuery({
    queryKey: [...QUERY_KEYS.POSTS.LIST, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      postsService.listPosts({ page: pageParam, limit: pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { hasNextPage, nextPage, currentPage } = resolvePagination(
        lastPage?.meta,
        pageSize,
      );
      if (nextPage) return nextPage;
      if (hasNextPage === false) return undefined;
      if (hasNextPage === true) {
        return (currentPage ?? allPages.length) + 1;
      }
      if ((lastPage?.items ?? []).length < pageSize) {
        return undefined;
      }
      return (currentPage ?? allPages.length) + 1;
    },
    select: (data) => {
      const pages = data?.pages ?? [];
      const items = pages.flatMap((page) => page?.items ?? []);
      const lastMeta = pages.length ? pages[pages.length - 1]?.meta : undefined;
      const base = {
        ...data,
        items,
        meta: lastMeta,
      };
      const likedLookup = hasActiveUser ? likedMap : EMPTY_LIKES_MAP;
      return applyLikedToListData(base, likedLookup, hasActiveUser);
    },
  });

  const detailQuery = useQuery({
    queryKey: detailKey ? QUERY_KEYS.POSTS.DETAIL(detailKey) : [],
    queryFn: () => postsService.getPost(detailParams),
    enabled: Boolean(detailKey && detailParams),
    select: (post) => {
      const likedLookup = hasActiveUser ? likedMap : EMPTY_LIKES_MAP;
      return applyLikedToItem(post, likedLookup, hasActiveUser);
    },
  });

  const createMutation = useMutation({
    mutationKey: ['posts', 'create'],
    mutationFn: postsService.createPost,
    onSuccess: (createdPost) => {
      queryClient.setQueryData(QUERY_KEYS.POSTS.LIST, (previous) => {
        if (!previous) return { items: [createdPost], meta: undefined };
        const items = Array.isArray(previous.items)
          ? [createdPost, ...previous.items]
          : [createdPost];
        return { ...previous, items };
      });
      queryClient.setQueryData(QUERY_KEYS.POSTS.NEW, (previous) => {
        if (!previous) return { items: [createdPost], meta: undefined };
        const items = Array.isArray(previous.items)
          ? [createdPost, ...previous.items]
          : [createdPost];
        return { ...previous, items };
      });
      queryClient.setQueryData(
        QUERY_KEYS.POSTS.DETAIL(createdPost.id),
        createdPost,
      );
    },
  });

  return {
    listQuery,
    detailQuery,
    createPost: createMutation.mutateAsync,
    createStatus: createMutation.status,
  };
};
