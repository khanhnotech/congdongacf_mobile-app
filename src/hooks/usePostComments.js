import { useCallback, useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { QUERY_KEYS } from '../utils/constants';

const DISABLED_COMMENTS_KEY = ['posts', 'comments', 'disabled'];

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

export const usePostComments = (
  articleId,
  { pageSize = 10, parentId } = {},
) => {
  const queryClient = useQueryClient();

  const numericId = useMemo(() => {
    const value = Number(articleId);
    return Number.isFinite(value) ? value : undefined;
  }, [articleId]);

  const limit = useMemo(() => {
    const parsed = Number(pageSize);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 10;
    }
    return Math.min(Math.max(Math.trunc(parsed), 1), 50);
  }, [pageSize]);

  const queryKey = useMemo(
    () =>
      typeof numericId === 'number'
        ? [
            ...QUERY_KEYS.POSTS.COMMENTS(numericId),
            parentId ?? null,
            limit,
          ]
        : DISABLED_COMMENTS_KEY,
    [limit, numericId, parentId],
  );

  const listQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      postsService.listComments(numericId, {
        page: pageParam,
        limit,
        parentId,
      }),
    enabled: typeof numericId === 'number',
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta ?? {};
      const currentPage = toNumber(meta.page);
      const pageLimit = toNumber(meta.limit) ?? limit;
      const total = toNumber(meta.total);

      if (currentPage === undefined) {
        if ((lastPage?.items ?? []).length < pageLimit) {
          return undefined;
        }
        return 2;
      }

      if (typeof total === 'number') {
        const totalPages = Math.ceil(total / pageLimit);
        if (currentPage < totalPages) {
          return currentPage + 1;
        }
        return undefined;
      }

      if ((lastPage?.items ?? []).length < pageLimit) {
        return undefined;
      }

      return currentPage + 1;
    },
    staleTime: 0,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async ({ content }) => {
      if (typeof numericId !== 'number') {
        throw new Error('Invalid article id');
      }
      return postsService.createComment(numericId, { content, parentId });
    },
    onSuccess: (createdComment) => {
      if (typeof numericId !== 'number' || !createdComment?.content) {
        return;
      }
      queryClient.setQueryData(queryKey, (previous) => {
        if (!previous) {
          return {
            pageParams: [1],
            pages: [
              {
                items: [createdComment],
                meta: {
                  page: 1,
                  limit,
                  total: 1,
                  mode: parentId ? 'replies' : 'top_level',
                  parentId: parentId ?? null,
                },
              },
            ],
          };
        }

        const pages = Array.isArray(previous.pages)
          ? [...previous.pages]
          : [];

        if (!pages.length) {
          pages.push({
            items: [createdComment],
            meta: {
              page: 1,
              limit,
              total: 1,
              mode: parentId ? 'replies' : 'top_level',
              parentId: parentId ?? null,
            },
          });
        } else {
          const firstPage = pages[0] ?? {};
          const firstItems = Array.isArray(firstPage.items)
            ? [createdComment, ...firstPage.items]
            : [createdComment];
          const firstMeta = firstPage.meta ?? {};
          pages[0] = {
            ...firstPage,
            items: firstItems,
            meta: {
              ...firstMeta,
              page: toNumber(firstMeta.page) ?? 1,
              limit: toNumber(firstMeta.limit) ?? limit,
              total:
                typeof firstMeta.total === 'number'
                  ? firstMeta.total + 1
                  : firstMeta.total ?? firstItems.length,
              mode: firstMeta.mode ?? (parentId ? 'replies' : 'top_level'),
              parentId: firstMeta.parentId ?? parentId ?? null,
            },
          };
        }

        return {
          ...previous,
          pages,
        };
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const submitComment = useCallback(
    async (content) => {
      const text = typeof content === 'string' ? content.trim() : '';
      if (!text) {
        throw new Error('Nội dung bình luận không được để trống.');
      }
      return mutation.mutateAsync({ content: text });
    },
    [mutation],
  );

  const flatComments = useMemo(() => {
    const pages = listQuery.data?.pages ?? [];
    return pages.flatMap((page) => page?.items ?? []);
  }, [listQuery.data]);

  return {
    listQuery,
    comments: flatComments,
    meta: listQuery.data?.pages?.[0]?.meta,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    isFetching: listQuery.isFetching,
    isRefetching: listQuery.isRefetching,
    hasNextPage: listQuery.hasNextPage,
    fetchNextPage: listQuery.fetchNextPage,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    createComment: submitComment,
    createStatus: mutation.status,
    createError: mutation.error,
  };
};
