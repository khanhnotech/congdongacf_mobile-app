import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { useAuthStore } from '../store/auth.store';
import { useLikesStore } from '../store/likes.store';
import { useAuthRedirect } from './useAuthRedirect';
import { QUERY_KEYS } from '../utils/constants';

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const getArticleIdFromItem = (item) =>
  toNumber(
    item?.articleId ??
      item?.raw?.article_id ??
      item?.raw?.id ??
      item?.raw?.articleId ??
      item?.id,
  );

const applyLikeUpdate = (oldData, articleId, liked, likeCount) => {
  if (!oldData) return oldData;

  const applyToItems = (items) => {
    if (!Array.isArray(items)) return items;
    return items.map((item) => {
      const itemArticleId = getArticleIdFromItem(item);
      if (itemArticleId !== articleId) return item;
      return {
        ...item,
        liked,
        likeCount:
          typeof likeCount === 'number'
            ? likeCount
            : typeof item.likeCount === 'number'
              ? item.likeCount
              : 0,
      };
    });
  };

  const pages = oldData.pages
    ? oldData.pages.map((page) => {
        if (!page?.items) return page;
        return { ...page, items: applyToItems(page.items) };
      })
    : oldData.pages;

  const items = applyToItems(oldData.items);

  return { ...oldData, pages, items };
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  const { requireAuth } = useAuthRedirect();

  const mutation = useMutation({
    mutationKey: ['posts', 'toggle-like'],
    mutationFn: postsService.toggleLike,
    onSuccess: ({ articleId, liked, likeCount }) => {
      if (!Number.isFinite(articleId)) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.LIST });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.TREND });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.NEW });
        return;
      }

      const normalizedLikeCount =
        typeof likeCount === 'number' ? likeCount : undefined;

      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.POSTS.LIST },
        (oldData) => applyLikeUpdate(oldData, articleId, liked, normalizedLikeCount),
      );
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.POSTS.TREND },
        (oldData) => applyLikeUpdate(oldData, articleId, liked, normalizedLikeCount),
      );
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.POSTS.NEW },
        (oldData) => applyLikeUpdate(oldData, articleId, liked, normalizedLikeCount),
      );

      const detailKey = QUERY_KEYS.POSTS.DETAIL(articleId);
      queryClient.setQueryData(detailKey, (previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          liked,
          likeCount:
            typeof normalizedLikeCount === 'number'
              ? normalizedLikeCount
              : typeof previous.likeCount === 'number'
                ? previous.likeCount
                : 0,
        };
      });

      const detailKeyString = QUERY_KEYS.POSTS.DETAIL(String(articleId));
      queryClient.setQueryData(detailKeyString, (previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          liked,
          likeCount:
            typeof normalizedLikeCount === 'number'
              ? normalizedLikeCount
              : typeof previous.likeCount === 'number'
                ? previous.likeCount
                : 0,
        };
      });

      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'posts' &&
            query.queryKey.length === 2 &&
            typeof query.queryKey[1] === 'string' &&
            query.queryKey[1].startsWith('slug:'),
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (previous) => {
            if (!previous) return previous;
            const candidateArticleId = toNumber(
              previous.articleId ??
                previous?.raw?.article_id ??
                previous?.raw?.id ??
                previous.id,
            );
            if (!Number.isFinite(candidateArticleId) || candidateArticleId !== articleId) {
              return previous;
            }
            return {
              ...previous,
              liked,
              likeCount:
                typeof normalizedLikeCount === 'number'
                  ? normalizedLikeCount
                  : typeof previous.likeCount === 'number'
                    ? previous.likeCount
                    : 0,
            };
          });
        });

      const authState = useAuthStore.getState();
      const currentUser = authState?.user;
      const userKey = currentUser?.id ?? currentUser?.email ?? null;
      if (userKey && typeof liked === 'boolean') {
        useLikesStore.getState().setLikedStatus(userKey, articleId, liked);
      }
    },
  });

  return {
    toggleLike: requireAuth(mutation.mutateAsync, 'thích bài viết'),
    toggleLikeStatus: mutation.status,
    toggleLikeError: mutation.error,
    resetToggleLike: mutation.reset,
  };
};
