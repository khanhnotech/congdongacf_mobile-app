import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { QUERY_KEYS } from '../utils/constants';

const DEFAULT_PAGE_SIZE = 10;

const resolvePagination = (meta = {}, fallbackPageSize = DEFAULT_PAGE_SIZE) => {
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

export const usePosts = (postId, { pageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const queryClient = useQueryClient();

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
      return {
        ...data,
        items,
        meta: lastMeta,
      };
    },
  });

  const detailQuery = useQuery({
    queryKey: postId ? QUERY_KEYS.POSTS.DETAIL(postId) : [],
    queryFn: () => postsService.getPost(postId),
    enabled: Boolean(postId),
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
