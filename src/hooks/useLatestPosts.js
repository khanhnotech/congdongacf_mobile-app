import { useInfiniteQuery } from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from '../utils/constants';
import { resolvePagination } from './usePosts';

export const useLatestPosts = ({ pageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const listQuery = useInfiniteQuery({
    queryKey: [...QUERY_KEYS.POSTS.NEW, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      postsService.listNewPosts({ page: pageParam, limit: pageSize }),
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

  return { listQuery };
};
